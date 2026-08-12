// ===============================================
// KV Projects ERP
// Purchase Order Details
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, FileText } from "lucide-react";
import { toast } from "react-toastify";

import purchaseOrderService from "../../services/purchaseOrderService";

const statusStyles = {
  Pending: "bg-yellow-50 text-yellow-700",
  Approved: "bg-blue-50 text-blue-700",
  Received: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

const PurchaseOrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);

        const response = await purchaseOrderService.getPurchaseOrderById(id);

        const data =
          response?.purchaseOrder ||
          response?.data?.purchaseOrder ||
          response?.data ||
          response;

        setOrder(data || null);
      } catch (error) {
        console.error("Failed to load purchase order:", error);

        toast.error(
          error?.response?.data?.message || "Failed to load purchase order",
        );

        navigate("..");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadOrder();
    }
  }, [id, navigate]);

  const formatAmount = (amount) => {
    const value = Number(amount || 0);

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading purchase order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Purchase order not found.</p>
      </div>
    );
  }

  const poNumber = order?.poNumber || order?._id;
  const vendorName = order?.vendor?.name || order?.vendorName || "-";
  const status = order?.status || "Pending";
  const items = Array.isArray(order?.items) ? order.items : [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("..")}
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">PO {poNumber}</h1>

            <p className="text-sm text-gray-500 mt-1">Purchase order details</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`../create/${id}`)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Edit size={18} />
          Edit Order
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileText size={21} className="text-blue-600" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900">Order Information</h2>

              <p className="text-sm text-gray-500">Vendor and order summary.</p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Vendor</p>
            <p className="font-medium text-gray-900">{vendorName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <span
              className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                statusStyles[status] || "bg-gray-100 text-gray-600"
              }`}
            >
              {status}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Order Date</p>
            <p className="font-medium text-gray-900">
              {formatDate(order?.orderDate || order?.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Expected Delivery Date</p>
            <p className="font-medium text-gray-900">
              {formatDate(order?.expectedDeliveryDate)}
            </p>
          </div>

          {order?.notes && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Notes</p>
              <p className="font-medium text-gray-900 whitespace-pre-wrap">
                {order.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Order Items</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">
                  Material
                </th>

                <th className="text-left px-5 py-3 font-semibold text-gray-600">
                  Quantity
                </th>

                <th className="text-left px-5 py-3 font-semibold text-gray-600">
                  Unit Price
                </th>

                <th className="text-left px-5 py-3 font-semibold text-gray-600">
                  Line Total
                </th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    No items in this order.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => {
                  const lineTotal =
                    Number(item?.quantity || 0) * Number(item?.unitPrice || 0);

                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-100 last:border-b-0"
                    >
                      <td className="px-5 py-3 text-gray-900">
                        {item?.material?.name || item?.materialName || "-"}
                      </td>

                      <td className="px-5 py-3 text-gray-700">
                        {item?.quantity ?? 0}
                      </td>

                      <td className="px-5 py-3 text-gray-700">
                        {formatAmount(item?.unitPrice)}
                      </td>

                      <td className="px-5 py-3 font-medium text-gray-900">
                        {formatAmount(lineTotal)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <div className="text-right">
            <p className="text-sm text-gray-500">Order Total</p>

            <p className="text-xl font-bold text-gray-900">
              {formatAmount(order?.totalAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderDetails;
