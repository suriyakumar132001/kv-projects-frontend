import { FaSearch, FaSyncAlt } from "react-icons/fa";

const InventoryToolbar = ({
  search,
  setSearch,
  siteFilter,
  setSiteFilter,
  sites,
  onRefresh,
}) => {
  return (
    <div className="inventory-toolbar">

      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search material..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        className="inventory-select"
        value={siteFilter}
        onChange={(e) => setSiteFilter(e.target.value)}
      >
        <option value="">All Sites</option>
        {sites.map((site) => (
          <option key={site} value={site}>
            {site}
          </option>
        ))}
      </select>

      <button className="refresh-btn" onClick={onRefresh}>
        <FaSyncAlt />
        Refresh
      </button>

    </div>
  );
};

export default InventoryToolbar;