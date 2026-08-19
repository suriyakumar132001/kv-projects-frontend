// ===============================================
// KV Projects ERP
// LocationMap — small visual map preview showing the
// employee's just-captured GPS point, and (if the
// selected site has coordinates) the site's geofence
// circle for visual context before submitting.
//
// Purely visual. It never decides "inside/outside" —
// that stays authoritative on the backend (see
// verifyLocation() in attendanceController.js). This
// is just so the employee can see roughly where their
// location landed, same spirit as the Admin/Owner
// Attendance Map (AttendanceMap.jsx).
// ===============================================

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "./LocationMap.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LocationMap = ({
  latitude,
  longitude,
  siteLatitude,
  siteLongitude,
  siteRadius,
}) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  // Init once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(mapRef.current);

    layerRef.current = L.layerGroup().addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Redraw whenever the captured point (or site) changes.
  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;
    if (typeof latitude !== "number" || typeof longitude !== "number") return;

    layerRef.current.clearLayers();

    const bounds = [[latitude, longitude]];

    L.marker([latitude, longitude])
      .bindPopup("Your captured location")
      .addTo(layerRef.current);

    if (typeof siteLatitude === "number" && typeof siteLongitude === "number") {
      L.circle([siteLatitude, siteLongitude], {
        radius: siteRadius || 200,
        color: "#f97316",
        fillColor: "#f97316",
        fillOpacity: 0.1,
        weight: 1,
      }).addTo(layerRef.current);

      L.circleMarker([siteLatitude, siteLongitude], {
        radius: 5,
        color: "#f97316",
        fillColor: "#f97316",
        fillOpacity: 1,
      })
        .bindPopup("Site location")
        .addTo(layerRef.current);

      bounds.push([siteLatitude, siteLongitude]);
    }

    mapRef.current.fitBounds(bounds, { padding: [30, 30], maxZoom: 17 });

    // Leaflet sizes itself off the container's dimensions at init time;
    // since this map often mounts inside content that was just
    // revealed (location just captured), a resize nudge avoids a
    // half-rendered tile grid.
    setTimeout(() => mapRef.current?.invalidateSize(), 100);
  }, [latitude, longitude, siteLatitude, siteLongitude, siteRadius]);

  return <div ref={containerRef} className="location-map" />;
};

export default LocationMap;
