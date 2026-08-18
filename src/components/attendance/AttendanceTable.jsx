import { FaSignOutAlt, FaEye, FaTrash } from "react-icons/fa";

const AttendanceTable = ({
  attendance,
  onView,
  onCheckOut,
  onDelete,
  canDelete,
}) => {
  return (
    <div className="attendance-table-container">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Site</th>
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
                  {item.site?.siteName || "--"}

                  {/* Only shown when the check-in was actually outside the
                      geofence (locationVerified === false). If it's null —
                      no site coordinates set, or GPS was denied — nothing
                      renders, so unverified records don't look flagged. */}
                  {item.locationVerified === false && (
                    <span
                      className="location-flag"
                      title={
                        item.distanceFromSite != null
                          ? `${item.distanceFromSite}m from registered site location`
                          : "Outside geofence"
                      }
                    >
                      ⚠ Flagged
                    </span>
                  )}
                </td>

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

                  {canDelete && (
                    <button
                      className="action-btn delete"
                      onClick={() => onDelete(item)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="10"
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
