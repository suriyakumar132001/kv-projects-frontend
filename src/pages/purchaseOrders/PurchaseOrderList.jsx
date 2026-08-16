import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import purchaseOrderService from "../../services/purchaseOrderService";

import "./PurchaseOrder.css";

const STATUS_FILTERS = [
  "All",
  "Ordered",
  "Partially Received",
  "Received",
  "Cancelled",
];

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const canCreate = role === "owner" || role === "admin";
  const canCancel = role === "owner" || role === "admin";
  const canReceive =
    role === "owner" || role === "admin" || role === "siteengineer";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    loadOrders(statusFilter);
  }, [statusFilter]);

  const loadOrders = async (status) => {
    try {
      setLoading(true);
      const res = await purchaseOrderService.getPurchaseOrders(
        status && status !== "All" ? { status } : {},
      );
      setOrders(res.purchaseOrders || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Cancel this Purchase Order?");
    if (!confirmCancel) return;

    try {
      await purchaseOrderService.cancelPurchaseOrder(id);
      toast.success("Purchase Order cancelled");
      loadOrders(statusFilter);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel PO");
    }
  };

  if (loading) return <h2 style={{ padding: 24 }}>Loading...</h2>;

  return (
    <div className="pc-page">
      <div className="pc-header">
        <div>
          <h2>Purchase Orders</h2>
          <p className="pc-header-subtitle">
            Track material on order and how much has been received
          </p>
        </div>

        <div className="pc-header-actions">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              className={`pc-filter-btn ${statusFilter === status ? "active" : ""}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}

          {canCreate && (
            <button
              className="pc-add-btn"
              onClick={() => navigate(`/${role}/purchase-orders/create`)}
            >
              New PO
            </button>
          )}
        </div>
      </div>

      <div className="pc-table-wrapper">
        <table className="pc-table">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>Site</th>
              <th>Material</th>
              <th>Ordered</th>
              <th>Received</th>
              <th>Vendor</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((po) => (
                <tr key={po._id}>
                  <td>{po.poNumber}</td>
                  <td>{po.site?.siteName || "-"}</td>
                  <td>{po.materialName}</td>
                  <td>
                    {po.quantity} {po.unit}
                  </td>
                  <td>
                    {po.receivedQuantity} {po.unit}
                  </td>
                  <td>{po.vendor?.vendorName || "-"}</td>
                  <td>
                    <span
                      className={`pc-status-pill ${po.status.replace(/\s/g, "")}`}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td>
                    <div className="pc-actions-cell">
                      <button
                        className="pc-btn pc-btn-view"
                        onClick={() =>
                          navigate(`/${role}/purchase-orders/view/${po._id}`)
                        }
                      >
                        View
                      </button>

                      {canReceive &&
                        (po.status === "Ordered" ||
                          po.status === "Partially Received") && (
                          <button
                            className="pc-btn pc-btn-receive"
                            onClick={() =>
                              navigate(
                                `/${role}/purchase-orders/${po._id}/receive`,
                              )
                            }
                          >
                            Receive
                          </button>
                        )}

                      {canCancel && po.status === "Ordered" && (
                        <button
                          className="pc-btn pc-btn-cancel"
                          onClick={() => handleCancel(po._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="pc-empty">
                  No purchase orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrderList;
