import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

import "./EmployeeTable.css";

// Uploaded images are served from the backend's root, not under /api —
// same convention as DPRDetails.jsx / EmployeeForm.jsx.
const BACKEND_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(
  /\/api\/?$/,
  "",
);

const EmployeeAvatar = ({ employee }) => {
  if (employee.profilePhoto) {
    return (
      <img
        src={`${BACKEND_ORIGIN}/${employee.profilePhoto}`}
        alt={employee.name}
        className="employee-avatar-thumb"
      />
    );
  }

  return (
    <div className="employee-avatar-thumb employee-avatar-fallback">
      {employee.name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
};

const EmployeeTable = ({ employees, onView, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th width="56"></th>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Salary</th>
            <th>Status</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="9" className="empty-row">
                No Employees Found
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp._id}>
                <td>
                  <EmployeeAvatar employee={emp} />
                </td>

                <td>{emp.employeeId}</td>

                <td>{emp.name}</td>

                <td>{emp.email}</td>

                <td>{emp.department}</td>

                <td>{emp.designation}</td>

                <td>₹{Number(emp.salary).toLocaleString()}</td>

                <td>
                  <span
                    className={
                      emp.status === "Active"
                        ? "status active"
                        : "status inactive"
                    }
                  >
                    {emp.status}
                  </span>
                </td>

                <td>
                  <button
                    className="action-btn view"
                    onClick={() => onView(emp)}
                  >
                    <FaEye />
                  </button>

                  <button
                    className="action-btn edit"
                    onClick={() => onEdit(emp)}
                  >
                    <FaEdit />
                  </button>

                  <button
                    className="action-btn delete"
                    onClick={() => onDelete(emp)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
