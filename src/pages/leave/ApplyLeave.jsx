import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import employeeService from "../../services/employeeService";
import leaveService from "../../services/leaveService";

import "./Leave.css";

const ApplyLeave = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    employee: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    totalDays: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await employeeService.getEmployees({
        page: 1,
        limit: 1000,
      });

      setEmployees(res.employees || []);
    } catch (error) {
      toast.error("Failed to load employees");
    }
  };

  const calculateDays = (from, to) => {
    if (!from || !to) return "";

    const start = new Date(from);
    const end = new Date(to);

    const diff =
      Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return diff > 0 ? diff : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = {
      ...formData,
      [name]: value,
    };

    if (name === "fromDate" || name === "toDate") {
      updated.totalDays = calculateDays(
        updated.fromDate,
        updated.toDate
      );
    }

    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await leaveService.applyLeave(formData);

      toast.success("Leave Applied Successfully");

      navigate(`/${role}/leave`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to Apply Leave"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-form-page">
      <div className="leave-form-card">
        <h2>Apply Leave</h2>

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

          <div className="form-group">
            <label>Leave Type</label>

            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Casual">Casual</option>
              <option value="Sick">Sick</option>
              <option value="Earned">Earned</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

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

          <div className="form-group">
            <label>Total Days</label>

            <input
              type="number"
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

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/${role}/leave`)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? "Applying..." : "Apply Leave"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;