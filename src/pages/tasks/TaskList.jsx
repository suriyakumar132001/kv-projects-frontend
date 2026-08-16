// ===============================================
// KV Projects ERP
// Task List
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, ListChecks } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import taskService from "../../services/taskService";

import "./Task.css";

const statusClass = (status) => {
  switch (status) {
    case "Pending":
      return "task-status-pending";
    case "In Progress":
      return "task-status-inprogress";
    case "Completed":
      return "task-status-completed";
    default:
      return "task-status-pending";
  }
};

const priorityClass = (priority) => {
  switch (priority) {
    case "Low":
      return "task-priority-low";
    case "Medium":
      return "task-priority-medium";
    case "High":
      return "task-priority-high";
    default:
      return "task-priority-medium";
  }
};

const formatDate = (date) => {
  if (!date) return "No due date";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "No due date";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function TaskList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const role = user?.role?.toLowerCase();
  const canCreate = role === "owner" || role === "admin";

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);

      const res = await taskService.getTasks();

      setTasks(res.tasks || []);
    } catch (error) {
      console.error("Load Tasks Error:", error);
      toast.error(error?.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = tasks.filter((item) => {
    const searchMatch = item.title
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const statusMatch = status ? item.status === status : true;
    const priorityMatch = priority ? item.priority === priority : true;

    return searchMatch && statusMatch && priorityMatch;
  });

  if (loading) {
    return <h2>Loading Tasks...</h2>;
  }

  return (
    <div className="task-page">
      <div className="task-header">
        <div>
          <h2>Tasks</h2>
          <p>
            {role === "siteengineer"
              ? "Tasks assigned to you"
              : "Manage tasks across all sites"}
          </p>
        </div>
      </div>

      <div className="task-toolbar">
        <div className="task-search-box">
          <Search size={16} className="task-search-icon" />
          <input
            type="text"
            placeholder="Search task..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="task-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          className="task-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {canCreate && (
          <button
            className="task-add-btn"
            onClick={() => navigate(`/${role}/tasks/create`)}
          >
            <Plus size={16} />
            Add Task
          </button>
        )}
      </div>

      <div className="task-table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Site</th>
              <th>Assigned To</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((item) => (
                <tr
                  key={item._id}
                  className="task-row"
                  onClick={() => navigate(`/${role}/tasks/view/${item._id}`)}
                >
                  <td>{item.title}</td>
                  <td>{item.site?.siteName || "—"}</td>
                  <td>{item.assignedTo?.name || "Unassigned"}</td>
                  <td>
                    <span className={priorityClass(item.priority)}>
                      {item.priority}
                    </span>
                  </td>
                  <td>{formatDate(item.dueDate)}</td>
                  <td>
                    <span className={statusClass(item.status)}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="task-empty-row">
                  <ListChecks size={28} />
                  <span>No tasks found</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
