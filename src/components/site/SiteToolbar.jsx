import { FaSearch, FaPlus } from "react-icons/fa";

const SiteToolbar = ({
  search,
  setSearch,
  status,
  setStatus,
  onAddSite,
  canCreate,
}) => {
  return (
    <div className="site-toolbar">

      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search site..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        className="site-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="Planning">Planning</option>
        <option value="Started">Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        <option value="On Hold">On Hold</option>
      </select>

      {canCreate && (
        <button className="add-btn" onClick={onAddSite}>
          <FaPlus />
          Add Site
        </button>
      )}

    </div>
  );
};

export default SiteToolbar;