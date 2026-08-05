import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import leaveService from "../../services/leaveService";
import employeeService from "../../services/employeeService";

import "./Leave.css";

const EditLeave = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    employee: "",
    leaveType: "Casual",
    fromDate: "",
    toDate: "",
    totalDays: "",
    reason: "",
    status: "Pending",
    remarks: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [employeeRes, leaveRes] = await Promise.all([
        employeeService.getEmployees({
          page: 1,
          limit: 1000,
        }),
        leaveService.getLeave(id),
      ]);

      setEmployees(employeeRes.employees || []);

      const leave = leaveRes.leave;

      setFormData({
        employee: leave.employee?._id || "",
        leaveType: leave.leaveType || "Casual",
        fromDate: leave.fromDate?.split("T")[0] || "",
        toDate: leave.toDate?.split("T")[0] || "",
        totalDays: leave.totalDays || "",
        reason: leave.reason || "",
        status: leave.status || "Pending",
        remarks: leave.remarks || "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load leave");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const calculateDays = (from, to) => {
    if (!from || !to) return "";

    const start = new Date(from);
    const end = new Date(to);

    const diff =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return diff > 0 ? diff : "";
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      totalDays: calculateDays(prev.fromDate, prev.toDate),
    }));
  }, [formData.fromDate, formData.toDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await leaveService.updateLeave(id, formData);

      toast.success("Leave Updated Successfully");

      navigate("/owner/leaves");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update Failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="leave-form-page">
      <div className="leave-form-card">
        <h2>Edit Leave</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Employee</label>

            <select
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              required
            >
              <option value="">Select Employee</option>

              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.employeeId} - {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>Leave Type</label>

              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
              >
                <option value="Casual">Casual</option>
                <option value="Sick">Sick</option>
                <option value="Earned">Earned</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

          </div>

          <div className="form-grid">

            <div className="form-group">
              <label>From Date</label>

              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>To Date</label>

              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="form-group">
            <label>Total Days</label>

            <input
              type="number"
              name="totalDays"
              value={formData.totalDays}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Reason</label>

            <textarea
              rows="4"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Remarks</label>

            <textarea
              rows="3"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/owner/leave")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={saving}
            >
              {saving ? "Updating..." : "Update Leave"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditLeave;