import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import materialRequestService from "../../services/materialRequestService";

import "./MaterialRequest.css";

const STATUS_FILTERS = ["All", "Pending", "Approved", "Rejected", "Ordered"];

const MaterialRequestList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const canApprove = role === "owner" || role === "admin";
  const canCreate =
    role === "owner" ||
    role === "admin" ||
    role === "hr" ||
    role === "siteengineer";

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadRequests(statusFilter);
  }, [statusFilter]);

  const loadRequests = async (status) => {
    try {
      setLoading(true);
      const res = await materialRequestService.getRequests(
        status && status !== "All" ? { status } : {},
      );
      setRequests(res.requests || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load material requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const confirmApprove = window.confirm("Approve this material request?");
    if (!confirmApprove) return;

    try {
      await materialRequestService.updateStatus(id, { status: "Approved" });
      toast.success("Request approved");
      loadRequests(statusFilter);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve request");
    }
  };

  const handleReject = async (id) => {
    const rejectionReason = window.prompt("Reason for rejecting this request:");
    if (rejectionReason === null) return; // cancelled

    try {
      await materialRequestService.updateStatus(id, {
        status: "Rejected",
        rejectionReason,
      });
      toast.success("Request rejected");
      loadRequests(statusFilter);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  };

  if (loading) return <h2 style={{ padding: 24 }}>Loading...</h2>;

  return (
    <div className="mr-page">
      <div className="mr-header">
        <div>
          <h2>Material Requests</h2>
          <p className="mr-header-subtitle">
            {canApprove
              ? "Review and approve material requests from site engineers"
              : "Track the material you've requested"}
          </p>
        </div>

        <div className="mr-header-actions">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              className={`mr-filter-btn ${statusFilter === status ? "active" : ""}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}

          {canCreate && (
            <button
              className="mr-add-btn"
              onClick={() => navigate(`/${role}/material-requests/create`)}
            >
              New Request
            </button>
          )}
        </div>
      </div>

      <div className="mr-table-wrapper">
        <table className="mr-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Site</th>
              <th>Material</th>
              <th>Qty</th>
              <th>Urgency</th>
              <th>Requested By</th>
              <th>Status</th>
              {canApprove && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {requests.length > 0 ? (
              requests.map((req) => (
                <tr key={req._id}>
                  <td>
                    {req.requestDate
                      ? new Date(req.requestDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>{req.site?.siteName || "-"}</td>

                  <td>{req.materialName}</td>

                  <td>
                    {req.quantity} {req.unit}
                  </td>

                  <td>
                    <span className={`mr-urgency-pill ${req.urgency}`}>
                      {req.urgency}
                    </span>
                  </td>

                  <td>{req.requestedBy?.name || "-"}</td>

                  <td>
                    <span className={`mr-status-pill ${req.status}`}>
                      {req.status}
                    </span>
                  </td>

                  {canApprove && (
                    <td>
                      <div className="mr-actions-cell">
                        {req.status === "Pending" && (
                          <>
                            <button
                              className="mr-btn mr-btn-approve"
                              onClick={() => handleApprove(req._id)}
                            >
                              Approve
                            </button>

                            <button
                              className="mr-btn mr-btn-reject"
                              onClick={() => handleReject(req._id)}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {req.status === "Approved" && (
                          <button
                            className="mr-btn mr-btn-convert"
                            onClick={() =>
                              navigate(
                                `/${role}/material-requests/${req._id}/convert-to-po`,
                              )
                            }
                          >
                            Convert to PO
                          </button>
                        )}

                        {req.status === "Ordered" && req.linkedPO && (
                          <span className="mr-note" style={{ margin: 0 }}>
                            PO {req.linkedPO.poNumber}
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canApprove ? 8 : 7} className="mr-empty">
                  No material requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterialRequestList;
