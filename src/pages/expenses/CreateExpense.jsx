// ===============================================
// KV Projects ERP
// Create Expense
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Receipt, Save, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";

import expenseService from "../../services/expenseService";
import projectService from "../../services/projectService";
import siteService from "../../services/siteService";

const categories = [
  "Material",
  "Labour",
  "Transport",
  "Machinery",
  "Food",
  "Fuel",
  "Electrical",
  "Miscellaneous",
];

const initialForm = {
  project: "",
  site: "",
  category: "Miscellaneous",
  amount: "",
  vendorName: "",
  billNumber: "",
  expenseDate: new Date().toISOString().split("T")[0],
  description: "",
};

export default function CreateExpense() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);

  const [projects, setProjects] = useState([]);

  const [sites, setSites] = useState([]);

  const [loading, setLoading] = useState(false);

  const [loadingProjects, setLoadingProjects] = useState(true);

  const [loadingSites, setLoadingSites] = useState(false);

  // =============================================
  // Load Projects
  // =============================================

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoadingProjects(true);

        const response = await projectService.getProjects();

        setProjects(response?.projects || []);
      } catch (error) {
        console.error("Projects Error:", error);

        toast.error(
          error?.response?.data?.message || "Unable to load projects",
        );
      } finally {
        setLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  // =============================================
  // Load Sites
  // =============================================

  useEffect(() => {
    const loadSites = async () => {
      try {
        setLoadingSites(true);

        const response = await siteService.getSites();

        setSites(response?.sites || []);
      } catch (error) {
        console.error("Sites Error:", error);

        toast.error(error?.response?.data?.message || "Unable to load sites");
      } finally {
        setLoadingSites(false);
      }
    };

    loadSites();
  }, []);

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
  // Reset
  // =============================================

  const handleReset = () => {
    setForm(initialForm);
  };

  // =============================================
  // Validation
  // =============================================

  const validateForm = () => {
    if (!form.project) {
      toast.error("Please select a project");
      return false;
    }

    if (!form.site) {
      toast.error("Please select a site");
      return false;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }

    if (!form.expenseDate) {
      toast.error("Please select expense date");
      return false;
    }

    return true;
  };

  // =============================================
  // Submit
  // =============================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        project: form.project,
        site: form.site,
        category: form.category,
        amount: Number(form.amount),
        vendorName: form.vendorName.trim(),
        billNumber: form.billNumber.trim(),
        description: form.description.trim(),
        expenseDate: form.expenseDate,
      };

      await expenseService.createExpense(payload);

      toast.success("Expense added successfully");

      navigate("../expenses");
    } catch (error) {
      console.error("Create Expense Error:", error);

      toast.error(error?.response?.data?.message || "Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // Helpers
  // =============================================

  const getProjectName = (project) => {
    return project?.projectName || project?.name || "Unnamed Project";
  };

  const getSiteName = (site) => {
    return site?.siteName || site?.name || "Unnamed Site";
  };

  // =============================================
  // UI
  // =============================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        {/* ===================================== */}
        {/* Header */}
        {/* ===================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("../expenses")}
              className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm transition hover:bg-gray-100"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>

              <p className="mt-1 text-sm text-gray-500">
                Record a new project expense
              </p>
            </div>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Receipt size={22} />
          </div>
        </div>

        {/* ===================================== */}
        {/* Form */}
        {/* ===================================== */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          {/* =================================== */}
          {/* Project Information */}
          {/* =================================== */}

          <div className="border-b border-gray-200 p-5 md:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Project Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Select where this expense belongs
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Project */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Project
                  <span className="text-red-500"> *</span>
                </label>

                <select
                  name="project"
                  value={form.project}
                  onChange={handleChange}
                  disabled={loadingProjects}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                >
                  <option value="">
                    {loadingProjects ? "Loading projects..." : "Select Project"}
                  </option>

                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {getProjectName(project)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Site */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Site
                  <span className="text-red-500"> *</span>
                </label>

                <select
                  name="site"
                  value={form.site}
                  onChange={handleChange}
                  disabled={loadingSites}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                >
                  <option value="">
                    {loadingSites ? "Loading sites..." : "Select Site"}
                  </option>

                  {sites.map((site) => (
                    <option key={site._id} value={site._id}>
                      {getSiteName(site)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* =================================== */}
          {/* Expense Information */}
          {/* =================================== */}

          <div className="border-b border-gray-200 p-5 md:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Expense Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter the expense amount and category
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Category */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Amount
                  <span className="text-red-500"> *</span>
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Date */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Expense Date
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="date"
                  name="expenseDate"
                  value={form.expenseDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* =================================== */}
          {/* Vendor Information */}
          {/* =================================== */}

          <div className="border-b border-gray-200 p-5 md:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Vendor & Bill Details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add vendor and billing information
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Vendor */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Vendor Name
                </label>

                <input
                  type="text"
                  name="vendorName"
                  value={form.vendorName}
                  onChange={handleChange}
                  placeholder="Enter vendor name"
                  maxLength={150}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Bill */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Bill Number
                </label>

                <input
                  type="text"
                  name="billNumber"
                  value={form.billNumber}
                  onChange={handleChange}
                  placeholder="Enter bill number"
                  maxLength={100}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          {/* =================================== */}
          {/* Description */}
          {/* =================================== */}

          <div className="p-5 md:p-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              maxLength={1000}
              placeholder="Add any additional details about this expense..."
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-1 text-right text-xs text-gray-400">
              {form.description.length}/1000
            </div>
          </div>

          {/* =================================== */}
          {/* Footer Actions */}
          {/* =================================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 p-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw size={17} />
              Reset
            </button>

            <button
              type="button"
              onClick={() => navigate("../expenses")}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {loading ? "Saving..." : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
