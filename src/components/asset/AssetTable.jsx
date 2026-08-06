import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const statusClass = (status) => {
  switch (status) {
    case "Available":
      return "status-available";
    case "In Use":
      return "status-inuse";
    case "Maintenance":
      return "status-maintenance";
    default:
      return "status-available";
  }
};

const AssetTable = ({
  assets,
  onView,
  onEdit,
  onDelete,
  onAssign,
  canDelete,
}) => {
  return (
    <div className="table-wrapper">

      <table className="asset-table">

        <thead>
          <tr>
            <th>Asset Code</th>
            <th>Asset Name</th>
            <th>Category</th>
            <th>Site</th>
            <th>Purchase Cost</th>
            <th>Status</th>
            <th width="220">Actions</th>
          </tr>
        </thead>

        <tbody>

          {assets.length > 0 ? (
            assets.map((item) => (
              <tr key={item._id}>

                <td>{item.assetCode}</td>

                <td>{item.assetName}</td>

                <td>{item.category}</td>

                <td>{item.site?.siteName || "Unassigned"}</td>

                <td>₹ {Number(item.purchaseCost || 0).toLocaleString()}</td>

                <td>
                  <span className={statusClass(item.status)}>
                    {item.status}
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

                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit(item)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="assign-btn"
                      onClick={() => onAssign(item)}
                    >
                      Assign
                    </button>

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
                No Assets Found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
};

export default AssetTable;