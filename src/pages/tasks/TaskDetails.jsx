// ===============================================
// KV Projects ERP
// Task Details
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ListChecks,
  MapPin,
  User,
  CalendarDays,
  Loader2,
} from "lucide-react";
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
  if (!date) return "Not available";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Not available";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function TaskDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();
  const canManage = role === "owner" || role === "admin";

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadTask = async () => {
    try {
      setLoading(true);

      const res = await taskService.getTask(id);

      setTask(res?.task || res);
    } catch (error) {
      console.error("Get Task Error:", error);
      toast.error(error?.response?.data?.message || "Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadTask();
    }
  }, [id]);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    try {
      setUpdatingStatus(true);

      await taskService.updateTask(id, { status: newStatus });

      setTask((previous) => ({ ...previous, status: newStatus }));

      toast.success("Task status updated");
    } catch (error) {
      console.error("Update Task Status Error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update status",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?\n\nThis action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await taskService.deleteTask(id);

      toast.success("Task deleted successfully");

      navigate(`/${role}/tasks`);
    } catch (error) {
      console.error("Delete Task Error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete task");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="task-loading-center">
        <Loader2 size={24} className="task-spin" />
        <span>Loading task...</span>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="task-details-page">
        <div className="task-not-found-card">
          <ListChecks size={42} />
          <h2>Task Not Found</h2>
          <p>The requested task could not be found.</p>
          <button
            type="button"
            onClick={() => navigate(`/${role}/tasks`)}
            className="task-btn task-btn-primary"
          >
            <ArrowLeft size={17} />
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-details-page">
      <div className="task-details-header">
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <button
            type="button"
            onClick={() => navigate(`/${role}/tasks`)}
            className="task-icon-btn"
            title="Back"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <div className="task-details-title-row">
              <h1>{task.title}</h1>
              <span className={statusClass(task.status)}>{task.status}</span>
              <span className={priorityClass(task.priority)}>
                {task.priority}
              </span>
            </div>

            <p className="task-details-site">
              <MapPin size={15} />
              {task.site?.siteName || "Site not available"}
            </p>
          </div>
        </div>

        {canManage && (
          <div className="task-details-actions">
            <button
              type="button"
              onClick={() => navigate(`/${role}/tasks/edit/${id}`)}
              className="task-btn task-btn-primary"
            >
              <Edit size={17} />
              Edit Task
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="task-btn task-btn-danger"
            >
              {deleting ? (
                <Loader2 size={17} className="task-spin" />
              ) : (
                <Trash2 size={17} />
              )}
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="task-details-grid">
        <div>
          <div className="task-details-card">
            <div className="task-details-card-header">
              <div className="task-header-icon-badge">
                <ListChecks size={21} />
              </div>
              <div>
                <h2>Task Information</h2>
                <p>Details and description</p>
              </div>
            </div>

            <div className="task-info-item-grid">
              <TaskInfoItem
                icon={<MapPin size={18} />}
                label="Site"
                value={task.site?.siteName}
              />
              <TaskInfoItem
                icon={<User size={18} />}
                label="Assigned To"
                value={
                  task.assignedTo
                    ? `${task.assignedTo.name} (${task.assignedTo.email})`
                    : "Unassigned"
                }
              />
              <TaskInfoItem
                icon={<User size={18} />}
                label="Assigned By"
                value={task.assignedBy?.name}
              />
              <TaskInfoItem
                icon={<CalendarDays size={18} />}
                label="Due Date"
                value={formatDate(task.dueDate)}
              />
            </div>

            <div
              className={`task-description-box ${
                !task.description ? "task-description-empty" : ""
              }`}
            >
              {task.description || "No description has been added."}
            </div>
          </div>
        </div>

        <div>
          <div className="task-summary-side-card">
            <p className="task-summary-side-card-label">Update Status</p>
            <select
              value={task.status}
              onChange={handleStatusChange}
              disabled={updatingStatus}
              className="task-select"
              style={{ width: "100%" }}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="task-summary-side-card">
            <p className="task-summary-side-card-label">Priority</p>
            <span className={priorityClass(task.priority)}>
              {task.priority}
            </span>
          </div>

          <div className="task-summary-side-card">
            <p className="task-summary-side-card-label">Created On</p>
            <p className="task-summary-side-text-value">
              {formatDate(task.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskInfoItem({ icon, label, value }) {
  return (
    <div className="task-info-item">
      <div className="task-info-item-label">
        {icon}
        <span>{label}</span>
      </div>
      <p className="task-info-item-value">{value || "Not available"}</p>
    </div>
  );
}