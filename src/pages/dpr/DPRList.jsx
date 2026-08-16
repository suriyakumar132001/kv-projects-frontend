import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import dprService from "../../services/dprService";

import "./DPR.css";

const DPRList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [todayOnly, setTodayOnly] = useState(false);

  const canCreate = role === "siteengineer" || role === "hr";
  const canDelete = role === "owner" || role === "admin";

  useEffect(() => {
    const today = searchParams.get("today");
    const shouldShowToday = today === "true";
    setTodayOnly(shouldShowToday);
    loadReports(shouldShowToday);
  }, [searchParams]);

  const loadReports = async (today = false) => {
    try {
      setLoading(true);
      const res = await dprService.getReports({
        today: today ? "true" : undefined,
      });
      setReports(res.reports || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this report?");
    if (!confirmDelete) return;

    try {
      await dprService.deleteReport(id);
      toast.success("Report deleted");
      loadReports();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <h2 style={{ padding: 24 }}>Loading...</h2>;

  return (
    <div className="dpr-page">
      <div className="dpr-header">
        <div>
          <h2>Daily Progress Reports</h2>
          <p className="dpr-header-subtitle">Track daily site work, labour and materials</p>
        </div>

        <div className="dpr-header-actions">
          <button
            className={`dpr-filter-btn ${todayOnly ? "active" : ""}`}
            onClick={() => navigate(`/${role}/dpr?today=true`)}
          >
            Todays Work
          </button>

          <button
            className={`dpr-filter-btn ${!todayOnly ? "active" : ""}`}
            onClick={() => navigate(`/${role}/dpr`)}
          >
            All Reports
          </button>
        </div>

        {canCreate && (
          <button
            className="dpr-add-btn"
            onClick={() => navigate(`/${role}/dpr/create`)}
          >
            + New Report
          </button>
        )}
      </div>

      <div className="dpr-table-wrapper">
        <table className="dpr-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Site</th>
              <th>Engineer</th>
              <th>Weather</th>
              <th>Progress</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report._id}>
                  <td>
                    <div className="dpr-date-cell">
                      {report.reportDate && (
                        <span className="dow">
                          {new Date(report.reportDate).toLocaleDateString(undefined, {
                            weekday: "short",
                          })}
                        </span>
                      )}
                      {report.reportDate
                        ? new Date(report.reportDate).toLocaleDateString()
                        : "-"}
                    </div>
                  </td>

                  <td>{report.site?.siteName || "-"}</td>

                  <td>{report.siteEngineer?.name || "-"}</td>

                  <td>{report.weather}</td>

                  <td>
                    <span
                      className={`dpr-progress-pill ${
                        (report.progress || 0) >= 70
                          ? ""
                          : (report.progress || 0) >= 35
                          ? "mid"
                          : "low"
                      }`}
                    >
                      {report.progress || 0}%
                    </span>
                  </td>

                  <td>
                    <div className="dpr-actions-cell">
                      <button
                        className="dpr-icon-btn dpr-view-btn"
                        title="View"
                        onClick={() => navigate(`/${role}/dpr/view/${report._id}`)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>

                      {canDelete && (
                        <button
                          className="dpr-icon-btn dpr-delete-btn"
                          title="Delete"
                          onClick={() => handleDelete(report._id)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18" />
                            <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="dpr-empty">
                  No Daily Progress Reports Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DPRList;