import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import attendanceService from "../../services/attendanceService";
import employeeService from "../../services/employeeService";

import "./Attendance.css";

const MarkAttendance = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    employee: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await employeeService.getEmployees({
        page: 1,
        limit: 100,
      });

      setEmployees(res.employees || []);
    } catch (error) {
      toast.error("Unable to load employees");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employee) {
      return toast.error("Please select employee");
    }

    try {
      setLoading(true);

      await attendanceService.checkIn(formData);

      toast.success("Attendance marked successfully");

      navigate(`/${role}/attendance`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Attendance failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-form-page">

      <div className="attendance-form-card">

        <h2>Mark Attendance</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Employee</label>

            <select
              name="employee"
              value={formData.employee}
              onChange={handleChange}
            >
              <option value="">Select Employee</option>

              {employees.map((emp) => (
                <option
                  key={emp._id}
                  value={emp._id}
                >
                  {emp.employeeId} - {emp.name}
                </option>
              ))}

            </select>

          </div>

          <div className="form-group">

            <label>Remarks</label>

            <textarea
              rows="4"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter remarks"
            />

          </div>

          <div className="form-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/${role}/attendance`)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Check In"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default MarkAttendance;