import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import vendorService from "../../services/vendorService";

import "./Vendor.css";

const AddVendor = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    vendorName: "",
    contactPerson: "",
    phone: "",
    email: "",
    gstNumber: "",
    address: "",
    materialType: "Other",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vendorName || !formData.phone) {
      return toast.error("Vendor name and phone are required");
    }

    try {
      setLoading(true);

      await vendorService.createVendor(formData);

      toast.success("Vendor Created Successfully");

      navigate(`/${role}/vendors`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create vendor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-form-page">

      <div className="vendor-form-card">

        <h2>Add New Vendor</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Vendor Name</label>
            <input
              type="text"
              name="vendorName"
              value={formData.vendorName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>GST Number</label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Material Type</label>
            <select
              name="materialType"
              value={formData.materialType}
              onChange={handleChange}
            >
              <option value="Cement">Cement</option>
              <option value="Steel">Steel</option>
              <option value="Sand">Sand</option>
              <option value="Bricks">Bricks</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Paint">Paint</option>
              <option value="Machinery">Machinery</option>
              <option value="Other">Other</option>
            </select>
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

          <div className="form-group">
            <label>Address</label>
            <textarea
              rows="3"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/${role}/vendors`)}
            >
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Vendor"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default AddVendor;