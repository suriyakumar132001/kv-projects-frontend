import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import dprService from "../../services/dprService";
import siteService from "../../services/siteService";

import "./DPR.css";

const LABOUR_FIELDS = ["mason", "helper", "carpenter", "electrician", "plumber", "painter"];
const MATERIAL_FIELDS = ["cement", "steel", "sand", "bricks", "jelly"];

const CreateDPR = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [sites, setSites] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    site: "",
    weather: "Sunny",
    progress: 0,
    workDescription: "",
    tomorrowPlan: "",
    issues: "",
    remarks: "",
  });

  const [labour, setLabour] = useState(
    LABOUR_FIELDS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
  );

  const [materials, setMaterials] = useState(
    MATERIAL_FIELDS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
  );

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

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

  const handleLabourChange = (key, value) => {
    setLabour({ ...labour, [key]: value });
  };

  const handleMaterialChange = (key, value) => {
    setMaterials({ ...materials, [key]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.site) {
      toast.error("Please select a site");
      return;
    }

    if (!formData.workDescription) {
      toast.error("Please describe today's work");
      return;
    }

    try {
      setSubmitting(true);

      const payload = new FormData();

      payload.append("site", formData.site);
      payload.append("weather", formData.weather);
      payload.append("progress", formData.progress);
      payload.append("workDescription", formData.workDescription);
      payload.append("tomorrowPlan", formData.tomorrowPlan);
      payload.append("issues", formData.issues);
      payload.append("remarks", formData.remarks);

      // Backend expects nested objects — send as JSON strings,
      // matching how the labour/materials sub-schemas are shaped
      payload.append("labour", JSON.stringify(labour));
      payload.append("materials", JSON.stringify(materials));

      images.forEach((file) => {
        payload.append("images", file);
      });

      await dprService.createReport(payload);

      toast.success("Daily Progress Report submitted successfully");

      setTimeout(() => {
        navigate(`/${role}/dpr`);
      }, 800);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dpr-page">
      <div className="dpr-header">
        <h2>New Daily Progress Report</h2>
      </div>

      <div className="dpr-form-card">
        <form onSubmit={handleSubmit}>
          <div className="dpr-form-section-title">Basic Info</div>

          <div className="dpr-form-grid">
            <div className="dpr-form-group">
              <label>Site</label>
              <select name="site" value={formData.site} onChange={handleChange} required>
                <option value="">Select Site</option>
                {sites.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.siteName}
                  </option>
                ))}
              </select>
            </div>

            <div className="dpr-form-group">
              <label>Weather</label>
              <select name="weather" value={formData.weather} onChange={handleChange}>
                <option value="Sunny">Sunny</option>
                <option value="Cloudy">Cloudy</option>
                <option value="Rainy">Rainy</option>
              </select>
            </div>

            <div className="dpr-form-group">
              <label>Progress (%)</label>
              <input
                type="number"
                name="progress"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="dpr-form-section-title">Labour Count</div>

          <div className="dpr-form-grid">
            {LABOUR_FIELDS.map((key) => (
              <div className="dpr-form-group" key={key}>
                <label style={{ textTransform: "capitalize" }}>{key}</label>
                <input
                  type="number"
                  min="0"
                  value={labour[key]}
                  onChange={(e) => handleLabourChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="dpr-form-section-title">Materials Used</div>

          <div className="dpr-form-grid">
            {MATERIAL_FIELDS.map((key) => (
              <div className="dpr-form-group" key={key}>
                <label style={{ textTransform: "capitalize" }}>{key}</label>
                <input
                  type="number"
                  min="0"
                  value={materials[key]}
                  onChange={(e) => handleMaterialChange(key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="dpr-form-section-title">Report Details</div>

          <div className="dpr-form-grid two-col">
            <div className="dpr-form-group full-width">
              <label>Work Description *</label>
              <textarea
                name="workDescription"
                value={formData.workDescription}
                onChange={handleChange}
                placeholder="Describe the work carried out today"
                required
              />
            </div>

            <div className="dpr-form-group full-width">
              <label>Tomorrow's Plan</label>
              <textarea
                name="tomorrowPlan"
                value={formData.tomorrowPlan}
                onChange={handleChange}
              />
            </div>

            <div className="dpr-form-group full-width">
              <label>Issues / Delays</label>
              <textarea
                name="issues"
                value={formData.issues}
                onChange={handleChange}
              />
            </div>

            <div className="dpr-form-group full-width">
              <label>Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>

            <div className="dpr-form-group full-width">
              <label>Site Photos (up to 10)</label>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} />

              {previews.length > 0 && (
                <div className="dpr-image-preview-row">
                  {previews.map((src, idx) => (
                    <img key={idx} src={src} alt={`preview-${idx}`} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="dpr-form-actions">
            <button
              type="button"
              className="dpr-cancel-btn"
              onClick={() => navigate(`/${role}/dpr`)}
            >
              Cancel
            </button>

            <button type="submit" className="dpr-submit-btn" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDPR;