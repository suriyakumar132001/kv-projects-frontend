// ===============================================
// KV Projects ERP
// Edit Site
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, RotateCcw, MapPin, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import siteService from "../../services/siteService";
import "./Site.css";

const initialForm = {
  siteName: "",
  projectName: "",
  location: "",
  description: "",
  clientName: "",
  status: "Planning",
};

export default function EditSite() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
