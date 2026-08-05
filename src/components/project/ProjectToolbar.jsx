import {
  FaPlus,
  FaSync,
  FaSearch,
} from "react-icons/fa";

const ProjectToolbar = ({
  search,
  setSearch,
  status,
  setStatus,
  onRefresh,
  onAddProject,
}) => {
  return (
    <div className="toolbar">

      <div className="toolbar-left">

        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Search Project..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >
          <option value="">
            All Status
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Running">
            Running
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="On Hold">
            On Hold
          </option>

        </select>

      </div>

      <div className="toolbar-right">

        <button
          className="refresh-btn"
          onClick={onRefresh}
        >
          <FaSync />
          Refresh
        </button>

        <button
          className="add-btn"
          onClick={onAddProject}
        >
          <FaPlus />
          Add Project
        </button>

      </div>

    </div>
  );
};

export default ProjectToolbar;