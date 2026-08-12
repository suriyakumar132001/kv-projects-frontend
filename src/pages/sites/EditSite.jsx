// ===============================================
// KV Projects ERP
// Edit Site
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, RotateCcw, MapPin, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import siteService from "../../services/siteService";

const initialForm = {
  siteName: "",
  location: "",
  description: "",
  clientName: "",
  status: "Active",
};

export default function EditSite() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =============================================
  // Load Site
  // =============================================

  useEffect(() => {
    const loadSite = async () => {
      try {
        setLoading(true);

        const response = await siteService.getSite(id);

        const site = response?.site || response?.data || response;

        if (!site) {
          toast.error("Site not found");
          navigate("../sites");
          return;
        }

        setForm({
          siteName: site.siteName || "",
          location: site.location || "",
          description: site.description || "",
          clientName: site.clientName || "",
          status: site.status || "Active",
        });
      } catch (error) {
        console.error("Load Site Error:", error);

        toast.error(error?.response?.data?.message || "Failed to load site");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSite();
    }
  }, [id, navigate]);

  // =============================================
  // Handle Change
  // =============================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =============================================
  // Validation
  // =============================================

  const validateForm = () => {
    if (!form.siteName.trim()) {
      toast.error("Please enter site name");
      return false;
    }

    if (!form.location.trim()) {
      toast.error("Please enter site location");
      return false;
    }

    return true;
  };

  // =============================================
  // Update Site
  // =============================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        siteName: form.siteName.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        clientName: form.clientName.trim(),
        status: form.status,
      };

      await siteService.updateSite(id, payload);

      toast.success("Site updated successfully");

      navigate(`../sites/view/${id}`);
    } catch (error) {
      console.error("Update Site Error:", error);

      toast.error(error?.response?.data?.message || "Failed to update site");
    } finally {
      setSaving(false);
    }
  };

  // =============================================
  // Reset
  // =============================================

  const handleReset = () => {
    if (window.confirm("Reset all changes?")) {
      window.location.reload();
    }
  };

  // =============================================
  // Loading
  // =============================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 size={24} className="animate-spin" />

          <span className="text-sm font-medium">Loading site...</span>
        </div>
      </div>
    );
  }

  // =============================================
  // UI
  // =============================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        {/* =========================================
            Header
        ========================================= */}

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`../sites/view/${id}`)}
              className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm transition hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Site</h1>

              <p className="mt-1 text-sm text-gray-500">
                Update construction site information
              </p>
            </div>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <MapPin size={22} />
          </div>
        </div>

        {/* =========================================
            Form
        ========================================= */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          {/* Site Information */}

          <div className="border-b border-gray-200 p-5 md:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Site Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Update the basic site details
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Site Name */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Site Name
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="text"
                  name="siteName"
                  value={form.siteName}
                  onChange={handleChange}
                  placeholder="Enter site name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Location */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Location
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Enter site location"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Client */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Client Name
                </label>

                <input
                  type="text"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  placeholder="Enter client name"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Status */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Active">Active</option>

                  <option value="Inactive">Inactive</option>

                  <option value="Completed">Completed</option>

                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}

          <div className="p-5 md:p-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Enter site description..."
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Footer */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 p-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw size={17} />
              Reset
            </button>

            <button
              type="button"
              onClick={() => navigate(`../sites/view/${id}`)}
              disabled={saving}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}

              {saving ? "Updating..." : "Update Site"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
