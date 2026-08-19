// ===============================================
// KV Projects ERP
// Edit Site
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, RotateCcw, MapPin, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";

import siteService from "../../services/siteService";
import SiteLocationPicker from "../../components/SiteLocationPicker";
import "./Site.css";

const initialForm = {
  siteName: "",
  projectName: "",
  location: "",
  description: "",
  clientName: "",
  status: "Planning",
  latitude: "",
  longitude: "",
  geofenceRadius: 200,
};

export default function EditSite() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const loadSite = async () => {
      try {
        setLoading(true);

        const response = await siteService.getSite(id);

        const site = response?.site || response?.data || response;

        if (!site) {
          toast.error("Site not found");
          navigate("../sites");
          return;
        }

        setForm({
          siteName: site.siteName || "",
          projectName: site.projectName || "",
          location: site.location || "",
          description: site.description || "",
          clientName: site.clientName || "",
          status: site.status || "Planning",
          latitude:
            site.latitude === null || site.latitude === undefined
              ? ""
              : String(site.latitude),
          longitude:
            site.longitude === null || site.longitude === undefined
              ? ""
              : String(site.longitude),
          geofenceRadius: site.geofenceRadius ?? 200,
        });
      } catch (error) {
        console.error("Load Site Error:", error);

        toast.error(error?.response?.data?.message || "Failed to load site");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSite();
    }
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ===============================================
  // Fired by SiteLocationPicker on click/drag — keeps
  // the number inputs and the map in sync no matter
  // which one the user touches.
  // ===============================================
  const handleMapChange = (lat, lng) => {
    setForm((previous) => ({
      ...previous,
      latitude: String(lat),
      longitude: String(lng),
    }));
  };

  // ===============================================
  // Wipe the pin back to blank. Combined with Update
  // Site this is what actually deletes a previously
  // saved location — handleSubmit below sends
  // latitude/longitude as null whenever the fields are
  // blank, and the backend's Site model treats null as
  // "not geo-tagged" (see verifyLocation()).
  // ===============================================
  const handleClearLocation = () => {
    setForm((previous) => ({
      ...previous,
      latitude: "",
      longitude: "",
    }));
  };

  // ===============================================
  // Use the browser's Geolocation API to fill in
  // latitude/longitude — same capture pattern as the
  // check-in flow in MarkAttendance.jsx, so an
  // Admin/Owner can just stand at the site and tap
  // one button instead of typing coordinates.
  // ===============================================
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Your browser doesn't support location");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((previous) => ({
          ...previous,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));

        setLocating(false);
        toast.success("Location captured");
      },
      (error) => {
        console.warn("Geolocation error:", error.message);
        toast.error("Unable to get your location. Check browser permissions.");
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const validateForm = () => {
    if (!form.siteName.trim()) {
      toast.error("Please enter site name");
      return false;
    }

    if (!form.projectName.trim()) {
      toast.error("Please enter project name");
      return false;
    }

    if (!form.location.trim()) {
      toast.error("Please enter site location");
      return false;
    }

    const hasLat = form.latitude !== "";
    const hasLng = form.longitude !== "";

    if (hasLat !== hasLng) {
      toast.error(
        "Please provide both latitude and longitude, or leave both blank",
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        siteName: form.siteName.trim(),
        projectName: form.projectName.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        clientName: form.clientName.trim(),
        status: form.status,
        latitude: form.latitude !== "" ? Number(form.latitude) : null,
        longitude: form.longitude !== "" ? Number(form.longitude) : null,
        geofenceRadius:
          form.geofenceRadius !== "" ? Number(form.geofenceRadius) : 200,
      };

      await siteService.updateSite(id, payload);

      toast.success("Site updated successfully");

      navigate(`../sites/view/${id}`);
    } catch (error) {
      console.error("Update Site Error:", error);

      toast.error(error?.response?.data?.message || "Failed to update site");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset all changes?")) {
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="loading-center">
        <Loader2 size={24} className="spin" />
        <span>Loading site...</span>
      </div>
    );
  }

  return (
    <div className="site-form-page">
      <div style={{ width: "100%", maxWidth: "900px" }}>
        <div className="site-form-header">
          <div className="site-form-header-left">
            <button
              type="button"
              onClick={() => navigate(`../sites/view/${id}`)}
              className="icon-btn"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1>Edit Site</h1>
              <p>Update construction site information</p>
            </div>
          </div>

          <div className="header-icon-badge">
            <MapPin size={22} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="site-form-card">
          <div className="site-form-card-header">
            <h2>Site Information</h2>
            <p>Update the basic site details</p>
          </div>

          <div className="form-grid" style={{ padding: "24px" }}>
            <div className="form-group">
              <label>
                Site Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="siteName"
                value={form.siteName}
                onChange={handleChange}
                placeholder="Enter site name"
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label>
                Project Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="projectName"
                value={form.projectName}
                onChange={handleChange}
                placeholder="Enter project name"
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label>
                Location <span className="required">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter site location"
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label>Client Name</label>
              <input
                type="text"
                name="clientName"
                value={form.clientName}
                onChange={handleChange}
                placeholder="Enter client name"
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="Planning">Planning</option>
                <option value="Started">Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Enter site description..."
                disabled={saving}
              />
            </div>

            <div className="form-group full-width">
              <label>GPS Coordinates</label>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted, #6b7280)",
                  margin: "0 0 10px",
                }}
              >
                Used to verify employee check-ins happen at the site. Click the
                map or drag the pin to place it, tap "Use My Current Location"
                while standing at the site, or clear it to skip GPS verification
                for this site.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  alignItems: "flex-end",
                }}
              >
                <div
                  className="form-group"
                  style={{ flex: "1 1 160px", margin: 0 }}
                >
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    placeholder="e.g. 28.613900"
                    disabled={saving}
                  />
                </div>

                <div
                  className="form-group"
                  style={{ flex: "1 1 160px", margin: 0 }}
                >
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    placeholder="e.g. 77.209000"
                    disabled={saving}
                  />
                </div>

                <div
                  className="form-group"
                  style={{ flex: "1 1 140px", margin: 0 }}
                >
                  <label>Geofence Radius (m)</label>
                  <input
                    type="number"
                    min="0"
                    name="geofenceRadius"
                    value={form.geofenceRadius}
                    onChange={handleChange}
                    placeholder="200"
                    disabled={saving}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleUseCurrentLocation}
                  disabled={saving || locating}
                  style={{ height: "42px" }}
                >
                  {locating ? (
                    <Loader2 size={17} className="spin" />
                  ) : (
                    <MapPin size={17} />
                  )}
                  {locating ? "Locating..." : "Use My Current Location"}
                </button>

                {(form.latitude !== "" || form.longitude !== "") && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleClearLocation}
                    disabled={saving}
                    style={{ height: "42px" }}
                  >
                    <X size={17} />
                    Clear Location
                  </button>
                )}
              </div>

              <SiteLocationPicker
                latitude={form.latitude !== "" ? Number(form.latitude) : null}
                longitude={
                  form.longitude !== "" ? Number(form.longitude) : null
                }
                radius={
                  form.geofenceRadius !== "" ? Number(form.geofenceRadius) : 200
                }
                onChange={handleMapChange}
              />
            </div>
          </div>

          <div
            className="form-buttons"
            style={{
              padding: "18px 24px",
              background: "var(--bg)",
              borderTop: "1px solid var(--border)",
            }}
          >
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="btn btn-outline"
            >
              <RotateCcw size={17} />
              Reset
            </button>

            <button
              type="button"
              onClick={() => navigate(`../sites/view/${id}`)}
              disabled={saving}
              className="btn btn-outline"
            >
              Cancel
            </button>

            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? (
                <Loader2 size={17} className="spin" />
              ) : (
                <Save size={17} />
              )}
              {saving ? "Updating..." : "Update Site"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
