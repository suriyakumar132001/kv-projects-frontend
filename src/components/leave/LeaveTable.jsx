import {
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const LeaveTable = ({
  leaves,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "status-approved";

      case "Rejected":
        return "status-rejected";

      default:
        return "status-pending";
    }
  };

  return (
    <div className="table-wrapper">
      <table className="leave-table">

        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Days</th>
            <th>Status</th>
            <th width="250">Actions</th>
          </tr>
        </thead>

        <tbody>

          {leaves.length > 0 ? (

            leaves.map((leave) => (

              <tr key={leave._id}>

                <td>{leave.employee?.employeeId}</td>

                <td>{leave.employee?.name}</td>

                <td>{leave.employee?.department}</td>

                <td>{leave.leaveType}</td>

                <td>
                  {new Date(leave.fromDate).toLocaleDateString()}
                </td>

                <td>
                  {new Date(leave.toDate).toLocaleDateString()}
                </td>

                <td>{leave.totalDays}</td>

                <td>
                  <span className={getStatusClass(leave.status)}>
                    {leave.status}
                  </span>
                </td>

                <td>

                  <div className="action-buttons">

                    <button
                      className="view-btn"
                      onClick={() => onView(leave)}
                    >
                      <FaEye />
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => onEdit(leave)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => onDelete(leave)}
                    >
                      <FaTrash />
                    </button>

                    {leave.status === "Pending" && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() => onApprove?.(leave)}
                        >
                          <FaCheck />
                        </button>

                        <button
                          className="reject-btn"
                          onClick={() => onReject?.(leave)}
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}

                  </div>

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
                No Leave Records Found
              </td>
            </tr>

          )}

        </tbody>

      </table>
    </div>
  );
};

export default LeaveTable;