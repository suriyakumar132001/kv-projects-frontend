// ===============================================
// KV Projects ERP
// Material Details
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Package } from "lucide-react";
import { toast } from "react-toastify";

import materialService from "../../services/materialService";

const MaterialDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMaterial = async () => {
      try {
        setLoading(true);

        const response = await materialService.getMaterialById(id);

        const data =
          response?.material ||
          response?.data?.material ||
          response?.data ||
          response;

        setMaterial(data || null);
      } catch (error) {
        console.error("Failed to load material:", error);

        toast.error(
          error?.response?.data?.message || "Failed to load material",
        );

        navigate("..");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMaterial();
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

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading material...</p>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Material not found.</p>
      </div>
    );
  }

  const name = material?.name || material?.materialName || "Unnamed Material";
  const quantity = material?.quantity ?? 0;
  const unit = material?.unit || "-";
  const unitPrice = material?.unitPrice ?? material?.price ?? 0;
  const total = Number(quantity) * Number(unitPrice);

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
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>

            <p className="text-sm text-gray-500 mt-1">Material details</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`../edit/${id}`)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          <Edit size={18} />
          Edit Material
        </button>
      </div>

      {/* Details Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
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
                Full details of this material.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Category</p>
            <p className="font-medium text-gray-900">
              {material?.category || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Supplier</p>
            <p className="font-medium text-gray-900">
              {material?.supplier || material?.supplierName || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Quantity</p>
            <p className="font-medium text-gray-900">
              {quantity} {unit}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Unit Price</p>
            <p className="font-medium text-gray-900">
              {formatAmount(unitPrice)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Estimated Total Value</p>
            <p className="font-semibold text-gray-900">{formatAmount(total)}</p>
          </div>

          {material?.description && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="font-medium text-gray-900 whitespace-pre-wrap">
                {material.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialDetails;
