import { FaSearch, FaPlus } from "react-icons/fa";

const VendorToolbar = ({
  search,
  setSearch,
  materialType,
  setMaterialType,
  status,
  setStatus,
  onAddVendor,
}) => {
  return (
    <div className="vendor-toolbar">

      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search vendor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        className="vendor-select"
        value={materialType}
        onChange={(e) => setMaterialType(e.target.value)}
      >
        <option value="">All Materials</option>
        <option value="Cement">Cement</option>
        <option value="Steel">Steel</option>
        <option value="Sand">Sand</option>
        <option value="Bricks">Bricks</option>
        <option value="Electrical">Electrical</option>
        <option value="Plumbing">Plumbing</option>
        <option value="Paint">Paint</option>
        <option value="Machinery">Machinery</option>
        <option value="Other">Other</option>
      </select>

      <select
        className="vendor-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      <button className="add-btn" onClick={onAddVendor}>
        <FaPlus />
        Add Vendor
      </button>

    </div>
  );
};

export default VendorToolbar;