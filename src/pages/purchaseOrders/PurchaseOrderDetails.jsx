import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import purchaseOrderService from "../../services/purchaseOrderService";

import "./PurchaseOrder.css";

const PurchaseOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const canReceive =
    role === "owner" || role === "admin" || role === "siteengineer";
  const canCancel = role === "owner" || role === "admin";

  const [po, setPo] = useState(null);
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await purchaseOrderService.getPurchaseOrderById(id);
      setPo(res.purchaseOrder);
      setGrns(res.grns || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load purchase order");
      navigate(`/${role}/purchase-orders`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    const confirmCancel = window.confirm("Cancel this Purchase Order?");
    if (!confirmCancel) return;

    try {
      await purchaseOrderService.cancelPurchaseOrder(id);
      toast.success("Purchase Order cancelled");
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel PO");
    }
  };

  if (loading) return <h2 style={{ padding: 24 }}>Loading...</h2>;
  if (!po) return null;

  const remaining = po.quantity - po.receivedQuantity;
  const percentReceived = Math.min(
    100,
    Math.round((po.receivedQuantity / po.quantity) * 100),
  );

  return (
    <div className="pc-page">
      <div className="pc-header">
        <div>
          <h2>Purchase Order — {po.poNumber}</h2>
          <p className="pc-header-subtitle">
            {po.materialName} for {po.site?.siteName} — from{" "}
            {po.vendor?.vendorName}
          </p>
        </div>

        <div className="pc-header-actions">
          {canReceive &&
            (po.status === "Ordered" || po.status === "Partially Received") && (
              <button
                className="pc-add-btn"
                onClick={() =>
                  navigate(`/${role}/purchase-orders/${po._id}/receive`)
                }
              >
                Record Receipt
              </button>
            )}

          {canCancel && po.status === "Ordered" && (
            <button className="pc-btn pc-btn-cancel" onClick={handleCancel}>
              Cancel PO
            </button>
          )}
        </div>
      </div>

      <div className="pc-stats-row">
        <div className="pc-stat-card">
          <div className="pc-stat-label">Status</div>
          <div className="pc-stat-value">
            <span className={`pc-status-pill ${po.status.replace(/\s/g, "")}`}>
              {po.status}
            </span>
          </div>
        </div>

        <div className="pc-stat-card">
          <div className="pc-stat-label">Ordered Quantity</div>
          <div className="pc-stat-value">
            {po.quantity} {po.unit}
          </div>
        </div>

        <div className="pc-stat-card">
          <div className="pc-stat-label">Received So Far</div>
          <div className="pc-stat-value">
            {po.receivedQuantity} {po.unit}
          </div>
        </div>

        <div className="pc-stat-card">
          <div className="pc-stat-label">Remaining</div>
          <div className="pc-stat-value">
            {remaining} {po.unit}
          </div>
        </div>
      </div>

      <div
        className="pc-form-card"
        style={{ maxWidth: "100%", marginBottom: 24 }}
      >
        <div className="pc-form-group full-width">
          <label>Receipt Progress ({percentReceived}%)</label>
          <div className="pc-progress-track">
            <div
              className="pc-progress-fill"
              style={{ width: `${percentReceived}%` }}
            />
          </div>
        </div>

        <div className="pc-form-grid" style={{ marginTop: 20 }}>
          <div className="pc-form-group">
            <label>Unit Price</label>
            <div>₹{Number(po.unitPrice).toLocaleString("en-IN")}</div>
          </div>

          <div className="pc-form-group">
            <label>Total Amount</label>
            <div style={{ fontWeight: 700 }}>
              ₹{Number(po.totalAmount).toLocaleString("en-IN")}
            </div>
          </div>

          <div className="pc-form-group">
            <label>Expected Delivery</label>
            <div>
              {po.expectedDelivery
                ? new Date(po.expectedDelivery).toLocaleDateString()
                : "-"}
            </div>
          </div>

          <div className="pc-form-group">
            <label>Raised By</label>
            <div>{po.createdBy?.name || "-"}</div>
          </div>

          {po.materialRequest && (
            <div className="pc-form-group full-width">
              <label>Linked Material Request</label>
              <div>{po.materialRequest.materialName}</div>
            </div>
          )}
        </div>
      </div>

      <h3 style={{ marginBottom: 12 }}>Goods Receipts</h3>

      <div className="pc-table-wrapper">
        <table className="pc-table">
          <thead>
            <tr>
              <th>GRN Number</th>
              <th>Date</th>
              <th>Quantity Received</th>
              <th>Condition</th>
              <th>Received By</th>
              <th>Notes</th>
            </tr>
          </thead>

          <tbody>
            {grns.length > 0 ? (
              grns.map((grn) => (
                <tr key={grn._id}>
                  <td>{grn.grnNumber}</td>
                  <td>{new Date(grn.receivedDate).toLocaleDateString()}</td>
                  <td>
                    {grn.quantityReceived} {grn.unit}
                  </td>
                  <td>
                    <span
                      className={`pc-condition-pill ${grn.condition.replace(/\s/g, "")}`}
                    >
                      {grn.condition}
                    </span>
                  </td>
                  <td>{grn.receivedBy?.name || "-"}</td>
                  <td>{grn.notes || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="pc-empty">
                  No goods received against this PO yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrderDetails;
