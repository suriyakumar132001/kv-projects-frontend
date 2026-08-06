import { FaSearch, FaPlus } from "react-icons/fa";

const AssetToolbar = ({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  onAddAsset,
}) => {
  return (
    <div className="asset-toolbar">

      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search asset..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        className="asset-select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Machine">Machine</option>
        <option value="Vehicle">Vehicle</option>
        <option value="Tool">Tool</option>
        <option value="Equipment">Equipment</option>
      </select>

      <select
        className="asset-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="Available">Available</option>
        <option value="In Use">In Use</option>
        <option value="Maintenance">Maintenance</option>
      </select>

      <button className="add-btn" onClick={onAddAsset}>
        <FaPlus />
        Add Asset
      </button>

    </div>
  );
};

export default AssetToolbar;