import {
  FaSignOutAlt,
  FaEye,
} from "react-icons/fa";

const AttendanceTable = ({
  attendance,
  onView,
  onCheckOut,
}) => {
  return (
    <div className="attendance-table-container">

      <table className="attendance-table">

        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Working Hours</th>
            <th>Overtime</th>
            <th>Status</th>
            <th width="150">Actions</th>
          </tr>
        </thead>

        <tbody>

          {attendance.length > 0 ? (
            attendance.map((item) => (

              <tr key={item._id}>

                <td>{item.employee?.employeeId}</td>

                <td>{item.employee?.name}</td>

                <td>{item.employee?.department}</td>

                <td>
                  {item.checkIn
                    ? new Date(item.checkIn).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--"}
                </td>

                <td>
                  {item.checkOut
                    ? new Date(item.checkOut).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--"}
                </td>

                <td>{item.workingHours} hrs</td>

                <td>{item.overtimeHours} hrs</td>

                <td>
                  <span
                    className={`status-badge ${item.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td>

                  <button
                    className="action-btn view"
                    onClick={() => onView(item)}
                    title="View"
                  >
                    <FaEye />
                  </button>

                  {!item.checkOut && (
                    <button
                      className="action-btn checkout"
                      onClick={() => onCheckOut(item)}
                      title="Check Out"
                    >
                      <FaSignOutAlt />
                    </button>
                  )}

                </td>

              </tr>

            ))
          ) : (

            <tr>
              <td
                colSpan="9"
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                No Attendance Records Found
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
};

export default AttendanceTable;