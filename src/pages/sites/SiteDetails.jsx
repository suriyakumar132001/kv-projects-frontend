// ===============================================
// KV Projects ERP
// Site Details
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  User,
  Building2,
  CalendarDays,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

import siteService from "../../services/siteService";

export default function SiteDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // =============================================
  // Load Site
  // =============================================

  const loadSite = async () => {
    try {
      setLoading(true);

      const response = await siteService.getSite(id);

      const siteData =
        response?.site ||
        response?.data ||
        response;

      if (!siteData) {
        toast.error("Site not found");
        return;
      }

      setSite(siteData);
    } catch (error) {
      console.error("Get Site Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load site"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadSite();
    }
  }, [id]);

  // =============================================
  // Delete Site
  // =============================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this site?\n\nThis action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await siteService.deleteSite(id);

      toast.success("Site deleted successfully");

      navigate("../sites");
    } catch (error) {
      console.error("Delete Site Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete site"
      );
    } finally {
      setDeleting(false);
    }
  };

  // =============================================
  // Format Date
  // =============================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =============================================
  // Status Style
  // =============================================

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "on hold":
        return "bg-yellow-100 text-yellow-700";

      case "inactive":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =============================================
  // Loading
  // =============================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2
            size={24}
            className="animate-spin"
          />

          <span className="text-sm font-medium">
            Loading site...
          </span>
        </div>
      </div>
    );
  }

  // =============================================
  // Not Found
  // =============================================

  if (!site) {
    return (
      <div className="min-h-[60vh] p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">

          <MapPin
            size={42}
            className="mx-auto mb-4 text-gray-400"
          />

          <h2 className="text-xl font-semibold text-gray-900">
            Site Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            The requested site could not be found.
          </p>

          <button
            type="button"
            onClick={() => navigate("../sites")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Sites
          </button>
        </div>
      </div>
    );
  }

  // =============================================
  // Extract Values
  // =============================================

  const engineer =
    site.siteEngineer ||
    site.engineer ||
    site.assignedEngineer;

  const engineerName =
    typeof engineer === "object"
      ? engineer?.name
      : engineer;

  // =============================================
  // UI
  // =============================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      <div className="mx-auto max-w-6xl">

        {/* =======================================
            Header
        ======================================= */}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => navigate("../sites")}
              className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm transition hover:bg-gray-100"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <div className="flex items-center gap-3">

                <h1 className="text-2xl font-bold text-gray-900">
                  {site.siteName || "Site Details"}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                    site.status
                  )}`}
                >
                  {site.status || "Unknown"}
                </span>

              </div>

              <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin size={15} />

                {site.location || "Location not available"}
              </p>
            </div>
          </div>

          {/* Actions */}

          <div className="flex gap-2">

            <button
              type="button"
              onClick={loadSite}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
            >
              <RefreshCw
                size={17}
                className={
                  loading ? "animate-spin" : ""
                }
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(`../sites/edit/${id}`)
              }
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Edit size={17} />

              Edit Site
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleting ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Trash2 size={17} />
              )}

              Delete
            </button>
          </div>
        </div>

        {/* =======================================
            Main Grid
        ======================================= */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* =====================================
              Site Information
          ===================================== */}

          <div className="lg:col-span-2">

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

              <div className="border-b border-gray-200 p-5">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Building2 size={21} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Site Information
                    </h2>

                    <p className="text-xs text-gray-500">
                      Basic construction site details
                    </p>
                  </div>

                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">

                {/* Site Name */}

                <InfoItem
                  icon={<Building2 size={18} />}
                  label="Site Name"
                  value={site.siteName}
                />

                {/* Location */}

                <InfoItem
                  icon={<MapPin size={18} />}
                  label="Location"
                  value={site.location}
                />

                {/* Client */}

                <InfoItem
                  icon={<User size={18} />}
                  label="Client Name"
                  value={site.clientName}
                />

                {/* Engineer */}

                <InfoItem
                  icon={<User size={18} />}
                  label="Site Engineer"
                  value={engineerName}
                />

                {/* Created */}

                <InfoItem
                  icon={<CalendarDays size={18} />}
                  label="Created On"
                  value={formatDate(site.createdAt)}
                />

                {/* Updated */}

                <InfoItem
                  icon={<CalendarDays size={18} />}
                  label="Last Updated"
                  value={formatDate(site.updatedAt)}
                />
              </div>
            </div>

            {/* ===================================
                Description
            =================================== */}

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm">

              <div className="border-b border-gray-200 p-5">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <FileText size={21} />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Description
                    </h2>

                    <p className="text-xs text-gray-500">
                      Additional site information
                    </p>
                  </div>

                </div>
              </div>

              <div className="p-5">

                {site.description ? (
                  <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">
                    {site.description}
                  </p>
                ) : (
                  <p className="text-sm italic text-gray-400">
                    No description has been added.
                  </p>
                )}

              </div>
            </div>
          </div>

          {/* =====================================
              Summary
          ===================================== */}

          <div className="space-y-6">

            {/* Status Card */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <p className="text-sm font-medium text-gray-500">
                Site Status
              </p>

              <div className="mt-4 flex items-center justify-between">

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                    site.status
                  )}`}
                >
                  {site.status || "Unknown"}
                </span>

                <MapPin
                  size={28}
                  className="text-gray-300"
                />

              </div>
            </div>

            {/* Client Card */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <User size={21} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Client
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {site.clientName || "Not assigned"}
                  </p>
                </div>

              </div>
            </div>

            {/* Engineer Card */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <User size={21} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Site Engineer
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {engineerName || "Not assigned"}
                  </p>
                </div>

              </div>
            </div>

            {/* Location Card */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <MapPin size={21} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Site Location
                  </p>

                  <p className="mt-1 text-sm font-semibold leading-6 text-gray-900">
                    {site.location || "Not available"}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* =======================================
            Bottom Navigation
        ======================================= */}

        <div className="mt-6 flex justify-start">

          <button
            type="button"
            onClick={() => navigate("../sites")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
          >
            <ArrowLeft size={17} />

            Back to Sites
          </button>

        </div>
      </div>
    </div>
  );
}

// ===============================================
// Reusable Info Item
// ===============================================

function InfoItem({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">

      <div className="flex items-center gap-2 text-gray-400">
        {icon}

        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-2 break-words text-sm font-semibold text-gray-900">
        {value || "Not available"}
      </p>
    </div>
  );
}