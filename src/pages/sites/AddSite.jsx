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
};

export default function AddSite() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
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
