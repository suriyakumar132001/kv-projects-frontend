import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const toDateInput = (value) => (value ? value.substring(0, 10) : "");

const EditLead = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
    loadLead();
  }, [id]);

  const loadUsers = async () => {
    try {
      const res = await userService.getUsers();
      setUsers(res.users || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadLead = async () => {
    try {
      setLoading(true);
      const res = await leadService.getLead(id);
      const lead = res.lead;

      setFormData({
        leadName: lead.leadName || "",
        companyName: lead.companyName || "",
        email: lead.email || "",
        phone: lead.phone || "",
        projectType: lead.projectType || "",
        source: lead.source || "Referral",
        estimatedValue: lead.estimatedValue || "",
        assignedTo: lead.assignedTo?._id || "",
        nextFollowUpDate: toDateInput(lead.nextFollowUpDate),
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load lead");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const payload = {
        ...formData,
        estimatedValue: formData.estimatedValue
          ? Number(formData.estimatedValue)
          : 0,
        assignedTo: formData.assignedTo || null,
        nextFollowUpDate: formData.nextFollowUpDate || null,
      };

      await leadService.updateLead(id, payload);

      toast.success("Lead updated");

      setTimeout(() => {
        navigate(`/${role}/leads/view/${id}`);
      }, 600);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update lead");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <h2 style={{ padding: 24 }}>Loading...</h2>;

  return (
    <div className="lead-page">
      <div className="lead-header">
        <div>
          <h2>Edit Lead</h2>
          <p className="lead-header-subtitle">Update prospect details</p>
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
              onClick={() => navigate(`/${role}/leads/view/${id}`)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="lead-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLead;
