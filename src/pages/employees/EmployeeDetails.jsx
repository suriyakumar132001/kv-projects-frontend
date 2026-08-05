import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import employeeService from "../../services/employeeService";
import "./EmployeeDetails.css";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
        <div>
          <h2>{employee.name}</h2>
          <p>{employee.designation}</p>
        </div>

        <button
          className="edit-btn"
          onClick={() =>
            navigate(`/owner/employees/edit/${employee._id}`)
          }
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
            <p>
              {new Date(employee.joiningDate).toLocaleDateString()}
            </p>
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