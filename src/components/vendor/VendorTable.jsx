const VendorTable = ({ vendors }) => {
  return (
    <div className="table-wrapper">

      <table className="vendor-table">

        <thead>
          <tr>
            <th>Vendor Name</th>
            <th>Contact Person</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Material Type</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {vendors.length > 0 ? (
            vendors.map((item) => (
              <tr key={item._id}>

                <td>{item.vendorName}</td>

                <td>{item.contactPerson || "-"}</td>

                <td>{item.phone}</td>

                <td>{item.email || "-"}</td>

                <td>{item.materialType}</td>

                <td>
                  <span
                    className={
                      item.status === "Active"
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {item.status}
                  </span>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "30px" }}>
                No Vendors Found
              </td>
            </tr>
          )}

        </tbody>

      </table>

    </div>
  );
};

export default VendorTable;