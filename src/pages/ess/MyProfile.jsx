import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import essService from "../../services/essService";

import "./Ess.css";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notLinked, setNotLinked] = useState(false);

  const [summary, setSummary] = useState(null);

  const [form, setForm] = useState({
    phone: "",
    address: "",
    emergencyContact: "",
  });

  useEffect(() => {
    loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const res = await essService.getMySummary();
      setSummary(res.summary);
      setForm({
        phone: res.summary?.employee?.phone || "",
        address: res.summary?.employee?.address || "",
        emergencyContact: res.summary?.employee?.emergencyContact || "",
      });
    } catch (error) {
      // A 404 here means no Employee record is linked to this login —
      // show a friendly empty state instead of a toast error, since
      // this is an expected state for some accounts, not a failure.
      if (error.response?.status === 404) {
        setNotLinked(true);
      } else {
        toast.error("Failed to load your profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await essService.updateMyProfile(form);
      toast.success("Profile updated successfully");
      loadSummary();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page fade-up">
        <span className="spinner" /> Loading your profile...
      </div>
    );
  }

  if (notLinked) {
    return (
      <div className="page fade-up">
        <div className="page-header">
          <div>
            <h2>My Profile</h2>
            <p>Your self-service profile, attendance and payslips.</p>
          </div>
        </div>
        <div className="card">
          <p className="empty-note">
            No employee record is linked to your login yet. Contact HR or Admin
            to get this set up.
          </p>
        </div>
      </div>
    );
  }

  const employee = summary?.employee || {};
  const latestPayslip = summary?.latestPayslip;

  return (
    <div className="page fade-up">
      <div className="page-header">
        <div>
          <h2>My Profile</h2>
          <p>Your self-service profile, attendance and payslips.</p>
        </div>
      </div>

      {/* Quick-glance summary */}
      <div className="ess-summary-grid">
        <div className="card ess-summary-card">
          <span className="ess-summary-label">Employee</span>
          <strong className="ess-summary-value">{employee.name || "-"}</strong>
          <span className="ess-summary-sub">
            {employee.employeeId} · {employee.department} ·{" "}
            {employee.designation}
          </span>
        </div>

        <div className="card ess-summary-card">
          <span className="ess-summary-label">Attendance This Month</span>
          <strong className="ess-summary-value">
            {summary?.attendanceThisMonth ?? 0} days
          </strong>
        </div>

        <div className="card ess-summary-card">
          <span className="ess-summary-label">Pending Leave Requests</span>
          <strong className="ess-summary-value">
            {summary?.pendingLeaves ?? 0}
          </strong>
        </div>

        <div className="card ess-summary-card">
          <span className="ess-summary-label">Latest Payslip</span>
          {latestPayslip ? (
            <>
              <strong className="ess-summary-value">
                ₹ {Number(latestPayslip.netSalary || 0).toLocaleString("en-IN")}
              </strong>
              <span className="ess-summary-sub">
                {latestPayslip.month} {latestPayslip.year} ·{" "}
                <span
                  className={
                    latestPayslip.paymentStatus === "Paid"
                      ? "pill pill-success"
                      : "pill pill-warning"
                  }
                >
                  {latestPayslip.paymentStatus}
                </span>
              </span>
            </>
          ) : (
            <span className="ess-summary-sub">No payslips yet</span>
          )}
        </div>
      </div>

      <div className="lb-actions ess-payslip-link">
        <button
          type="button"
          className="btn-accent"
          onClick={() => navigate(`/${role}/my-payslips`)}
        >
          View All Payslips
        </button>
      </div>

      {/* Editable contact details */}
      <form onSubmit={handleSave}>
        <div className="card">
          <h3 className="ess-card-title">Contact Details</h3>
          <p className="ess-card-subtitle">
            Only phone, address and emergency contact can be updated here. For
            anything else, contact HR/Admin.
          </p>

          <div className="form-grid">
            <div className="form-row">
              <label>Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Emergency Contact</label>
              <input
                type="text"
                value={form.emergencyContact}
                onChange={(e) =>
                  handleChange("emergencyContact", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="lb-actions">
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
