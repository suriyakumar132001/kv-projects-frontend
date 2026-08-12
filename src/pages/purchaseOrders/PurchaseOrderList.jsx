// ===============================================
// KV Projects ERP
// Purchase Order List
// ===============================================

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Edit, FileText, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

import purchaseOrderService from "../../services/purchaseOrderService";

const statusStyles = {
  Pending: "bg-yellow-50 text-yellow-700",
  Approved: "bg-blue-50 text-blue-700",
  Received: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

const PurchaseOrderList = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await purchaseOrderService.getPurchaseOrders();

      const data = response?.purchaseOrders || response?.data || [];

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch purchase orders:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load purchase orders",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return orders;

    return orders.filter((order) => {
      const poNumber = order?.poNumber || order?._id || "";

      const vendorName = order?.vendor?.name || order?.vendorName || "";

      return (
        String(poNumber).toLowerCase().includes(keyword) ||
        vendorName.toLowerCase().includes(keyword)
      );
    });
  }, [orders, search]);

  const totalValue = useMemo(
    () =>
      orders.reduce(
        (total, order) => total + Number(order?.totalAmount || 0),
        0,
      ),
    [orders],
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage purchase orders raised to vendors.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => navigate("create")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Create Purchase Order
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
              <FileText className="text-blue-600" size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Orders</p>

              <p className="text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Search Results</p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {filteredOrders.length}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Total Order Value</p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {formatAmount(totalValue)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="relative max-w-md">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search PO number or vendor..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  #
                </th>

                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  PO Number
                </th>

                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  Vendor
                </th>

                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  Order Date
                </th>

                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  Total Amount
                </th>

                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  Status
                </th>

                <th className="text-right px-5 py-4 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    Loading purchase orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <FileText size={40} className="mx-auto text-gray-300" />

                    <p className="mt-3 font-medium text-gray-700">
                      No purchase orders found
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Create a purchase order to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => {
                  const id = order?._id || order?.id;

                  const poNumber = order?.poNumber || id;

                  const vendorName =
                    order?.vendor?.name || order?.vendorName || "-";

                  const status = order?.status || "Pending";

                  return (
                    <tr
                      key={id || index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 text-gray-500">{index + 1}</td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">
                          {poNumber}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-600">{vendorName}</td>

                      <td className="px-5 py-4 text-gray-600">
                        {formatDate(order?.orderDate || order?.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {formatAmount(order?.totalAmount)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusStyles[status] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            title="View"
                            onClick={() => navigate(`view/${id}`)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            type="button"
                            title="Edit"
                            onClick={() => navigate(`create/${id}`)}
                            className="p-2 rounded-lg text-green-600 hover:bg-green-50"
                          >
                            <Edit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderList;
