import {
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import "./EmployeeTable.css";

const EmployeeTable = ({
  employees,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="table-container">

      <table className="employee-table">

        <thead>

          <tr>
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

              <td
                colSpan="8"
                className="empty-row"
              >
                No Employees Found
              </td>

            </tr>

          ) : (

            employees.map((emp) => (

              <tr key={emp._id}>

                <td>{emp.employeeId}</td>

                <td>{emp.name}</td>

                <td>{emp.email}</td>

                <td>{emp.department}</td>

                <td>{emp.designation}</td>

                <td>
                  ₹{Number(emp.salary).toLocaleString()}
                </td>

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