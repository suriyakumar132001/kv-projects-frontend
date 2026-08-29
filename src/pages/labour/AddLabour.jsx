// ===============================================
// KV Projects ERP
// Add Labour
// ===============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Save, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";

import labourService from "../../services/labourService";
import "./Labour.css";

const AddLabour = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    contactNumber: "",
    wageType: "",
    wageRate: "",
    joiningDate: "",
    address: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      contactNumber: "",
      wageType: "",
      wageRate: "",
      joiningDate: "",
      address: "",
      status: "Active",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter labour name");
      return;
    }

    if (!formData.role) {
      toast.error("Please select a role");
      return;
    }

    if (!formData.wageType) {
      toast.error("Please select wage type");
      return;
    }

    if (!formData.wageRate) {
      toast.error("Please enter wage rate");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        role: formData.role,
        contactNumber: formData.contactNumber.trim(),
        wageType: formData.wageType,
        wageRate: Number(formData.wageRate),
        joiningDate: formData.joiningDate || undefined,
        address: formData.address.trim(),
        status: formData.status,
      };

      await labourService.createLabour(payload);

      toast.success("Labour added successfully");

      navigate("..");
    } catch (error) {
      console.error("Create labour error:", error);

      toast.error(error?.response?.data?.message || "Failed to add labour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="labour-page">
      {/* Header */}
      <div className="labour-header">
        <div
          className="labour-header-left"
          style={{ display: "flex", alignItems: "center", gap: "14px" }}
        >
          <button
            type="button"
            onClick={() => navigate("..")}
            className="btn-icon view"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1>Add Labour</h1>
            <p>Add a new labour record.</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="labour-form-page">
        <div className="labour-form-card">
          {/* Form Header */}
          <div className="form-card-header">
            <div className="form-card-icon">
              <Users size={21} />
            </div>

            <div>
              <h2>Labour Information</h2>
              <p>Enter the labour details below.</p>
            </div>
          </div>

          {/* Fields */}
          <div className="form-grid">
            {/* Name */}
            <div className="form-group">
              <label>Labour Name *</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </div>

            {/* Role */}
            <div className="form-group">
              <label>Role *</label>

              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="">Select role</option>
                <option value="Mason">Mason</option>
                <option value="Helper">Helper</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Electrician">Electrician</option>
                <option value="Plumber">Plumber</option>
                <option value="Painter">Painter</option>
                <option value="Steel Fixer">Steel Fixer</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Contact Number */}
            <div className="form-group">
              <label>Contact Number</label>

              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter contact number"
              />
            </div>

            {/* Wage Type */}
            <div className="form-group">
              <label>Wage Type *</label>

              <select
                name="wageType"
                value={formData.wageType}
                onChange={handleChange}
              >
                <option value="">Select wage type</option>
                <option value="Daily">Daily</option>
                <option value="Monthly">Monthly</option>
                <option value="Piece Rate">Piece Rate</option>
              </select>
            </div>

            {/* Wage Rate */}
            <div className="form-group">
              <label>Wage Rate (₹) *</label>

              <input
                type="number"
                name="wageRate"
                min="0"
                step="0.01"
                value={formData.wageRate}
                onChange={handleChange}
                placeholder="₹ 0.00"
              />
            </div>

            {/* Joining Date */}
            <div className="form-group">
              <label>Joining Date</label>

              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Address */}
            <div className="form-group full-width">
              <label>Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                placeholder="Enter address..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="form-card-footer">
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="btn btn-outline"
            >
              <RotateCcw size={18} />
              Reset
            </button>

            <button
              type="button"
              onClick={() => navigate("..")}
              disabled={loading}
              className="btn btn-outline"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Labour"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddLabour;
