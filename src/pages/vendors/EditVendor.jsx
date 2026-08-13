// ===============================================
// KV Projects ERP
// Edit Vendor
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Truck, Save } from "lucide-react";
import { toast } from "react-toastify";

import vendorService from "../../services/vendorService";
import "./Vendor.css";

const EditVendor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    category: "",
    contactNumber: "",
    email: "",
    gstNumber: "",
    address: "",
    status: "Active",
  });

  useEffect(() => {
    const loadVendor = async () => {
      try {
        setLoading(true);

        const response = await vendorService.getVendorById(id);

        const vendor =
          response?.vendor ||
          response?.data?.vendor ||
          response?.data ||
          response;

        setFormData({
          name: vendor?.name || vendor?.vendorName || "",
          company: vendor?.company || "",
          category: vendor?.category || "",
          contactNumber: vendor?.contactNumber || "",
          email: vendor?.email || "",
          gstNumber: vendor?.gstNumber || "",
          address: vendor?.address || "",
          status: vendor?.status || "Active",
        });
      } catch (error) {
        console.error("Failed to load vendor:", error);

        toast.error(error?.response?.data?.message || "Failed to load vendor");

        navigate("..");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadVendor();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter vendor name");
      return;
    }

    if (!formData.category) {
      toast.error("Please select category");
      return;
    }

    if (!formData.contactNumber.trim()) {
      toast.error("Please enter contact number");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        company: formData.company.trim(),
        category: formData.category,
        contactNumber: formData.contactNumber.trim(),
        email: formData.email.trim(),
        gstNumber: formData.gstNumber.trim(),
        address: formData.address.trim(),
        status: formData.status,
      };

      await vendorService.updateVendor(id, payload);

      toast.success("Vendor updated successfully");

      navigate("..");
    } catch (error) {
      console.error("Update vendor error:", error);

      toast.error(error?.response?.data?.message || "Failed to update vendor");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="vendor-page">
        <p style={{ color: "#6b7280" }}>Loading vendor...</p>
      </div>
    );
  }

  return (
    <div className="vendor-page">
      <div className="vendor-header">
        <div
          className="vendor-header-left"
          style={{ display: "flex", alignItems: "center", gap: "14px" }}
        >
          <button
            type="button"
            onClick={() => navigate("..")}
            disabled={saving}
            className="btn-icon view"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1>Edit Vendor</h1>
            <p>Update vendor information.</p>
          </div>
        </div>
      </div>

      <div className="vendor-form-page">
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", maxWidth: "850px" }}
        >
          <div className="vendor-form-card">
            <div className="form-card-header">
              <div className="form-card-icon">
                <Truck size={21} />
              </div>
              <div>
                <h2>Vendor Information</h2>
                <p>Update the vendor details below.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Vendor Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter vendor name"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="">Select category</option>
                  <option value="Cement">Cement</option>
                  <option value="Steel">Steel</option>
                  <option value="Sand & Aggregate">Sand & Aggregate</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Equipment Rental">Equipment Rental</option>
                  <option value="Transport">Transport</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Contact Number *</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label>GST Number</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="Enter GST number"
                  disabled={saving}
                />
              </div>

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

            <div className="form-card-footer">
              <button
                type="button"
                onClick={() => navigate("..")}
                disabled={saving}
                className="btn btn-outline"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
              >
                <Save size={18} />
                {saving ? "Updating..." : "Update Vendor"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVendor;
