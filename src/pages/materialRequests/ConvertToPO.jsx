import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import materialRequestService from "../../services/materialRequestService";
// ASSUMPTION: vendorService follows the same shape as siteService
// (a getVendors() method returning { vendors: [...] }). Adjust the
// import/method name below if your actual file differs.
import vendorService from "../../services/vendorService";

import "./MaterialRequest.css";

const ConvertToPO = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [request, setRequest] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    poNumber: "",
    vendor: "",
    unitPrice: "",
    expectedDelivery: "",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [reqRes, vendorRes] = await Promise.all([
        materialRequestService.getRequest(id),
        vendorService.getVendors().catch(() => ({ vendors: [] })),
      ]);

      if (reqRes.request?.status !== "Approved") {
        toast.error(
          "Only an approved request can be converted to a Purchase Order",
        );
        navigate(`/${role}/material-requests`);
        return;
      }

      setRequest(reqRes.request);
      setVendors(vendorRes.vendors || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load request");
      navigate(`/${role}/material-requests`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.poNumber) {
      toast.error("Please enter a PO number");
      return;
    }

    if (!formData.vendor) {
      toast.error("Please select a vendor");
      return;
    }

    if (!formData.unitPrice || Number(formData.unitPrice) <= 0) {
      toast.error("Please enter a valid unit price");
      return;
    }

    try {
      setSubmitting(true);

      await materialRequestService.convertToPO(id, {
        ...formData,
        unitPrice: Number(formData.unitPrice),
      });

      toast.success("Purchase Order created");

      setTimeout(() => {
        navigate(`/${role}/material-requests`);
      }, 800);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Conversion failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <h2 style={{ padding: 24 }}>Loading...</h2>;
  if (!request) return null;

  const estimatedTotal =
    formData.unitPrice && Number(formData.unitPrice) > 0
      ? (Number(formData.unitPrice) * request.quantity).toLocaleString("en-IN")
      : null;

  return (
    <div className="mr-page">
      <div className="mr-header">
        <div>
          <h2>Convert to Purchase Order</h2>
          <p className="mr-header-subtitle">
            {request.materialName} — {request.quantity} {request.unit} for{" "}
            {request.site?.siteName}
          </p>
        </div>
      </div>

      <div className="mr-form-card">
        <div className="mr-note">
          This creates a Purchase Order for the approved request and links the
          two together. The material, quantity, unit, and site are carried over
          automatically.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mr-form-grid">
            <div className="mr-form-group">
              <label>PO Number *</label>
              <input
                type="text"
                name="poNumber"
                value={formData.poNumber}
                onChange={handleChange}
                placeholder="e.g. PO-2026-014"
                required
              />
            </div>

            <div className="mr-form-group">
              <label>Vendor *</label>
              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                required
              >
                <option value="">Select Vendor</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.vendorName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mr-form-group">
              <label>Unit Price *</label>
              <input
                type="number"
                name="unitPrice"
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mr-form-group">
              <label>Expected Delivery</label>
              <input
                type="date"
                name="expectedDelivery"
                value={formData.expectedDelivery}
                onChange={handleChange}
              />
            </div>

            {estimatedTotal && (
              <div className="mr-form-group full-width">
                <label>Estimated Total</label>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  ₹{estimatedTotal}
                </div>
              </div>
            )}
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
              {submitting ? "Creating..." : "Create Purchase Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConvertToPO;
