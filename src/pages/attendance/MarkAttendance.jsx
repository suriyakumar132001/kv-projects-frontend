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
  const isSiteEngineer = role === "siteengineer";

  const [employees, setEmployees] = useState([]);
  const [myEmployee, setMyEmployee] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(isSiteEngineer);

  const [formData, setFormData] = useState({
    employee: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSiteEngineer) {
      loadMyEmployee();
    } else {
      loadEmployees();
    }
  }, []);

  // Site Engineers only ever check themselves in — load their own
  // linked employee profile instead of a full picker.
  const loadMyEmployee = async () => {
    try {
      setLoadingProfile(true);
      const res = await employeeService.getMyEmployee();
      setMyEmployee(res.employee);
      setFormData((prev) => ({ ...prev, employee: res.employee._id }));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "No employee profile is linked to your account. Contact your Admin/Owner.",
      );
    } finally {
      setLoadingProfile(false);
    }
  };

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
      return toast.error(
        isSiteEngineer
          ? "No employee profile linked to your account"
          : "Please select employee",
      );
    }

    try {
      setLoading(true);

      await attendanceService.checkIn(formData);

      toast.success("Attendance marked successfully");

      navigate(`/${role}/attendance`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Attendance failed");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return <h2>Loading your profile...</h2>;
  }

  return (
    <div className="attendance-form-page">
      <div className="attendance-form-card">
        <h2>Mark Attendance</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Employee</label>

            {isSiteEngineer ? (
              myEmployee ? (
                <input
                  type="text"
                  value={`${myEmployee.employeeId} - ${myEmployee.name}`}
                  disabled
                  readOnly
                />
              ) : (
                <p style={{ color: "#b91c1c", margin: 0 }}>
                  No employee profile linked to your account. Contact your
                  Admin/Owner.
                </p>
              )
            ) : (
              <select
                name="employee"
                value={formData.employee}
                onChange={handleChange}
              >
                <option value="">Select Employee</option>

                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employeeId} - {emp.name}
                  </option>
                ))}
              </select>
            )}
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
              disabled={loading || (isSiteEngineer && !myEmployee)}
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
