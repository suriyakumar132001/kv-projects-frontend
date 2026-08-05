import { FaPlus, FaSearch } from "react-icons/fa";
import "./EmployeeToolbar.css";

const EmployeeToolbar = ({
  search,
  setSearch,
  department,
  setDepartment,
  status,
  setStatus,
  onSearch,
  onAddEmployee,
}) => {
  return (
    <div className="employee-toolbar">

      {/* Search */}
      <div className="toolbar-search">
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

      {/* Department Filter */}
      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="">All Departments</option>
        <option value="Civil">Civil</option>
        <option value="Electrical">Electrical</option>
        <option value="Mechanical">Mechanical</option>
        <option value="Accounts">Accounts</option>
        <option value="HR">HR</option>
      </select>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      {/* Add Button */}
      <button
        className="toolbar-btn"
        onClick={onAddEmployee}
      >
        <FaPlus />
        Add Employee
      </button>

    </div>
  );
};

export default EmployeeToolbar;