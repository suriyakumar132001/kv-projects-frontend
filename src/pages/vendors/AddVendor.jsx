// ===============================================
// KV Projects ERP
// Add Vendor
// ===============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, Save, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";

import vendorService from "../../services/vendorService";
import "./Vendor.css";

const AddVendor = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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
      company: "",
      category: "",
      contactNumber: "",
      email: "",
      gstNumber: "",
      address: "",
      status: "Active",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter vendor name");
      return;
    }

    if (!formData.contactNumber.trim()) {
      toast.error("Please enter contact number");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    try {
      setLoading(true);

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

      await vendorService.createVendor(payload);

      toast.success("Vendor added successfully");

      navigate("..");
    } catch (error) {
      console.error("Create vendor error:", error);

      toast.error(error?.response?.data?.message || "Failed to add vendor");
    } finally {
      setLoading(false);
    }
  };

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
            className="btn-icon view"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1>Add Vendor</h1>
            <p>Add a new vendor or supplier.</p>
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
                <p>Enter the vendor details below.</p>
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
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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
                />
              </div>

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
                {loading ? "Saving..." : "Save Vendor"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;
