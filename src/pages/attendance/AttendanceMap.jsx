// ===============================================
// KV Projects ERP
// AttendanceMap — Owner/Admin view of today's check-ins
// on a map, plotted against each site's geofence.
// ===============================================
//
// Uses plain Leaflet (not react-leaflet) directly via a ref + useEffect,
// to sidestep react-leaflet's React-version compatibility constraints —
// this app is on React 19. Leaflet + OpenStreetMap tiles are free, no
// API key required (subject to OSM's usage policy for light traffic).
//
// Never exposes biometric data here — only what getAttendance() already
// returns (see attendanceController.js): coordinates, distances, and
// verified/flagged booleans, same as the Attendance List/Details pages.
// ===============================================

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";

import attendanceService from "../../services/attendanceService";

import "./AttendanceMap.css";

// Leaflet's default marker icon URLs break under most bundlers (Vite
// included) because the image imports don't resolve the way Leaflet's
// packaged CSS expects. Point them at unpkg's CDN copies instead —
// small, static image assets, not remotely sensitive.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_CENTER = [11.0168, 76.9558]; // Coimbatore — reasonable
// fallback only; the map re-centers on real data as soon as it loads.

const statusOf = (record) => {
  // Overall dot color for the check-in marker. "Flagged" wins if either
  // location or face verification came back explicitly false — mirrors
  // the same flag-not-block philosophy as the backend and Attendance
  // List page. null just means "not checked", not a problem.
  if (record.locationVerified === false || record.faceVerified === false) {
    return "flagged";
  }

  if (record.locationVerified === true || record.faceVerified === true) {
    return "verified";
  }

  return "unchecked";
};

const STATUS_COLOR = {
  verified: "#16a34a",
  flagged: "#dc2626",
  unchecked: "#9ca3af",
};

const AttendanceMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const layerGroupRef = useRef(null);

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("today"); // today | all

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getAttendance();
      setAttendance(res.attendance || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load attendance");
    } finally {
      setLoading(false);
    }
  };

  // ---- Init the map once ----
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView(DEFAULT_CENTER, 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    layerGroupRef.current = L.layerGroup().addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // ---- Redraw markers whenever data or the filter changes ----
  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    const today = new Date().toDateString();

    const visible = attendance.filter((record) => {
      if (dateFilter !== "today") return true;
      return new Date(record.attendanceDate).toDateString() === today;
    });

    const bounds = [];
    const plottedSiteIds = new Set();

    visible.forEach((record) => {
      // ---- Site marker + geofence circle (once per site) ----
      const site = record.site;

      if (
        site &&
        typeof site.latitude === "number" &&
        typeof site.longitude === "number" &&
        !plottedSiteIds.has(site._id)
      ) {
        plottedSiteIds.add(site._id);

        const siteLatLng = [site.latitude, site.longitude];

        L.circle(siteLatLng, {
          radius: site.geofenceRadius || 200,
          color: "#f97316",
          fillColor: "#f97316",
          fillOpacity: 0.08,
          weight: 1,
        }).addTo(layerGroupRef.current);

        L.circleMarker(siteLatLng, {
          radius: 7,
          color: "#f97316",
          fillColor: "#f97316",
          fillOpacity: 1,
        })
          .bindPopup(
            `<strong>${site.siteName}</strong><br/>${site.projectName || ""}<br/>Geofence: ${site.geofenceRadius || 200}m`,
          )
          .addTo(layerGroupRef.current);

        bounds.push(siteLatLng);
      }

      // ---- Check-in location marker ----
      const loc = record.checkInLocation;

      if (
        loc &&
        typeof loc.latitude === "number" &&
        typeof loc.longitude === "number"
      ) {
        const checkInLatLng = [loc.latitude, loc.longitude];
        const status = statusOf(record);

        L.circleMarker(checkInLatLng, {
          radius: 6,
          color: STATUS_COLOR[status],
          fillColor: STATUS_COLOR[status],
          fillOpacity: 0.9,
          weight: 2,
        })
          .bindPopup(
            `<strong>${record.employee?.name || "Unknown"}</strong>` +
              `<br/>${record.employee?.employeeId || ""}` +
              `<br/>${new Date(record.checkIn || record.attendanceDate).toLocaleString()}` +
              `<br/>Site: ${site?.siteName || "—"}` +
              `<br/>Distance: ${record.distanceFromSite != null ? `${record.distanceFromSite}m` : "—"}` +
              `<br/>Location: ${record.locationVerified === null ? "not checked" : record.locationVerified ? "verified" : "flagged"}` +
              `<br/>Face: ${record.faceVerified === null ? "not checked" : record.faceVerified ? "verified" : "flagged"}`,
          )
          .addTo(layerGroupRef.current);

        bounds.push(checkInLatLng);
      }
    });

    if (bounds.length) {
      mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    }
  }, [attendance, dateFilter]);

  return (
    <div className="attendance-map-page">
      <div className="attendance-map-header">
        <div>
          <h2>Attendance Map</h2>
          <p>Check-in locations plotted against each site's geofence.</p>
        </div>

        <div className="attendance-map-filter">
          <button
            type="button"
            className={dateFilter === "today" ? "active" : ""}
            onClick={() => setDateFilter("today")}
          >
            Today
          </button>
          <button
            type="button"
            className={dateFilter === "all" ? "active" : ""}
            onClick={() => setDateFilter("all")}
          >
            All
          </button>
        </div>
      </div>

      <div className="attendance-map-legend">
        <span>
          <i style={{ background: STATUS_COLOR.verified }} /> Verified
        </span>
        <span>
          <i style={{ background: STATUS_COLOR.flagged }} /> Flagged (outside
          geofence or face mismatch)
        </span>
        <span>
          <i style={{ background: STATUS_COLOR.unchecked }} /> Not checked
        </span>
        <span>
          <i style={{ background: "#f97316" }} /> Site (geofence radius shown)
        </span>
      </div>

      {loading && <p className="attendance-map-loading">Loading…</p>}

      <div ref={mapContainerRef} className="attendance-map-container" />
    </div>
  );
};

export default AttendanceMap;
