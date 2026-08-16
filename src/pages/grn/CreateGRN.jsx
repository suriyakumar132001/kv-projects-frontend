import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import purchaseOrderService from "../../services/purchaseOrderService";
import grnService from "../../services/grnService";

import "./GRN.css";

const CONDITION_OPTIONS = ["Good", "Damaged", "Partial Damage"];

const CreateGRN = () => {
  const { id: poId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    grnNumber: "",
    quantityReceived: "",
    condition: "Good",
    notes: "",
  });

  useEffect(() => {
    loadPO();
  }, [poId]);

  const loadPO = async () => {
    try {
      setLoading(true);
      const res = await purchaseOrderService.getPurchaseOrderById(poId);
      if (
        !["Ordered", "Partially Received"].includes(res.purchaseOrder.status)
      ) {
        toast.error("This Purchase Order cannot receive any more material");
        navigate(`/${role}/purchase-orders/view/${poId}`);
        return;
      }

      setPo(res.purchaseOrder);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load purchase order");
      navigate(`/${role}/purchase-orders`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const remaining = po ? po.quantity - po.receivedQuantity : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.grnNumber) {
      toast.error("Please enter a GRN number");
      return;
    }

    if (!formData.quantityReceived || Number(formData.quantityReceived) <= 0) {
      toast.error("Please enter a valid quantity received");
      return;
    }

    if (Number(formData.quantityReceived) > remaining) {
      toast.error(
        `Cannot exceed the remaining balance of ${remaining} ${po.unit}`,
      );
      return;
    }

    try {
      setSubmitting(true);

      await grnService.createGRN({
        ...formData,
        purchaseOrder: poId,
        quantityReceived: Number(formData.quantityReceived),
      });

      toast.success("Goods receipt recorded — inventory updated");

      setTimeout(() => {
        navigate(`/${role}/purchase-orders/view/${poId}`);
      }, 800);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to record receipt");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <h2 style={{ padding: 24 }}>Loading...</h2>;
  if (!po) return null;

  return (
    <div className="pc-page">
      <div className="pc-header">
        <div>
          <h2>Record Goods Receipt</h2>
          <p className="pc-header-subtitle">
            {po.materialName} — PO {po.poNumber} for {po.site?.siteName}
          </p>
        </div>
      </div>

      <div className="pc-form-card">
        <div className="pc-note">
          {remaining} {po.unit} remaining out of {po.quantity} {po.unit}{" "}
          ordered. Recording this receipt will update the PO status and add
          stock to {po.site?.siteName}'s inventory automatically.
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pc-form-grid">
            <div className="pc-form-group">
              <label>GRN Number *</label>
              <input
                type="text"
                name="grnNumber"
                value={formData.grnNumber}
                onChange={handleChange}
                placeholder="e.g. GRN-2026-014"
                required
              />
            </div>

            <div className="pc-form-group">
              <label>Quantity Received *</label>
              <input
                type="number"
                name="quantityReceived"
                min="0"
                max={remaining}
                step="0.01"
                value={formData.quantityReceived}
                onChange={handleChange}
                required
              />
            </div>

            <div className="pc-form-group">
              <label>Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
              >
                {CONDITION_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="pc-form-group full-width">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any remarks about this delivery"
              />
            </div>
          </div>

          <div className="pc-form-actions">
            <button
              type="button"
              className="pc-cancel-btn"
              onClick={() => navigate(`/${role}/purchase-orders/view/${poId}`)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="pc-submit-btn"
              disabled={submitting}
            >
              {submitting ? "Recording..." : "Record Receipt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGRN;
