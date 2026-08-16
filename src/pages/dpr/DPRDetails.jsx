import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import dprService from "../../services/dprService";

import "./DPR.css";

// Uploaded images are served from the backend's root (e.g. /uploads/xyz.jpg),
// not under /api, so strip the /api suffix off the configured API base URL.
const BACKEND_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");

const DPRDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const canDelete = role === "owner" || role === "admin";

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const res = await dprService.getReport(id);
      setReport(res.report);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load report");
      navigate(`/${role}/dpr`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this report?");
    if (!confirmDelete) return;

    try {
      await dprService.deleteReport(id);
      toast.success("Report deleted");
      navigate(`/${role}/dpr`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <h2 style={{ padding: 24 }}>Loading...</h2>;
  if (!report) return <h2 style={{ padding: 24 }}>Report not found</h2>;

  return (
    <div className="dpr-page">
      <div className="dpr-header">
        <h2>Daily Progress Report</h2>
      </div>

      <div className="dpr-details-card">
        <span className="dpr-status-pill">Submitted</span>

        <div className="dpr-details-grid">
          <div>
            <label>Date</label>
            <p>
              {report.reportDate
                ? new Date(report.reportDate).toLocaleDateString()
                : "-"}
            </p>
          </div>

          <div>
            <label>Site</label>
            <p>{report.site?.siteName || "-"}</p>
          </div>

          <div>
            <label>Site Engineer</label>
            <p>{report.siteEngineer?.name || "-"}</p>
          </div>

          <div>
            <label>Weather</label>
            <p>{report.weather}</p>
          </div>

          <div>
            <label>Progress</label>
            <p>{report.progress || 0}%</p>
          </div>
        </div>

        <div className="dpr-form-section-title">Labour Count</div>
        <div className="dpr-details-grid">
          {Object.entries(report.labour || {}).map(([key, value]) => (
            <div key={key}>
              <label style={{ textTransform: "capitalize" }}>{key}</label>
              <p>{value}</p>
            </div>
          ))}
        </div>

        <div className="dpr-form-section-title">Materials Used</div>
        <div className="dpr-details-grid">
          {Object.entries(report.materials || {}).map(([key, value]) => (
            <div key={key}>
              <label style={{ textTransform: "capitalize" }}>{key}</label>
              <p>{value}</p>
            </div>
          ))}
        </div>

        <div className="dpr-form-section-title">Work Description</div>
        <p>{report.workDescription || "-"}</p>

        {report.tomorrowPlan && (
          <>
            <div className="dpr-form-section-title">Tomorrow's Plan</div>
            <p>{report.tomorrowPlan}</p>
          </>
        )}

        {report.issues && (
          <>
            <div className="dpr-form-section-title">Issues / Delays</div>
            <p>{report.issues}</p>
          </>
        )}

        {report.remarks && (
          <>
            <div className="dpr-form-section-title">Remarks</div>
            <p>{report.remarks}</p>
          </>
        )}

        {report.images?.length > 0 && (
          <>
            <div className="dpr-form-section-title">Site Photos</div>
            <div className="dpr-image-gallery">
              {report.images.map((imgPath, idx) => (
                <img
                  key={idx}
                  src={`${BACKEND_ORIGIN}${imgPath}`}
                  alt={`site-${idx}`}
                  onClick={() => window.open(`${BACKEND_ORIGIN}${imgPath}`, "_blank")}
                />
              ))}
            </div>
          </>
        )}

        <div className="dpr-form-actions">
          <button className="dpr-cancel-btn" onClick={() => navigate(`/${role}/dpr`)}>
            Back
          </button>

          {canDelete && (
            <button className="dpr-delete-btn" onClick={handleDelete}>
              Delete Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DPRDetails;