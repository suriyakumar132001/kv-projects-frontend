// ===============================================
// KV Projects ERP
// Labour Details
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Edit,
  Phone,
  Calendar,
  MapPin,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";

import labourService from "../../services/labourService";

const LabourDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [labour, setLabour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLabour = async () => {
      try {
        setLoading(true);

        const response = await labourService.getLabourById(id);

        const data =
          response?.labour ||
          response?.data?.labour ||
          response?.data ||
          response;

        setLabour(data || null);
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

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "-";
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
  // Not Found
  // ============================================

  if (!labour) {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <Users size={40} className="mx-auto text-gray-300" />

          <p className="mt-3 font-medium text-gray-700">
            Labour record not found
          </p>

          <button
            type="button"
            onClick={() => navigate("..")}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Back to Labour List
          </button>
        </div>
      </div>
    );
  }

  const status = labour?.status || "Active";

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
            <h1 className="text-2xl font-bold text-gray-900">Labour Details</h1>

            <p className="text-sm text-gray-500 mt-1">
              View labour record information.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`../edit/${id}`)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Edit size={18} />
          Edit Labour
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <Users size={26} className="text-blue-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {labour?.name || "Unnamed"}
              </h2>

              <p className="text-sm text-gray-500">{labour?.role || "-"}</p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === "Active"
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
              <Phone size={18} className="text-gray-500" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Contact Number</p>

              <p className="font-medium text-gray-900 mt-0.5">
                {labour?.contactNumber || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
              <Wallet size={18} className="text-gray-500" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Wage Type</p>

              <p className="font-medium text-gray-900 mt-0.5">
                {labour?.wageType || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
              <Wallet size={18} className="text-gray-500" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Wage Rate</p>

              <p className="font-medium text-gray-900 mt-0.5">
                {formatAmount(labour?.wageRate || 0)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
              <Calendar size={18} className="text-gray-500" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Joining Date</p>

              <p className="font-medium text-gray-900 mt-0.5">
                {formatDate(labour?.joiningDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 md:col-span-2">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-gray-500" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Address</p>

              <p className="font-medium text-gray-900 mt-0.5 whitespace-pre-wrap">
                {labour?.address || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabourDetails;
    