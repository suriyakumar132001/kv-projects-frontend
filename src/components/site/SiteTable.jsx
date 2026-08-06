const statusClass = (status) => {
  switch (status) {
    case "Planning":
      return "status-planning";
    case "Started":
      return "status-started";
    case "In Progress":
      return "status-inprogress";
    case "Completed":
      return "status-completed";
    case "On Hold":
      return "status-onhold";
    default:
      return "status-planning";
  }
};

const SiteTable = ({ sites, onAssignEngineer, canAssign }) => {
  return (
    <div className="table-wrapper">

      <table className="site-table">

        <thead>
          <tr>
            <th>Site Name</th>
            <th>Project</th>
            <th>Client</th>
            <th>Location</th>
            <th>Budget</th>
            <th>Progress</th>
            <th>Site Engineer</th>
            <th>Status</th>
            {canAssign && <th width="140">Actions</th>}
          </tr>
        </thead>

        <tbody>

          {sites.length > 0 ? (
            sites.map((item) => (
              <tr key={item._id}>

                <td>{item.siteName}</td>

                <td>{item.projectName}</td>

                <td>{item.clientName}</td>

                <td>{item.location}</td>

                <td>₹ {Number(item.budget || 0).toLocaleString()}</td>

                <td>{item.progress || 0}%</td>

                <td>{item.siteEngineer?.name || "Unassigned"}</td>

                <td>
                  <span className={statusClass(item.status)}>
                    {item.status}
                  </span>
                </td>

                {canAssign && (
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => onAssignEngineer(item)}
                    >
                      Assign Engineer
                    </button>
                  </td>
                )}

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={canAssign ? 9 : 8} style={{ textAlign: "center", padding: "30px" }}>
                No Sites Found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
};

export default SiteTable;