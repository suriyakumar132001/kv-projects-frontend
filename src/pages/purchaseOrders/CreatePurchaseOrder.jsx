// ===============================================
// KV Projects ERP
// Create / Edit Purchase Order
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Plus, Trash2, Save } from "lucide-react";
import { toast } from "react-toastify";

import purchaseOrderService from "../../services/purchaseOrderService";
import vendorService from "../../services/vendorService";
import materialService from "../../services/materialService";

const emptyItem = () => ({
  material: "",
  quantity: "",
  unitPrice: "",
});

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  const [vendors, setVendors] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [formData, setFormData] = useState({
    vendorId: "",
    orderDate: "",
    expectedDeliveryDate: "",
    status: "Pending",
    notes: "",
  });

  const [items, setItems] = useState([emptyItem()]);

  // ============================================
  // Load Vendors + Materials for dropdowns
  // ============================================

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [vendorResponse, materialResponse] = await Promise.all([
          vendorService.getVendors(),
          materialService.getMaterials(),
        ]);

        const vendorData =
          vendorResponse?.vendors || vendorResponse?.data || [];

        const materialData =
          materialResponse?.materials || materialResponse?.data || [];

        setVendors(Array.isArray(vendorData) ? vendorData : []);
        setMaterials(Array.isArray(materialData) ? materialData : []);
      } catch (error) {
        console.error("Failed to load vendors/materials:", error);

        toast.error("Failed to load vendors or materials list");
      }
    };

    loadDropdownData();
  }, []);

  // ============================================
  // Load Purchase Order (edit mode)
  // ============================================

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);

        const response = await purchaseOrderService.getPurchaseOrderById(id);

        const order =
          response?.purchaseOrder ||
          response?.data?.purchaseOrder ||
          response?.data ||
          response;

        setFormData({
          vendorId: order?.vendor?._id || order?.vendorId || "",

          orderDate: order?.orderDate
            ? String(order.orderDate).slice(0, 10)
            : "",

          expectedDeliveryDate: order?.expectedDeliveryDate
            ? String(order.expectedDeliveryDate).slice(0, 10)
            : "",

          status: order?.status || "Pending",

          notes: order?.notes || "",
        });

        const loadedItems =
          Array.isArray(order?.items) && order.items.length
            ? order.items.map((item) => ({
                material:
                  item?.material?._id ||
                  item?.materialId ||
                  item?.materialName ||
                  "",
                quantity: item?.quantity ?? "",
                unitPrice: item?.unitPrice ?? "",
              }))
            : [emptyItem()];

        setItems(loadedItems);
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

    if (isEditMode) {
      loadOrder();
    }
  }, [id, isEditMode, navigate]);

  // ============================================
  // Handlers
  // ============================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const addItemRow = () => {
    setItems((prev) => [...prev, emptyItem()]);
  };

  const removeItemRow = (index) => {
    setItems((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index),
    );
  };

  const calculateTotal = () =>
    items.reduce(
      (total, item) =>
        total + Number(item.quantity || 0) * Number(item.unitPrice || 0),
      0,
    );

  const formatAmount = (amount) => {
    const value = Number(amount || 0);

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vendorId) {
      toast.error("Please select a vendor");
      return;
    }

    const validItems = items.filter(
      (item) => item.material && Number(item.quantity) > 0,
    );

    if (validItems.length === 0) {
      toast.error("Please add at least one valid item");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        vendorId: formData.vendorId,
        orderDate: formData.orderDate || undefined,
        expectedDeliveryDate: formData.expectedDeliveryDate || undefined,
        status: formData.status,
        notes: formData.notes.trim(),
        items: validItems.map((item) => ({
          material: item.material,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice || 0),
        })),
        totalAmount: calculateTotal(),
      };

      if (isEditMode) {
        await purchaseOrderService.updatePurchaseOrder(id, payload);
        toast.success("Purchase order updated successfully");
      } else {
        await purchaseOrderService.createPurchaseOrder(payload);
        toast.success("Purchase order created successfully");
      }

      navigate("..");
    } catch (error) {
      console.error("Save purchase order error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to save purchase order",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading purchase order...</p>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Purchase Order" : "Create Purchase Order"}
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {isEditMode
                ? "Update purchase order details."
                : "Raise a new purchase order to a vendor."}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Order Details */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText size={21} className="text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Order Information
                </h2>

                <p className="text-sm text-gray-500">
                  Vendor and order details.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Vendor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor *
              </label>

              <select
                name="vendorId"
                value={formData.vendorId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select vendor</option>

                {vendors.map((vendor) => (
                  <option
                    key={vendor._id || vendor.id}
                    value={vendor._id || vendor.id}
                  >
                    {vendor.name || vendor.vendorName}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>

                <option value="Approved">Approved</option>

                <option value="Received">Received</option>

                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Order Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Date
              </label>

              <input
                type="date"
                name="orderDate"
                value={formData.orderDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Expected Delivery Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Delivery Date
              </label>

              <input
                type="date"
                name="expectedDeliveryDate"
                value={formData.expectedDeliveryDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                placeholder="Enter any additional notes..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Order Items</h2>

              <p className="text-sm text-gray-500">
                Add the materials being ordered.
              </p>
            </div>

            <button
              type="button"
              onClick={addItemRow}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>

          <div className="p-6 space-y-4">
            {items.map((item, index) => {
              const lineTotal =
                Number(item.quantity || 0) * Number(item.unitPrice || 0);

              return (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="md:col-span-5">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Material
                    </label>

                    <select
                      value={item.material}
                      onChange={(e) =>
                        handleItemChange(index, "material", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Select material</option>

                      {materials.map((material) => (
                        <option
                          key={material._id || material.id}
                          value={material._id || material.id}
                        >
                          {material.name || material.materialName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Quantity
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Unit Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(index, "unitPrice", e.target.value)
                      }
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Line Total
                    </label>

                    <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm font-medium text-gray-900">
                      {formatAmount(lineTotal)}
                    </div>
                  </div>

                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeItemRow(index)}
                      disabled={items.length === 1}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-500">Order Total</p>

              <p className="text-xl font-bold text-gray-900">
                {formatAmount(calculateTotal())}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("..")}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : isEditMode
                ? "Update Purchase Order"
                : "Create Purchase Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePurchaseOrder;
