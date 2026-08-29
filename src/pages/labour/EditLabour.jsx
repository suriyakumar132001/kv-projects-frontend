// ===============================================
// KV Projects ERP
// Edit Labour
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users, Save } from "lucide-react";
import { toast } from "react-toastify";

import labourService from "../../services/labourService";
import "./Labour.css";

const EditLabour = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // ============================================
  // Load Labour
  // ============================================

  useEffect(() => {
    const loadLabour = async () => {
      try {
        setLoading(true);

        const response = await labourService.getLabourById(id);

        const labour =
          response?.labour ||
          response?.data?.labour ||
          response?.data ||
          response;

        setFormData({
          name: labour?.name || "",

          role: labour?.role || "",

          contactNumber: labour?.contactNumber || "",

          wageType: labour?.wageType || "",

          wageRate: labour?.wageRate ?? "",

          joiningDate: labour?.joiningDate
            ? String(labour.joiningDate).slice(0, 10)
            : "",

          address: labour?.address || "",

          status: labour?.status || "Active",
        });
      } catch (error) {
        console.error("Failed to load labour record:", error);

        toast.error(
          error?.response?.data?.message || "Failed to load labour record",
        );

        navigate("..");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadLabour();
    }
  }, [id, navigate]);

  // ============================================
  // Handle Change
  // ============================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================
  // Submit
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter labour name");
      return;
    }

    if (!formData.role) {
      toast.error("Please select role");
      return;
    }

    if (!formData.wageType) {
      toast.error("Please select wage type");
      return;
    }

    if (formData.wageRate === "" || Number(formData.wageRate) < 0) {
      toast.error("Please enter a valid wage rate");
      return;
    }

    try {
      setSaving(true);

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

      await labourService.updateLabour(id, payload);

      toast.success("Labour updated successfully");

      navigate("..");
    } catch (error) {
      console.error("Update labour error:", error);

      toast.error(error?.response?.data?.message || "Failed to update labour");
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // Loading Screen
  // ============================================

  if (loading) {
    return (
      <div className="labour-page">
        <p style={{ color: "#6b7280" }}>Loading labour record...</p>
      </div>
    );
  }

  // ============================================
  // UI
  // ============================================

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
            disabled={saving}
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1>Edit Labour</h1>
            <p>Update labour information.</p>
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
              <p>Update the labour details below.</p>
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
                disabled={saving}
              />
            </div>

            {/* Role */}
            <div className="form-group">
              <label>Role *</label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={saving}
              >
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
                disabled={saving}
              />
            </div>

            {/* Wage Type */}
            <div className="form-group">
              <label>Wage Type *</label>

              <select
                name="wageType"
                value={formData.wageType}
                onChange={handleChange}
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={saving}
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
                disabled={saving}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="form-card-footer">
            <button
              type="button"
              onClick={() => navigate("..")}
              disabled={saving}
              className="btn btn-outline"
            >
              Cancel
            </button>

            <button type="submit" disabled={saving} className="btn btn-primary">
              <Save size={18} />
              {saving ? "Updating..." : "Update Labour"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditLabour;
