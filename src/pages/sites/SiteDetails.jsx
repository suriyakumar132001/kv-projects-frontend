// ===============================================
// KV Projects ERP
// Site Details
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  User,
  Building2,
  CalendarDays,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

import siteService from "../../services/siteService";
import "./Site.css";

export default function SiteDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const loadSite = async () => {
    try {
      setLoading(true);

      const response = await siteService.getSite(id);

      const siteData = response?.site || response?.data || response;

      if (!siteData) {
        toast.error("Site not found");
        return;
      }

      setSite(siteData);
    } catch (error) {
      console.error("Get Site Error:", error);

      toast.error(error?.response?.data?.message || "Failed to load site");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadSite();
    }
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this site?\n\nThis action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await siteService.deleteSite(id);

      toast.success("Site deleted successfully");

      navigate("../sites");
    } catch (error) {
      console.error("Delete Site Error:", error);

      toast.error(error?.response?.data?.message || "Failed to delete site");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "status-completed";
      case "completed":
        return "status-started";
      case "on hold":
        return "status-inprogress";
      case "inactive":
        return "status-onhold";
      default:
        return "status-onhold";
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

  if (!site) {
    return (
      <div className="site-details-page">
        <div className="not-found-card">
          <MapPin size={42} />
          <h2>Site Not Found</h2>
          <p>The requested site could not be found.</p>
          <button
            type="button"
            onClick={() => navigate("../sites")}
            className="btn btn-primary"
          >
            <ArrowLeft size={17} />
            Back to Sites
          </button>
        </div>
      </div>
    );
  }

  const engineer = site.siteEngineer || site.engineer || site.assignedEngineer;
  const engineerName = typeof engineer === "object" ? engineer?.name : engineer;

  return (
    <div className="site-details-page">
      <div className="site-details-header">
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            type="button"
            onClick={() => navigate("../sites")}
            className="icon-btn"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <div className="site-details-title-row">
              <h1>{site.siteName || "Site Details"}</h1>
              <span
                className={`status-badge-lg ${getStatusClass(site.status)}`}
              >
                {site.status || "Unknown"}
              </span>
            </div>

            <p className="site-details-location">
              <MapPin size={15} />
              {site.location || "Location not available"}
            </p>
          </div>
        </div>

        <div className="site-details-actions">
          <button
            type="button"
            onClick={loadSite}
            disabled={loading}
            className="btn btn-outline"
          >
            <RefreshCw size={17} className={loading ? "spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => navigate(`../sites/edit/${id}`)}
            className="btn btn-primary"
          >
            <Edit size={17} />
            Edit Site
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="btn btn-danger"
          >
            {deleting ? (
              <Loader2 size={17} className="spin" />
            ) : (
              <Trash2 size={17} />
            )}
            Delete
          </button>
        </div>
      </div>

      <div className="site-details-grid">
        <div>
          <div className="site-details-card">
            <div className="site-details-card-header">
              <div className="header-icon-badge">
                <Building2 size={21} />
              </div>
              <div>
                <h2>Site Information</h2>
                <p>Basic construction site details</p>
              </div>
            </div>

            <div className="info-item-grid">
              <InfoItem
                icon={<Building2 size={18} />}
                label="Site Name"
                value={site.siteName}
              />
              <InfoItem
                icon={<Building2 size={18} />}
                label="Project Name"
                value={site.projectName}
              />
              <InfoItem
                icon={<MapPin size={18} />}
                label="Location"
                value={site.location}
              />
              <InfoItem
                icon={<User size={18} />}
                label="Client Name"
                value={site.clientName}
              />
              <InfoItem
                icon={<User size={18} />}
                label="Site Engineer"
                value={engineerName}
              />
              <InfoItem
                icon={<CalendarDays size={18} />}
                label="Created On"
                value={formatDate(site.createdAt)}
              />
              <InfoItem
                icon={<CalendarDays size={18} />}
                label="Last Updated"
                value={formatDate(site.updatedAt)}
              />
            </div>
          </div>

          <div className="site-details-card">
            <div className="site-details-card-header">
              <div className="header-icon-badge">
                <FileText size={21} />
              </div>
              <div>
                <h2>Description</h2>
                <p>Additional site information</p>
              </div>
            </div>

            <div
              className={`description-box ${!site.description ? "empty" : ""}`}
            >
              {site.description || "No description has been added."}
            </div>
          </div>
        </div>

        <div>
          <div className="summary-side-card">
            <p className="summary-side-card-label">Site Status</p>
            <div className="summary-side-status-row">
              <span
                className={`status-badge-lg ${getStatusClass(site.status)}`}
              >
                {site.status || "Unknown"}
              </span>
              <MapPin size={28} style={{ color: "var(--border)" }} />
            </div>
          </div>

          <div className="summary-side-card">
            <div className="summary-side-row">
              <div className="summary-side-icon green">
                <User size={21} />
              </div>
              <div>
                <p className="summary-side-text-label">Client</p>
                <p className="summary-side-text-value">
                  {site.clientName || "Not assigned"}
                </p>
              </div>
            </div>
          </div>

          <div className="summary-side-card">
            <div className="summary-side-row">
              <div className="summary-side-icon orange">
                <User size={21} />
              </div>
              <div>
                <p className="summary-side-text-label">Site Engineer</p>
                <p className="summary-side-text-value">
                  {engineerName || "Not assigned"}
                </p>
              </div>
            </div>
          </div>

          <div className="summary-side-card">
            <div className="summary-side-row">
              <div className="summary-side-icon red">
                <MapPin size={21} />
              </div>
              <div>
                <p className="summary-side-text-label">Site Location</p>
                <p className="summary-side-text-value">
                  {site.location || "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <button
          type="button"
          onClick={() => navigate("../sites")}
          className="btn btn-outline"
        >
          <ArrowLeft size={17} />
          Back to Sites
        </button>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="info-item">
      <div className="info-item-label">
        {icon}
        <span>{label}</span>
      </div>
      <p className="info-item-value">{value || "Not available"}</p>
    </div>
  );
}
