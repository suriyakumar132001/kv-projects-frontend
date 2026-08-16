// ===============================================
// KV Projects ERP
// Edit Task
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, ListChecks, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import taskService from "../../services/taskService";
import siteService from "../../services/siteService";
import userService from "../../services/userService";

import "./Task.css";

const initialForm = {
  title: "",
  description: "",
  site: "",
  assignedTo: "",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
};

const toDateInputValue = (date) => {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString().slice(0, 10);
};

export default function EditTask() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [form, setForm] = useState(initialForm);
  const [sites, setSites] = useState([]);
  const [engineers, setEngineers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [taskRes, sitesRes, usersRes] = await Promise.all([
          taskService.getTask(id),
          siteService.getSites(),
          userService.getUsers(),
        ]);

        const task = taskRes?.task || taskRes;

        if (!task) {
          toast.error("Task not found");
          navigate(`/${role}/tasks`);
          return;
        }

        setForm({
          title: task.title || "",
          description: task.description || "",
          site: task.site?._id || task.site || "",
          assignedTo: task.assignedTo?._id || task.assignedTo || "",
          priority: task.priority || "Medium",
          status: task.status || "Pending",
          dueDate: toDateInputValue(task.dueDate),
        });

        setSites(sitesRes.sites || []);

        const siteEngineers = (usersRes.users || []).filter(
          (u) => u.role === "siteengineer",
        );

        setEngineers(siteEngineers);
      } catch (error) {
        console.error("Load Task Error:", error);
        toast.error(error?.response?.data?.message || "Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id, navigate, role]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Please enter a task title");
      return false;
    }

    if (!form.site) {
      toast.error("Please select a site");
      return false;
    }

    if (!form.assignedTo) {
      toast.error("Please select a site engineer to assign");
      return false;
    }

    if (!form.dueDate) {
      toast.error("Please select a due date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        site: form.site,
        assignedTo: form.assignedTo,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate,
      };

      await taskService.updateTask(id, payload);

      toast.success("Task updated successfully");

      navigate(`/${role}/tasks/view/${id}`);
    } catch (error) {
      console.error("Update Task Error:", error);
      toast.error(error?.response?.data?.message || "Failed to update task");
    } finally {
      setSaving(false);
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

  return (
    <div className="task-form-page">
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <div className="task-form-header">
          <div className="task-form-header-left">
            <button
              type="button"
              onClick={() => navigate(`/${role}/tasks/view/${id}`)}
              className="task-icon-btn"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1>Edit Task</h1>
              <p>Update task details</p>
            </div>
          </div>

          <div className="task-header-icon-badge">
            <ListChecks size={22} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="task-form-card">
          <div className="task-form-card-header">
            <h2>Task Information</h2>
            <p>Update the task details</p>
          </div>

          <div className="task-form-grid">
            <div className="task-form-group full-width">
              <label>
                Title <span className="task-required">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="task-form-group">
              <label>
                Site <span className="task-required">*</span>
              </label>
              <select
                name="site"
                value={form.site}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="">Select site</option>
                {sites.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.siteName}
                  </option>
                ))}
              </select>
            </div>

            <div className="task-form-group">
              <label>
                Assign To <span className="task-required">*</span>
              </label>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="">Select engineer</option>
                {engineers.map((eng) => (
                  <option key={eng._id} value={eng._id}>
                    {eng.name} - {eng.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="task-form-group">
              <label>Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="task-form-group">
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={saving}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="task-form-group">
              <label>
                Due Date <span className="task-required">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <div className="task-form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                disabled={saving}
              />
            </div>
          </div>

          <div className="task-form-buttons">
            <button
              type="button"
              onClick={() => navigate(`/${role}/tasks/view/${id}`)}
              disabled={saving}
              className="task-btn task-btn-outline"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="task-btn task-btn-primary"
            >
              {saving ? (
                <Loader2 size={17} className="task-spin" />
              ) : (
                <Save size={17} />
              )}
              {saving ? "Updating..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
