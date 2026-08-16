import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import materialRequestService from "../../services/materialRequestService";
import siteService from "../../services/siteService";

import "./MaterialRequest.css";

const UNIT_OPTIONS = [
  "Bag",
  "Kg",
  "Ton",
  "Nos",
  "Feet",
  "Meter",
  "Litre",
  "CFT",
];

const CreateMaterialRequest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [sites, setSites] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    site: "",
    materialName: "",
    quantity: "",
    unit: "Bag",
    urgency: "Normal",
    reason: "",
  });

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const res = await siteService.getSites();
      setSites(res.sites || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.site) {
      toast.error("Please select a site");
      return;
    }

    if (!formData.materialName) {
      toast.error("Please enter the material name");
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    try {
      setSubmitting(true);

      await materialRequestService.createRequest({
        ...formData,
        quantity: Number(formData.quantity),
      });

      toast.success("Material request submitted");

      setTimeout(() => {
        navigate(`/${role}/material-requests`);
      }, 800);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mr-page">
      <div className="mr-header">
        <div>
          <h2>New Material Request</h2>
          <p className="mr-header-subtitle">
            Request material for a site — an Owner or Admin will review it
          </p>
        </div>
      </div>

      <div className="mr-form-card">
        <form onSubmit={handleSubmit}>
          <div className="mr-form-grid">
            <div className="mr-form-group">
              <label>Site</label>
              <select
                name="site"
                value={formData.site}
                onChange={handleChange}
                required
              >
                <option value="">Select Site</option>
                {sites.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.siteName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mr-form-group">
              <label>Urgency</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="mr-form-group full-width">
              <label>Material Name *</label>
              <input
                type="text"
                name="materialName"
                value={formData.materialName}
                onChange={handleChange}
                placeholder="e.g. OPC 53 Grade Cement"
                required
              />
            </div>

            <div className="mr-form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mr-form-group">
              <label>Unit</label>
              <select name="unit" value={formData.unit} onChange={handleChange}>
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="mr-form-group full-width">
              <label>Reason / Notes</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Why is this needed — which work does it block?"
              />
            </div>
          </div>

          <div className="mr-form-actions">
            <button
              type="button"
              className="mr-cancel-btn"
              onClick={() => navigate(`/${role}/material-requests`)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="mr-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMaterialRequest;
