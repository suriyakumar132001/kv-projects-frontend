// ===============================================
// KV Projects ERP
// Create Task
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  dueDate: "",
};

export default function CreateTask() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [form, setForm] = useState(initialForm);
  const [sites, setSites] = useState([]);
  const [engineers, setEngineers] = useState([]);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);

        const [sitesRes, usersRes] = await Promise.all([
          siteService.getSites(),
          userService.getUsers(),
        ]);

        setSites(sitesRes.sites || []);

        const siteEngineers = (usersRes.users || []).filter(
          (u) => u.role === "siteengineer",
        );

        setEngineers(siteEngineers);
      } catch (error) {
        console.error("Load Task Options Error:", error);
        toast.error("Failed to load sites/engineers");
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

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
        dueDate: form.dueDate,
      };

      await taskService.createTask(payload);

      toast.success("Task created successfully");

      navigate(`/${role}/tasks`);
    } catch (error) {
      console.error("Create Task Error:", error);
      toast.error(error?.response?.data?.message || "Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="task-form-page">
      <div style={{ width: "100%", maxWidth: "800px" }}>
        <div className="task-form-header">
          <div className="task-form-header-left">
            <button
              type="button"
              onClick={() => navigate(`/${role}/tasks`)}
              className="task-icon-btn"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1>Create Task</h1>
              <p>Assign a new task to a site engineer</p>
            </div>
          </div>

          <div className="task-header-icon-badge">
            <ListChecks size={22} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="task-form-card">
          <div className="task-form-card-header">
            <h2>Task Information</h2>
            <p>Enter the task details</p>
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
                placeholder="Enter task title"
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
                disabled={loadingOptions}
              >
                <option value="">
                  {loadingOptions ? "Loading sites..." : "Select site"}
                </option>
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
                disabled={loadingOptions}
              >
                <option value="">
                  {loadingOptions ? "Loading engineers..." : "Select engineer"}
                </option>
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
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
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
              />
            </div>

            <div className="task-form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Enter task description..."
              />
            </div>
          </div>

          <div className="task-form-buttons">
            <button
              type="button"
              onClick={() => navigate(`/${role}/tasks`)}
              disabled={saving}
              className="task-btn task-btn-outline"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || loadingOptions}
              className="task-btn task-btn-primary"
            >
              {saving ? (
                <Loader2 size={17} className="task-spin" />
              ) : (
                <Save size={17} />
              )}
              {saving ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
