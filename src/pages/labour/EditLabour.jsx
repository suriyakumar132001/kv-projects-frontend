// ===============================================
// KV Projects ERP
// Edit Labour
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users, Save } from "lucide-react";
import { toast } from "react-toastify";

import labourService from "../../services/labourService";

const EditLabour = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    contactNumber: "",
    wageType: "",
    wageRate: "",
    joiningDate: "",
    address: "",
    status: "Active",
  });

  // ============================================
  // Load Labour
  // ============================================

  useEffect(() => {
    const loadLabour = async () => {
      try {
        setLoading(true);

        const response = await labourService.getLabourById(id);

        const labour =
          response?.labour ||
          response?.data?.labour ||
          response?.data ||
          response;

        setFormData({
          name: labour?.name || "",

          role: labour?.role || "",

          contactNumber: labour?.contactNumber || "",

          wageType: labour?.wageType || "",

          wageRate: labour?.wageRate ?? "",

          joiningDate: labour?.joiningDate
            ? String(labour.joiningDate).slice(0, 10)
            : "",

          address: labour?.address || "",

          status: labour?.status || "Active",
        });
      } catch (error) {
        console.error("Failed to load labour record:", error);

        toast.error(
          error?.response?.data?.message || "Failed to load labour record",
        );

        navigate("..");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadLabour();
    }
  }, [id, navigate]);

  // ============================================
  // Handle Change
  // ============================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================
  // Submit
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter labour name");
      return;
    }

    if (!formData.role) {
      toast.error("Please select role");
      return;
    }

    if (!formData.wageType) {
      toast.error("Please select wage type");
      return;
    }

    if (formData.wageRate === "" || Number(formData.wageRate) < 0) {
      toast.error("Please enter a valid wage rate");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: formData.name.trim(),
        role: formData.role,
        contactNumber: formData.contactNumber.trim(),
        wageType: formData.wageType,
        wageRate: Number(formData.wageRate),
        joiningDate: formData.joiningDate || undefined,
        address: formData.address.trim(),
        status: formData.status,
      };

      await labourService.updateLabour(id, payload);

      toast.success("Labour updated successfully");

      navigate("..");
    } catch (error) {
      console.error("Update labour error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to update labour",
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // Loading Screen
  // ============================================

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading labour record...</p>
      </div>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("..")}
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
            disabled={saving}
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Labour</h1>

            <p className="text-sm text-gray-500 mt-1">
              Update labour information.
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
                <Users size={21} className="text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Labour Information
                </h2>

                <p className="text-sm text-gray-500">
                  Update the labour details below.
                </p>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Labour Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              >
                <option value="">Select role</option>

                <option value="Mason">Mason</option>

                <option value="Helper">Helper</option>

                <option value="Carpenter">Carpenter</option>

                <option value="Electrician">Electrician</option>

                <option value="Plumber">Plumber</option>

                <option value="Painter">Painter</option>

                <option value="Steel Fixer">Steel Fixer</option>

                <option value="Supervisor">Supervisor</option>

                <option value="Other">Other</option>
              </select>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>

              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter contact number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>

            {/* Wage Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wage Type *
              </label>

              <select
                name="wageType"
                value={formData.wageType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              >
                <option value="">Select wage type</option>

                <option value="Daily">Daily</option>

                <option value="Monthly">Monthly</option>

                <option value="Piece Rate">Piece Rate</option>
              </select>
            </div>

            {/* Wage Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wage Rate (₹) *
              </label>

              <input
                type="number"
                name="wageRate"
                min="0"
                step="0.01"
                value={formData.wageRate}
                onChange={handleChange}
                placeholder="₹ 0.00"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Joining Date
              </label>

              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
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
                disabled={saving}
              >
                <option value="Active">Active</option>

                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                placeholder="Enter address..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none resize-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
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

              {saving ? "Updating..." : "Update Labour"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditLabour;