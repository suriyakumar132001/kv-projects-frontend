import { FaSearch, FaSyncAlt, FaPlus } from "react-icons/fa";

const AttendanceToolbar = ({
  search,
  setSearch,
  status,
  setStatus,
  date,
  setDate,
  onSearch,
  onRefresh,
  onMarkAttendance,
  canMarkAttendance = true,
}) => {
  return (
    <div className="attendance-toolbar">

      {/* Search */}
      <div className="search-box">
        <FaSearch />

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

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="Half Day">Half Day</option>
        <option value="Leave">Leave</option>
      </select>

      {/* Date Filter */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Refresh */}
      <button
        className="refresh-btn"
        onClick={onRefresh}
      >
        <FaSyncAlt />
        Refresh
      </button>

      {/* Mark Attendance — hidden for Owner */}
      {canMarkAttendance && (
        <button
          className="add-btn"
          onClick={onMarkAttendance}
        >
          <FaPlus />
          Mark Attendance
        </button>
      )}

    </div>
  );
};

export default AttendanceToolbar;