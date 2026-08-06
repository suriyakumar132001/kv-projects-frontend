const InventoryTable = ({ inventory }) => {
  return (
    <div className="table-wrapper">

      <table className="inventory-table">

        <thead>
          <tr>
            <th>Site</th>
            <th>Material</th>
            <th>Available Stock</th>
            <th>Minimum Stock</th>
            <th>Unit</th>
            <th>Status</th>
            <th>Last Updated</th>
          </tr>
        </thead>

        <tbody>

          {inventory.length > 0 ? (
            inventory.map((item) => {
              const isLow = item.availableStock <= item.minimumStock;

              return (
                <tr key={item._id} className={isLow ? "low-stock" : ""}>

                  <td>{item.site?.siteName || "-"}</td>

                  <td>{item.materialName}</td>

                  <td>{item.availableStock}</td>

                  <td>{item.minimumStock}</td>

                  <td>{item.unit}</td>

                  <td>
                    <span className={isLow ? "stock-low" : "stock-ok"}>
                      {isLow ? "Low Stock" : "In Stock"}
                    </span>
                  </td>

                  <td>
                    {new Date(item.lastUpdated).toLocaleDateString()}
                  </td>

                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>
                No Inventory Records Found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
};

export default InventoryTable;