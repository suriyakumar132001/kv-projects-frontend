// ===============================================
// KV Projects ERP
// Add Site
// ===============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, RotateCcw, MapPin, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import siteService from "../../services/siteService";
import { createProject } from "../../services/projectService";
import "./Site.css";

// ===============================================
// Map a Site status onto the matching Project status
// (Project statuses: Pending, Running, Completed, On Hold)
// ===============================================
const mapSiteStatusToProjectStatus = (siteStatus) => {
  switch (siteStatus) {
    case "Planning":
      return "Pending";
    case "Started":
    case "In Progress":
      return "Running";
    case "Completed":
      return "Completed";
    case "On Hold":
      return "On Hold";
    default:
      return "Pending";
  }
};

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

export default function AddSite() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
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

    // Coordinates are optional, but if one is set the other must be too —
    // a lone lat or lng is worse than none (skips verification silently
    // wrong instead of skipping it cleanly).
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

      const siteResponse = await siteService.createSite(payload);

      const createdSite =
        siteResponse?.site || siteResponse?.data || siteResponse;

      toast.success("Site created successfully");

      // ===========================================
      // Auto-create the matching Project.
      // This runs after the site is saved and is
      // non-blocking: a failure here should not make
      // it look like the site itself failed to save.
      // ===========================================

      try {
        const projectPayload = {
          projectName: payload.projectName,
          clientName: payload.clientName,
          location: payload.location,
          description: payload.description,
          // projectManager is an ObjectId ref to User on the backend.
          // Sending "" would throw a Mongoose CastError, so we omit
          // it by sending null until the Add Site form collects an
          // actual engineer/manager selection.
          projectManager: null,
          startDate: null,
          endDate: null,
          budget: 0,
          progress: 0,
          status: mapSiteStatusToProjectStatus(payload.status),
          // Project schema field is "site" (ObjectId ref "Site"), not "siteId".
          site: createdSite?._id || null,
        };

        await createProject(projectPayload);

        toast.success("Project created for this site");
      } catch (projectError) {
        console.error("Auto Create Project Error:", projectError);

        toast.warn(
          "Site was created, but the linked project could not be created automatically. Please add it manually from Projects.",
        );
      }

      navigate("../sites");
    } catch (error) {
      console.error("Create Site Error:", error);

      toast.error(error?.response?.data?.message || "Failed to create site");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
  };

  return (
    <div className="site-form-page">
      <div style={{ width: "100%", maxWidth: "900px" }}>
        <div className="site-form-header">
          <div className="site-form-header-left">
            <button
              type="button"
              onClick={() => navigate("../sites")}
              className="icon-btn"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1>Add Site</h1>
              <p>Create a new construction site</p>
            </div>
          </div>

          <div className="header-icon-badge">
            <MapPin size={22} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="site-form-card">
          <div className="site-form-card-header">
            <h2>Site Information</h2>
            <p>Enter the basic site details</p>
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
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
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
                Used to verify employee check-ins happen at the site. Stand at
                the site and tap the button, or leave blank to skip GPS
                verification for this site.
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
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleUseCurrentLocation}
                  disabled={locating}
                  style={{ height: "42px" }}
                >
                  {locating ? (
                    <Loader2 size={17} className="spin" />
                  ) : (
                    <MapPin size={17} />
                  )}
                  {locating ? "Locating..." : "Use My Current Location"}
                </button>
              </div>
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
              onClick={() => navigate("../sites")}
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
              {saving ? "Creating..." : "Create Site"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
