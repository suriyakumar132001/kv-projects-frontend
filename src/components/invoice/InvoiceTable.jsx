import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const statusClass = (status) => {
  switch (status) {
    case "Pending":
      return "status-pending";
    case "Partial":
      return "status-partial";
    case "Paid":
      return "status-paid";
    default:
      return "status-pending";
  }
};

const InvoiceTable = ({ invoices, onView, onEdit, onDelete, canEdit, canDelete }) => {
  return (
    <div className="table-wrapper">

      <table className="invoice-table">

        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Client</th>
            <th>Project</th>
            <th>Due Date</th>
            <th>Grand Total</th>
            <th>Status</th>
            <th width="150">Actions</th>
          </tr>
        </thead>

        <tbody>

          {invoices.length > 0 ? (
            invoices.map((item) => (
              <tr key={item._id}>

                <td>{item.invoiceNumber}</td>

                <td>{item.client?.clientName || "-"}</td>

                <td>{item.projectName}</td>

                <td>{new Date(item.dueDate).toLocaleDateString()}</td>

                <td>₹ {Number(item.grandTotal || 0).toLocaleString()}</td>

                <td>
                  <span className={statusClass(item.paymentStatus)}>
                    {item.paymentStatus}
                  </span>
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
              <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
                No Invoices Found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
};

export default InvoiceTable;