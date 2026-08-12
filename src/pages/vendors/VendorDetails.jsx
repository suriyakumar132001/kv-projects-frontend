// ===============================================
// KV Projects ERP
// Vendor Details
// ===============================================
//
// NOTE: Field names (contactPerson, email, gstNumber, etc.) are
// assumed based on common vendor schemas. Adjust to match your
// actual vendorService/model if different.

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Edit,
  Phone,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";
import { toast } from "react-toastify";

import vendorService from "../../services/vendorService";
import "./Vendor.css";
import "./VendorDetails.css";

const VendorDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVendor = async () => {
      try {
        setLoading(true);

        const response = await vendorService.getVendorById(id);

        const data =
          response?.vendor ||
          response?.data?.vendor ||
          response?.data ||
          response;

        setVendor(data || null);
      } catch (error) {
        console.error("Failed to load vendor record:", error);

        toast.error(
          error?.response?.data?.message || "Failed to load vendor record",
        );

        navigate("..");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadVendor();
    }
  }, [id, navigate]);

  // ============================================
  // Loading Screen
  // ============================================

  if (loading) {
    return (
      <div className="vendor-page">
        <div className="vendor-container p-6">
          <p className="text-gray-500">Loading vendor record...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // Not Found
  // ============================================

  if (!vendor) {
    return (
      <div className="vendor-page">
        <div className="vendor-container p-6">
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <Building2 size={40} className="mx-auto text-gray-300" />

            <p className="mt-3 font-medium text-gray-700">
              Vendor record not found
            </p>

            <button
              type="button"
              onClick={() => navigate("..")}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft size={18} />
              Back to Vendor List
            </button>
          </div>
        </div>
      </div>
    );
  }

  const status = vendor?.status || "Active";

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
            <h1 className="text-2xl font-bold text-gray-900">Vendor Details</h1>

            <p className="text-sm text-gray-500 mt-1">
              View vendor record information.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`../edit/${id}`)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Edit size={18} />
          Edit Vendor
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <Building2 size={26} className="text-blue-600" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {vendor?.name || vendor?.companyName || "Unnamed Vendor"}
              </h2>

              <p className="text-sm text-gray-500">
                {vendor?.contactPerson || "-"}
              </p>
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
                {vendor?.contactNumber || vendor?.phone || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
              <Mail size={18} className="text-gray-500" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>

              <p className="font-medium text-gray-900 mt-0.5">
                {vendor?.email || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-gray-500" />
            </div>

            <div>
              <p className="text-sm text-gray-500">GST Number</p>

              <p className="font-medium text-gray-900 mt-0.5">
                {vendor?.gstNumber || "-"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-gray-500" />
            </div>

            <div>
              <p className="text-sm text-gray-500">Category</p>

              <p className="font-medium text-gray-900 mt-0.5">
                {vendor?.category || "-"}
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
                {vendor?.address || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default VendorDetails;
