import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import leaveService from "../../services/leaveService";

import "./Leave.css";

const LeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeave();
  }, []);

  const loadLeave = async () => {
    try {
      setLoading(true);

      const res = await leaveService.getLeave(id);

      setLeave(res.leave);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load leave details");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await leaveService.approveLeave(id);

      toast.success("Leave Approved");

      loadLeave();
    } catch (error) {
      toast.error(error.response?.data?.message || "Approval Failed");
    }
  };

  const handleReject = async () => {
    try {
      await leaveService.rejectLeave(id);

      toast.success("Leave Rejected");

      loadLeave();
    } catch (error) {
      toast.error(error.response?.data?.message || "Reject Failed");
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!leave) {
    return <div className="loading">Leave not found.</div>;
  }

  return (
    <div className="leave-details-page">
      <div className="leave-details-card">

        <div className="details-header">
          <div>
            <h2>Leave Details</h2>
            <p>Employee Leave Information</p>
          </div>

          <span
            className={`status-badge ${leave.status.toLowerCase()}`}
          >
            {leave.status}
          </span>
        </div>

        <div className="details-grid">

          <div className="detail-item">
            <label>Employee ID</label>
            <p>{leave.employee?.employeeId}</p>
          </div>

          <div className="detail-item">
            <label>Employee Name</label>
            <p>{leave.employee?.name}</p>
          </div>

          <div className="detail-item">
            <label>Department</label>
            <p>{leave.employee?.department}</p>
          </div>

          <div className="detail-item">
            <label>Leave Type</label>
            <p>{leave.leaveType}</p>
          </div>

          <div className="detail-item">
            <label>From Date</label>
            <p>{new Date(leave.fromDate).toLocaleDateString()}</p>
          </div>

          <div className="detail-item">
            <label>To Date</label>
            <p>{new Date(leave.toDate).toLocaleDateString()}</p>
          </div>

          <div className="detail-item">
            <label>Total Days</label>
            <p>{leave.totalDays}</p>
          </div>

          <div className="detail-item">
            <label>Status</label>
            <p>{leave.status}</p>
          </div>

          <div className="detail-item full-width">
            <label>Reason</label>
            <p>{leave.reason}</p>
          </div>

          <div className="detail-item full-width">
            <label>Remarks</label>
            <p>{leave.remarks || "No remarks"}</p>
          </div>

          <div className="detail-item">
            <label>Approved By</label>
            <p>{leave.approvedBy?.name || "-"}</p>
          </div>

          <div className="detail-item">
            <label>Created On</label>
            <p>{new Date(leave.createdAt).toLocaleString()}</p>
          </div>

        </div>

        <div className="form-buttons">

          <button
            className="cancel-btn"
            onClick={() => navigate(`/${role}/leaves`)}
          >
            Back
          </button>

          {leave.status === "Pending" && (
            <>
              <button
                className="approve-btn"
                onClick={handleApprove}
              >
                Approve
              </button>

              <button
                className="reject-btn"
                onClick={handleReject}
              >
                Reject
              </button>
            </>
          )}

          <button
            className="save-btn"
            onClick={() =>
              navigate(`/${role}/leaves/edit/${leave._id}`)
            }
          >
            Edit
          </button>

        </div>

      </div>
    </div>
  );
};

export default LeaveDetails;