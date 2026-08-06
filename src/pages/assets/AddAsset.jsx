import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import assetService from "../../services/assetService";

import "./Asset.css";

const AddAsset = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    assetName: "",
    assetCode: "",
    category: "Machine",
    purchaseDate: "",
    purchaseCost: "",
    status: "Available",
    remarks: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.assetName || !formData.assetCode) {
      return toast.error("Asset name and code are required");
    }

    try {
      setLoading(true);

      await assetService.createAsset(formData);

      toast.success("Asset Created Successfully");

      navigate(`/${role}/assets`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create asset"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="asset-form-page">

      <div className="asset-form-card">

        <h2>Add New Asset</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Asset Name</label>
            <input
              type="text"
              name="assetName"
              value={formData.assetName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Asset Code</label>
            <input
              type="text"
              name="assetCode"
              value={formData.assetCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Machine">Machine</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Tool">Tool</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>

          <div className="form-group">
            <label>Purchase Date</label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Purchase Cost</label>
            <input
              type="number"
              name="purchaseCost"
              value={formData.purchaseCost}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <textarea
              rows="3"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/${role}/assets`)}
            >
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Asset"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default AddAsset;