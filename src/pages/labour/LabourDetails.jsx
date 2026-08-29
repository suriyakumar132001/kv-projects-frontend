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
import "./Labour.css";

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
      <div className="labour-page">
        <p style={{ color: "#6b7280" }}>Loading labour record...</p>
      </div>
    );
  }

  // ============================================
  // Not Found
  // ============================================

  if (!labour) {
    return (
      <div className="labour-page">
        <div className="empty-state-card">
          <Users size={40} style={{ margin: "0 auto" }} />

          <p>Labour record not found</p>

          <button
            type="button"
            onClick={() => navigate("..")}
            className="btn btn-outline"
            style={{ marginTop: "16px" }}
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
    <div className="labour-page">
      {/* Header */}
      <div className="labour-header">
        <div
          className="labour-header-left"
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
            <h1>Labour Details</h1>
            <p>View labour record information.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`../edit/${id}`)}
          className="btn btn-primary"
        >
          <Edit size={18} />
          Edit Labour
        </button>
      </div>

      {/* Profile Card */}
      <div className="labour-details-card">
        <div className="details-profile-header">
          <div className="details-profile-left">
            <div className="details-avatar">
              <Users size={26} />
            </div>

            <div>
              <h2>{labour?.name || "Unnamed"}</h2>
              <p>{labour?.role || "-"}</p>
            </div>
          </div>

          <span
            className={`status-pill ${status === "Active" ? "active" : "inactive"}`}
          >
            {status}
          </span>
        </div>

        {/* Details Grid */}
        <div className="details-grid">
          <div className="details-item">
            <div className="details-icon">
              <Phone size={18} />
            </div>

            <div>
              <label>Contact Number</label>
              <p>{labour?.contactNumber || "-"}</p>
            </div>
          </div>

          <div className="details-item">
            <div className="details-icon">
              <Wallet size={18} />
            </div>

            <div>
              <label>Wage Type</label>
              <p>{labour?.wageType || "-"}</p>
            </div>
          </div>

          <div className="details-item">
            <div className="details-icon">
              <Wallet size={18} />
            </div>

            <div>
              <label>Wage Rate</label>
              <p>{formatAmount(labour?.wageRate || 0)}</p>
            </div>
          </div>

          <div className="details-item">
            <div className="details-icon">
              <Calendar size={18} />
            </div>

            <div>
              <label>Joining Date</label>
              <p>{formatDate(labour?.joiningDate)}</p>
            </div>
          </div>

          <div className="details-item full-width">
            <div className="details-icon">
              <MapPin size={18} />
            </div>

            <div>
              <label>Address</label>
              <p>{labour?.address || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabourDetails;
