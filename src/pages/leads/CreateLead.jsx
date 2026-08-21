import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import leadService from "../../services/leadService";
import userService from "../../services/userService";

import "./Lead.css";

const SOURCE_OPTIONS = [
  "Referral",
  "Website",
  "Site Visit",
  "Phone Enquiry",
  "Social Media",
  "Other",
];

const CreateLead = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [users, setUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    leadName: "",
    companyName: "",
    email: "",
    phone: "",
    projectType: "",
    source: "Referral",
    estimatedValue: "",
    assignedTo: "",
    nextFollowUpDate: "",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await userService.getUsers();
      setUsers(res.users || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.leadName) {
      toast.error("Please enter the lead's name");
      return;
    }

    if (!formData.phone) {
      toast.error("Please enter a phone number");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        estimatedValue: formData.estimatedValue
          ? Number(formData.estimatedValue)
          : 0,
        assignedTo: formData.assignedTo || undefined,
        nextFollowUpDate: formData.nextFollowUpDate || undefined,
      };

      await leadService.createLead(payload);

      toast.success("Lead created");

      setTimeout(() => {
        navigate(`/${role}/leads`);
      }, 600);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create lead");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="lead-page">
      <div className="lead-header">
        <div>
          <h2>New Lead</h2>
          <p className="lead-header-subtitle">
            Add a prospect to the sales pipeline
          </p>
        </div>
      </div>

      <div className="lead-form-card">
        <form onSubmit={handleSubmit}>
          <div className="lead-form-grid">
            <div className="lead-form-group">
              <label>Lead Name *</label>
              <input
                type="text"
                name="leadName"
                value={formData.leadName}
                onChange={handleChange}
                placeholder="e.g. Ramesh Gupta"
                required
              />
            </div>

            <div className="lead-form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

            <div className="lead-form-group">
              <label>Phone *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="lead-form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="lead-form-group">
              <label>Project Type</label>
              <input
                type="text"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                placeholder="e.g. Residential Interior"
              />
            </div>

            <div className="lead-form-group">
              <label>Source</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
              >
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="lead-form-group">
              <label>Estimated Value (₹)</label>
              <input
                type="number"
                name="estimatedValue"
                min="0"
                value={formData.estimatedValue}
                onChange={handleChange}
              />
            </div>

            <div className="lead-form-group">
              <label>Assign To</label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="lead-form-group">
              <label>Next Follow-up Date</label>
              <input
                type="date"
                name="nextFollowUpDate"
                value={formData.nextFollowUpDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="lead-form-actions">
            <button
              type="button"
              className="lead-cancel-btn"
              onClick={() => navigate(`/${role}/leads`)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="lead-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLead;
