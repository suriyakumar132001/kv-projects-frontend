// ===============================================
// KV Projects ERP
// Create Material Issue
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PackageMinus, Save, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";

import materialIssueService from "../../services/materialIssueService";
import materialService from "../../services/materialService";

const CreateMaterialIssue = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState([]);

  const [formData, setFormData] = useState({
    material: "",
    quantity: "",
    issuedTo: "",
    issueDate: "",
    remarks: "",
  });

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const response = await materialService.getMaterials();

        const data = response?.materials || response?.data || [];

        setMaterials(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load materials:", error);

        toast.error("Failed to load materials list");
      }
    };

    loadMaterials();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      material: "",
      quantity: "",
      issuedTo: "",
      issueDate: "",
      remarks: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.material) {
      toast.error("Please select a material");
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (!formData.issuedTo.trim()) {
      toast.error("Please enter where this material is issued to");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        material: formData.material,
        quantity: Number(formData.quantity),
        issuedTo: formData.issuedTo.trim(),
        issueDate: formData.issueDate || undefined,
        remarks: formData.remarks.trim(),
      };

      await materialIssueService.createMaterialIssue(payload);

      toast.success("Material issued successfully");

      navigate("..");
    } catch (error) {
      console.error("Create material issue error:", error);

      toast.error(error?.response?.data?.message || "Failed to issue material");
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
            <h1 className="text-2xl font-bold text-gray-900">Issue Material</h1>

            <p className="text-sm text-gray-500 mt-1">
              Record materials issued from inventory.
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
                <PackageMinus size={21} className="text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Issue Information
                </h2>

                <p className="text-sm text-gray-500">
                  Enter the material issue details below.
                </p>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Material */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material *
              </label>

              <select
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Issued To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issued To (Site / Purpose) *
              </label>

              <input
                type="text"
                name="issuedTo"
                value={formData.issuedTo}
                onChange={handleChange}
                placeholder="Example: Site A - Foundation work"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Issue Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date
              </label>

              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Remarks */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>

              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="4"
                placeholder="Enter additional remarks..."
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

              {loading ? "Saving..." : "Issue Material"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateMaterialIssue;
