// ===============================================
// KV Projects ERP
// Add Vendor
// ===============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, Save, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";

import vendorService from "../../services/vendorService";
import "./Vendor.css";
import "./VendorForm.css";

const AddVendor = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    category: "",
    contactNumber: "",
    email: "",
    gstNumber: "",
    address: "",
    status: "Active",
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
      company: "",
      category: "",
      contactNumber: "",
      email: "",
      gstNumber: "",
      address: "",
      status: "Active",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter vendor name");
      return;
    }

    if (!formData.contactNumber.trim()) {
      toast.error("Please enter contact number");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        company: formData.company.trim(),
        category: formData.category,
        contactNumber: formData.contactNumber.trim(),
        email: formData.email.trim(),
        gstNumber: formData.gstNumber.trim(),
        address: formData.address.trim(),
        status: formData.status,
      };

      await vendorService.createVendor(payload);

      toast.success("Vendor added successfully");

      navigate("..");
    } catch (error) {
      console.error("Create vendor error:", error);

      toast.error(error?.response?.data?.message || "Failed to add vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-page">
      <div className="vendor-container p-6 space-y-6">
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
            <h1 className="text-2xl font-bold text-gray-900">Add Vendor</h1>

            <p className="text-sm text-gray-500 mt-1">
              Add a new vendor or supplier.
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
                <Truck size={21} className="text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Vendor Information
                </h2>

                <p className="text-sm text-gray-500">
                  Enter the vendor details below.
                </p>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Vendor Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter vendor name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
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

                <option value="Sand & Aggregate">Sand & Aggregate</option>

                <option value="Electrical">Electrical</option>

                <option value="Plumbing">Plumbing</option>

                <option value="Hardware">Hardware</option>

                <option value="Equipment Rental">Equipment Rental</option>

                <option value="Transport">Transport</option>

                <option value="Other">Other</option>
              </select>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>

              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter contact number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* GST Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST Number
              </label>

              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="Enter GST number"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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

              {loading ? "Saving..." : "Save Vendor"}
            </button>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
};

export default AddVendor;