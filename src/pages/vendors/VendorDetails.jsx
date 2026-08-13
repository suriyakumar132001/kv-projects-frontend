// ===============================================
// KV Projects ERP
// Vendor Details
// ===============================================

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

  if (loading) {
    return (
      <div className="vendor-page">
        <p style={{ color: "#6b7280" }}>Loading vendor record...</p>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="vendor-page">
        <div className="empty-state-card">
          <Building2 size={40} />
          <p>Vendor record not found</p>
          <button
            type="button"
            onClick={() => navigate("..")}
            className="btn btn-outline"
            style={{ marginTop: "16px" }}
          >
            <ArrowLeft size={18} />
            Back to Vendor List
          </button>
        </div>
      </div>
    );
  }

  const status = vendor?.status || "Active";

  return (
    <div className="vendor-page">
      <div className="vendor-header">
        <div
          className="vendor-header-left"
          style={{ display: "flex", alignItems: "center", gap: "14px" }}
        >
          <button
            type="button"
            onClick={() => navigate("..")}
            className="btn-icon view"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1>Vendor Details</h1>
            <p>View vendor record information.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`../edit/${id}`)}
          className="btn btn-primary"
        >
          <Edit size={18} />
          Edit Vendor
        </button>
      </div>

      <div className="vendor-details-card">
        <div className="details-profile-header">
          <div className="details-profile-left">
            <div className="details-avatar">
              <Building2 size={26} />
            </div>
            <div>
              <h2>{vendor?.name || vendor?.companyName || "Unnamed Vendor"}</h2>
              <p>{vendor?.contactPerson || "-"}</p>
            </div>
          </div>

          <span
            className={`status-pill ${status === "Active" ? "active" : "inactive"}`}
          >
            {status}
          </span>
        </div>

        <div className="details-grid">
          <div className="details-item">
            <div className="details-icon">
              <Phone size={18} />
            </div>
            <div>
              <label>Contact Number</label>
              <p>{vendor?.contactNumber || vendor?.phone || "-"}</p>
            </div>
          </div>

          <div className="details-item">
            <div className="details-icon">
              <Mail size={18} />
            </div>
            <div>
              <label>Email</label>
              <p>{vendor?.email || "-"}</p>
            </div>
          </div>

          <div className="details-item">
            <div className="details-icon">
              <FileText size={18} />
            </div>
            <div>
              <label>GST Number</label>
              <p>{vendor?.gstNumber || "-"}</p>
            </div>
          </div>

          <div className="details-item">
            <div className="details-icon">
              <Building2 size={18} />
            </div>
            <div>
              <label>Category</label>
              <p>{vendor?.category || "-"}</p>
            </div>
          </div>

          <div className="details-item full-width">
            <div className="details-icon">
              <MapPin size={18} />
            </div>
            <div>
              <label>Address</label>
              <p>{vendor?.address || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
