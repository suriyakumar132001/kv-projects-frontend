import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import employeeService from "../../services/employeeService";
import "./EmployeeDetails.css";

// Same convention as EmployeeForm.jsx / EmployeeTable.jsx / DPRDetails.jsx.
const BACKEND_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(
  /\/api\/?$/,
  "",
);

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployee();
  }, []);

  const loadEmployee = async () => {
    try {
      const res = await employeeService.getEmployee(id);
      setEmployee(res.employee);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load employee");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading Employee...</h2>;
  }

  if (!employee) {
    return <h2>Employee not found</h2>;
  }

  return (
    <div className="employee-details">
      <div className="details-header">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {employee.profilePhoto ? (
            <img
              src={`${BACKEND_ORIGIN}/${employee.profilePhoto}`}
              alt={employee.name}
              className="employee-details-avatar"
            />
          ) : (
            <div className="employee-details-avatar employee-avatar-fallback">
              {employee.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}

          <div>
            <h2>{employee.name}</h2>
            <p>{employee.designation}</p>
          </div>
        </div>

        <button
          className="edit-btn"
          onClick={() => navigate(`/${role}/employees/edit/${employee._id}`)}
        >
          Edit Employee
        </button>
      </div>

      <div className="details-card">
        <div className="details-grid">
          <div>
            <strong>Employee ID</strong>
            <p>{employee.employeeId}</p>
          </div>

          <div>
            <strong>Email</strong>
            <p>{employee.email}</p>
          </div>

          <div>
            <strong>Phone</strong>
            <p>{employee.phone}</p>
          </div>

          <div>
            <strong>Department</strong>
            <p>{employee.department}</p>
          </div>

          <div>
            <strong>Designation</strong>
            <p>{employee.designation}</p>
          </div>

          <div>
            <strong>Salary</strong>
            <p>₹ {employee.salary}</p>
          </div>

          <div>
            <strong>Joining Date</strong>
            <p>{new Date(employee.joiningDate).toLocaleDateString()}</p>
          </div>

          <div>
            <strong>Status</strong>
            <p>{employee.status}</p>
          </div>

          <div>
            <strong>Emergency Contact</strong>
            <p>{employee.emergencyContact}</p>
          </div>
        </div>

        <div className="address-box">
          <strong>Address</strong>
          <p>{employee.address || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
