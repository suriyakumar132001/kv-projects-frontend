import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, RotateCcw, Users } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import labourService from "../../services/labourService";
import siteService from "../../services/siteService";
import "./Labour.css";

const LABOUR_TYPES = [
  ["mason", "Mason"],
  ["helper", "Helper"],
  ["carpenter", "Carpenter"],
  ["electrician", "Electrician"],
  ["plumber", "Plumber"],
  ["painter", "Painter"],
];

const initialFormData = {
  site: "",
  mason: 0,
  helper: 0,
  carpenter: 0,
  electrician: 0,
  plumber: 0,
  painter: 0,
  remarks: "",
};

const AddLabour = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();
  const [sites, setSites] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loadingSites, setLoadingSites] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSites = async () => {
      try {
        const response = await siteService.getSites();
        const siteOptions = response.sites || [];
        setSites(siteOptions);
        if (siteOptions.length === 1) {
          setFormData((prev) => ({ ...prev, site: siteOptions[0]._id }));
        }
      } catch (error) {
        toast.error("Unable to load sites");
      } finally {
        setLoadingSites(false);
      }
    };

    loadSites();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setFormData(initialFormData);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.site) {
      toast.error("Please select a site");
      return;
    }

    const payload = {
      site: formData.site,
      ...Object.fromEntries(
        LABOUR_TYPES.map(([field]) => [field, Number(formData[field]) || 0]),
      ),
      remarks: formData.remarks.trim(),
    };

    try {
      setLoading(true);
      await labourService.createLabour(payload);
      toast.success("Labour attendance added successfully");
      navigate(`/${role}/labour`);
    } catch (error) {
      console.error("Create labour attendance error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to add labour attendance",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="labour-page">
      <div className="labour-header">
        <div
          className="labour-header-left"
          style={{ display: "flex", alignItems: "center", gap: "14px" }}
        >
          <button
            type="button"
            onClick={() => navigate("..")}
            className="btn-icon view"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Add Labour</h1>
            <p>Record labour attendance for a site.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="labour-form-page">
        <div className="labour-form-card">
          <div className="form-card-header">
            <div className="form-card-icon">
              <Users size={21} />
            </div>
            <div>
              <h2>Labour Attendance</h2>
              <p>Enter the headcount for each labour type.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="site">Site *</label>
              {loadingSites ? (
                <p>Loading sites...</p>
              ) : sites.length ? (
                <select
                  id="site"
                  name="site"
                  value={formData.site}
                  onChange={handleChange}
                >
                  <option value="">Select site</option>
                  {sites.map((site) => (
                    <option key={site._id} value={site._id}>
                      {site.siteName} - {site.projectName}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="form-error">No sites are assigned to your account.</p>
              )}
            </div>

            {LABOUR_TYPES.map(([field, label]) => (
              <div className="form-group" key={field}>
                <label htmlFor={field}>{label}</label>
                <input
                  id={field}
                  type="number"
                  name={field}
                  min="0"
                  step="1"
                  value={formData[field]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div className="form-group full-width">
              <label htmlFor="remarks">Remarks</label>
              <textarea
                id="remarks"
                rows="4"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Enter remarks"
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
              disabled={loading || loadingSites || !sites.length}
              className="btn btn-primary"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddLabour;
