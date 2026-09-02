import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import essService from "../../services/essService";

import "./Ess.css";

const STATUS_PILL = {
  Paid: "pill pill-success",
  Pending: "pill pill-warning",
};

const money = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

const PayslipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [payslip, setPayslip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayslip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadPayslip = async () => {
    try {
      setLoading(true);
      const res = await essService.getMyPayslip(id);
      setPayslip(res.payslip);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load payslip");
      navigate(`/${role}/my-payslips`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await essService.downloadMyPayslip(id);
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${payslip?.employee?.employeeId || "payslip"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Payslip downloaded successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to download payslip");
    }
  };

  if (loading) {
    return (
      <div className="page fade-up">
        <span className="spinner" /> Loading payslip...
      </div>
    );
  }

  if (!payslip) return null;

  const totalEarnings =
    payslip.totalEarnings ||
    (payslip.basicSalary || 0) +
      (payslip.hra || 0) +
      (payslip.allowance || 0) +
      (payslip.overtime || 0) +
      (payslip.bonus || 0);

  const totalDeductions =
    payslip.totalDeductions ||
    (payslip.pf || 0) + (payslip.esi || 0) + (payslip.professionalTax || 0);

  return (
    <div className="page fade-up">
      <div className="page-header">
        <div>
          <h2>
            Payslip — {payslip.month} {payslip.year}
          </h2>
          <p>
            {payslip.employee?.name} · {payslip.employee?.employeeId} ·{" "}
            {payslip.employee?.department}
          </p>
        </div>

        <div className="ess-detail-actions">
          <button
            type="button"
            className="lb-icon-btn"
            onClick={handleDownload}
          >
            Download PDF
          </button>
          <button
            type="button"
            className="lb-icon-btn"
            onClick={() => navigate(`/${role}/my-payslips`)}
          >
            Back to Payslips
          </button>
        </div>
      </div>

      <div className="ess-detail-summary">
        <div className="ess-detail-metric">
          <span>Net Salary</span>
          <strong>{money(payslip.netSalary)}</strong>
        </div>
        <div className="ess-detail-metric">
          <span>Total Earnings</span>
          <strong>{money(totalEarnings)}</strong>
        </div>
        <div className="ess-detail-metric">
          <span>Total Deductions</span>
          <strong>{money(totalDeductions)}</strong>
        </div>
      </div>

      <div className="card ess-payslip-card">
        <div className="ess-payslip-status-row">
          <span className={STATUS_PILL[payslip.paymentStatus] || "pill"}>
            {payslip.paymentStatus}
          </span>
          <strong className="ess-net-salary">
            Net Salary: {money(payslip.netSalary)}
          </strong>
        </div>

        {(payslip.daysInMonth || payslip.daysPresent || payslip.daysOnApprovedLeave || payslip.daysAbsent || payslip.lopDeduction) && (
          <div className="card" style={{ marginTop: 16, padding: 16 }}>
            <h4>Attendance Summary</h4>
            <div className="ess-payslip-row">
              <span>Days in Month</span>
              <span>{Number(payslip.daysInMonth || 0)}</span>
            </div>
            <div className="ess-payslip-row">
              <span>Days Present</span>
              <span>{Number(payslip.daysPresent || 0)}</span>
            </div>
            <div className="ess-payslip-row">
              <span>Approved Leave</span>
              <span>{Number(payslip.daysOnApprovedLeave || 0)}</span>
            </div>
            <div className="ess-payslip-row">
              <span>Days Absent</span>
              <span>{Number(payslip.daysAbsent || 0)}</span>
            </div>
            <div className="ess-payslip-row">
              <span>LOP Deduction</span>
              <span>{money(payslip.lopDeduction)}</span>
            </div>
          </div>
        )}

        <div className="ess-payslip-columns">
          <div>
            <h4>Earnings</h4>
            <div className="ess-payslip-row">
              <span>Basic Salary</span>
              <span>{money(payslip.basicSalary)}</span>
            </div>
            <div className="ess-payslip-row">
              <span>HRA</span>
              <span>{money(payslip.hra)}</span>
            </div>
            <div className="ess-payslip-row">
              <span>Allowance</span>
              <span>{money(payslip.allowance)}</span>
            </div>
            <div className="ess-payslip-row">
              <span>Overtime</span>
              <span>{money(payslip.overtime)}</span>
            </div>
            <div className="ess-payslip-row">
              <span>Bonus</span>
              <span>{money(payslip.bonus)}</span>
            </div>
            <div className="ess-payslip-row ess-payslip-total">
              <span>Total Earnings</span>
              <span>{money(totalEarnings)}</span>
            </div>
          </div>

          <div>
            <h4>Deductions</h4>
            <div className="ess-payslip-row">
              <span>PF</span>
              <span>{money(payslip.pf)}</span>
            </div>
            <div className="ess-payslip-row">
              <span>ESI</span>
              <span>{money(payslip.esi)}</span>
            </div>
            <div className="ess-payslip-row">
              <span>Professional Tax</span>
              <span>{money(payslip.professionalTax)}</span>
            </div>
            <div className="ess-payslip-row">
              <span>LOP Deduction</span>
              <span>{money(payslip.lopDeduction)}</span>
            </div>
            <div className="ess-payslip-row ess-payslip-total">
              <span>Total Deductions</span>
              <span>{money(totalDeductions)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayslipDetails;
