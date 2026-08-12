// ===============================================
// KV Projects ERP
// Add Material
// ===============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Save, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";

import materialService from "../../services/materialService";

const AddMaterial = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    unitPrice: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      quantity: "",
      unit: "",
      unitPrice: "",
      description: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter material name");
      return;
    }

    if (!formData.quantity) {
      toast.error("Please enter quantity");
      return;
    }

    if (!formData.unit) {
      toast.error("Please select a unit");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        unitPrice: Number(formData.unitPrice || 0),
        description: formData.description.trim(),
      };

      await materialService.createMaterial(payload);

      toast.success("Material added successfully");

      navigate("..");
    } catch (error) {
      console.error("Create material error:", error);

      toast.error(error?.response?.data?.message || "Failed to add material");
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Add Material</h1>

            <p className="text-sm text-gray-500 mt-1">
              Add a new construction material.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Form Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Package size={21} className="text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Material Information
                </h2>

                <p className="text-sm text-gray-500">
                  Enter the material details below.
                </p>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Material Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Cement"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category</option>

                <option value="Cement">Cement</option>

                <option value="Steel">Steel</option>

                <option value="Sand">Sand</option>

                <option value="Aggregate">Aggregate</option>

                <option value="Bricks">Bricks</option>

                <option value="Electrical">Electrical</option>

                <option value="Plumbing">Plumbing</option>

                <option value="Hardware">Hardware</option>

                <option value="Other">Other</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>

              <input
                type="number"
                name="quantity"
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>

              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select unit</option>

                <option value="Nos">Nos</option>

                <option value="Kg">Kg</option>

                <option value="Ton">Ton</option>

                <option value="Bag">Bag</option>

                <option value="Cubic Feet">Cubic Feet</option>

                <option value="Cubic Meter">Cubic Meter</option>

                <option value="Meter">Meter</option>

                <option value="Litre">Litre</option>

                <option value="Box">Box</option>
              </select>
            </div>

            {/* Unit Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price
              </label>

              <input
                type="number"
                name="unitPrice"
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={handleChange}
                placeholder="₹ 0.00"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Total */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Total
              </label>

              <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 font-semibold">
                ₹{" "}
                {(
                  Number(formData.quantity || 0) *
                  Number(formData.unitPrice || 0)
                ).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter additional information..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RotateCcw size={18} />
              Reset
            </button>

            <button
              type="button"
              onClick={() => navigate("..")}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={18} />

              {loading ? "Saving..." : "Save Material"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddMaterial;
