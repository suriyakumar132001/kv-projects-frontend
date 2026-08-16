import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const PaymentTable = ({ payments, onView, onEdit, onDelete, canEdit, canDelete }) => {
  return (
    <div className="table-wrapper">

      <table className="payment-table">

        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Client</th>
            <th>Payment Date</th>
            <th>Amount</th>
            <th>Method</th>
            <th width="150">Actions</th>
          </tr>
        </thead>

        <tbody>

          {payments.length > 0 ? (
            payments.map((item) => (
              <tr key={item._id}>

                <td>{item.invoice?.invoiceNumber || "-"}</td>

                <td>{item.client?.clientName || "-"}</td>

                <td>{new Date(item.paymentDate).toLocaleDateString()}</td>

                <td>₹ {Number(item.amount || 0).toLocaleString()}</td>

                <td>
                  <span className="method-badge">{item.paymentMethod}</span>
                </td>

                <td>
                  <div className="action-buttons">

                    <button
                      className="action-btn view-btn"
                      onClick={() => onView(item)}
                      title="View"
                    >
                      <FaEye />
                    </button>

                    {canEdit && (
                      <button
                        className="action-btn edit-btn"
                        onClick={() => onEdit(item)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    )}

                    {canDelete && (
                      <button
                        className="action-btn delete-btn"
                        onClick={() => onDelete(item)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    )}

                  </div>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "30px" }}>
                No Payments Found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
};

export default PaymentTable;