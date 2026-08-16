import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import purchaseOrderService from "../../services/purchaseOrderService";
import siteService from "../../services/siteService";
// ASSUMPTION: same shape as siteService — a getVendors()
// method returning { vendors: [...] }. Adjust if different.
import vendorService from "../../services/vendorService";

import "./PurchaseOrder.css";

const UNIT_OPTIONS = ["Bag", "Kg", "Ton", "Nos", "Feet", "Meter", "Litre", "CFT"];

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [sites, setSites] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    poNumber: "",
    site: "",
    vendor: "",
    materialName: "",
    quantity: "",
    unit: "Bag",
    unitPrice: "",
    expectedDelivery: "",
  });

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [siteRes, vendorRes] = await Promise.all([
        siteService.getSites(),
        vendorService.getVendors().catch(() => ({ vendors: [] })),
      ]);
      setSites(siteRes.sites || []);
      setVendors(vendorRes.vendors || []);
    } catch (error) {
      console.error(error);
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

    if (!formData.site) {
      toast.error("Please select a site");
      return;
    }

    if (!formData.vendor) {
      toast.error("Please select a vendor");
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

    if (!formData.unitPrice || Number(formData.unitPrice) <= 0) {
      toast.error("Please enter a valid unit price");
      return;
    }

    try {
      setSubmitting(true);

      await purchaseOrderService.createPurchaseOrder({
        ...formData,
        quantity: Number(formData.quantity),
        unitPrice: Number(formData.unitPrice),
      });

      toast.success("Purchase Order created");

      setTimeout(() => {
        navigate(`/${role}/purchase-orders`);
      }, 800);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create PO");
    } finally {
      setSubmitting(false);
    }
  };

  const estimatedTotal =
    formData.quantity && formData.unitPrice
      ? (Number(formData.quantity) * Number(formData.unitPrice)).toLocaleString(
          "en-IN",
        )
      : null;

  return (
    <div className="pc-page">
      <div className="pc-header">
        <div>
          <h2>New Purchase Order</h2>
          <p className="pc-header-subtitle">
            Raise a direct purchase order — not tied to a Material Request
          </p>
        </div>
      </div>

      <div className="pc-form-card">
        <form onSubmit={handleSubmit}>
          <div className="pc-form-grid">
            <div className="pc-form-group">
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

            <div className="pc-form-group">
              <label>Site *</label>
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

            <div className="pc-form-group">
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

            <div className="pc-form-group">
              <label>Expected Delivery</label>
              <input
                type="date"
                name="expectedDelivery"
                value={formData.expectedDelivery}
                onChange={handleChange}
              />
            </div>

            <div className="pc-form-group full-width">
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

            <div className="pc-form-group">
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

            <div className="pc-form-group">
              <label>Unit</label>
              <select name="unit" value={formData.unit} onChange={handleChange}>
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="pc-form-group">
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

            {estimatedTotal && (
              <div className="pc-form-group full-width">
                <label>Estimated Total</label>
                <div style={{ fontSize: 20, fontWeight: 700 }}>
                  ₹{estimatedTotal}
                </div>
              </div>
            )}
          </div>

          <div className="pc-form-actions">
            <button
              type="button"
              className="pc-cancel-btn"
              onClick={() => navigate(`/${role}/purchase-orders`)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="pc-submit-btn"
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

export default CreatePurchaseOrder;