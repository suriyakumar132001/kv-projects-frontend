import {
  FaSearch,
  FaSyncAlt,
  FaPlus,
} from "react-icons/fa";

const LeaveToolbar = ({
  search,
  setSearch,
  status,
  setStatus,
  leaveType,
  setLeaveType,
  onSearch,
  onRefresh,
  onApplyLeave,
}) => {
  return (
    <div className="leave-toolbar">

      <div className="toolbar-left">

        {/* Search */}

        <div className="search-box">

          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearch(e.target.value);
            }}
          />

        </div>

        {/* Leave Type */}

        <select
          className="leave-select"
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
        >
          <option value="">All Leave Types</option>
          <option value="Casual">Casual</option>
          <option value="Sick">Sick</option>
          <option value="Earned">Earned</option>
          <option value="Emergency">Emergency</option>
        </select>

        {/* Status */}

        <select
          className="leave-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

      </div>

      <div className="toolbar-right">

        {/* Refresh */}

        <button
          className="refresh-btn"
          onClick={onRefresh}
        >
          <FaSyncAlt />
          Refresh
        </button>

        {/* Apply Leave */}

        <button
          className="add-btn"
          onClick={onApplyLeave}
        >
          <FaPlus />
          Apply Leave
        </button>

      </div>

    </div>
  );
};

export default LeaveToolbar;