import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const canCreate = role === "siteengineer";
  const canDelete = role === "owner" || role === "admin";

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await dprService.getReports();
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
        <h2>Daily Progress Reports</h2>

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
                    {report.reportDate
                      ? new Date(report.reportDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>{report.site?.siteName || "-"}</td>

                  <td>{report.siteEngineer?.name || "-"}</td>

                  <td>{report.weather}</td>

                  <td>
                    <span className="dpr-progress-pill">
                      {report.progress || 0}%
                    </span>
                  </td>

                  <td>
                    <div className="dpr-actions-cell">
                      <button
                        className="dpr-view-btn"
                        onClick={() => navigate(`/${role}/dpr/view/${report._id}`)}
                      >
                        View
                      </button>

                      {canDelete && (
                        <button
                          className="dpr-delete-btn"
                          onClick={() => handleDelete(report._id)}
                        >
                          Delete
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