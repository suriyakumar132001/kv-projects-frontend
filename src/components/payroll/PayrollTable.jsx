import {
  FaEye,
  FaEdit,
  FaTrash,
  FaMoneyBillWave,
} from "react-icons/fa";

const PayrollTable = ({
  payrolls,
  onView,
  onEdit,
  onDelete,
  onPay,
}) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "Paid":
        return "status-paid";

      default:
        return "status-pending";
    }
  };

  return (
    <div className="table-wrapper">
      <table className="payroll-table">

        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Month</th>
            <th>Year</th>
            <th>Net Salary</th>
            <th>Status</th>
            <th width="260">Actions</th>
          </tr>
        </thead>

        <tbody>

          {payrolls.length > 0 ? (

            payrolls.map((payroll) => (

              <tr key={payroll._id}>

                <td>{payroll.employee?.employeeId}</td>

                <td>{payroll.employee?.name}</td>

                <td>{payroll.employee?.department}</td>

                <td>{payroll.month}</td>

                <td>{payroll.year}</td>

                <td>
                  ₹
                  {Number(payroll.netSalary).toLocaleString(
                    "en-IN"
                  )}
                </td>

                <td>
                  <span
                    className={getStatusClass(
                      payroll.paymentStatus
                    )}
                  >
                    {payroll.paymentStatus}
                  </span>
                </td>

                <td>

                  <div className="action-buttons">

                    <button
                      className="view-btn"
                      onClick={() => onView(payroll)}
                      title="View"
                    >
                      <FaEye />
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => onEdit(payroll)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => onDelete(payroll)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>

                    {payroll.paymentStatus ===
                      "Pending" && (
                      <button
                        className="pay-btn"
                        onClick={() => onPay(payroll)}
                        title="Mark as Paid"
                      >
                        <FaMoneyBillWave />
                      </button>
                    )}

                  </div>

                </td>

              </tr>

            ))

          ) : (

            <tr>
              <td
                colSpan="8"
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                No Payroll Records Found
              </td>
            </tr>

          )}

        </tbody>

      </table>
    </div>
  );
};

export default PayrollTable;