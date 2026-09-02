import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import employeeService from "../../services/employeeService";
import payrollService from "../../services/payrollService";

import "./Payroll.css";

const EditPayroll = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    employee: "",
    month: "",
    year: "",

    basicSalary: "",
    hra: "",
    allowance: "",
    overtime: "",
    overtimeHours: "",
    bonus: "",

    pf: "",
    esi: "",
    professionalTax: "",
    daysInMonth: "",
    daysPresent: "",
    daysOnApprovedLeave: "",
    daysAbsent: "",
    perDaySalary: "",
    lopDeduction: "",
  });

  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);
  const [netSalary, setNetSalary] = useState(0);
  const [summaryInfo, setSummaryInfo] = useState(null);

  // ===============================
  // Load Initial Data
  // ===============================

  useEffect(() => {
    loadEmployees();
    loadPayroll();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await employeeService.getEmployees();

      setEmployees(res.employees || []);
    } catch (error) {
      toast.error("Failed to load employees");
    }
  };

  const loadPayroll = async () => {
    try {
      const res = await payrollService.getPayroll(id);

      const payroll = res.payroll;

      setFormData({
        employee: payroll.employee?._id || "",
        month: payroll.month || "",
        year: payroll.year || "",

        basicSalary: payroll.basicSalary || 0,
        hra: payroll.hra || 0,
        allowance: payroll.allowance || 0,
        overtime: payroll.overtime || 0,
        overtimeHours: payroll.overtimeHours || 0,
        bonus: payroll.bonus || 0,

        pf: payroll.pf || 0,
        esi: payroll.esi || 0,
        professionalTax: payroll.professionalTax || 0,
        daysInMonth: payroll.daysInMonth || 0,
        daysPresent: payroll.daysPresent || 0,
        daysOnApprovedLeave: payroll.daysOnApprovedLeave || 0,
        daysAbsent: payroll.daysAbsent || 0,
        perDaySalary: payroll.perDaySalary || 0,
        lopDeduction: payroll.lopDeduction || 0,
      });
    } catch (error) {
      toast.error("Failed to load payroll");
      navigate(`/${role}/payroll`);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Auto Calculate Salary
  // ===============================

  useEffect(() => {
    const earnings =
      Number(formData.basicSalary || 0) +
      Number(formData.hra || 0) +
      Number(formData.allowance || 0) +
      Number(formData.overtime || 0) +
      Number(formData.bonus || 0);

    const deductions =
      Number(formData.pf || 0) +
      Number(formData.esi || 0) +
      Number(formData.professionalTax || 0) +
      Number(formData.lopDeduction || 0);

    setTotalEarnings(earnings);
    setTotalDeductions(deductions);
    setNetSalary(earnings - deductions);
  }, [formData]);

  useEffect(() => {
    if (!formData.employee || !formData.month || !formData.year) {
      setSummaryInfo(null);
      return;
    }

    let active = true;

    const loadSummary = async () => {
      try {
        const res = await payrollService.getAttendanceSummary({
          employee: formData.employee,
          month: formData.month,
          year: formData.year,
        });

        if (!active || !res?.summary) return;

        const summary = res.summary;
        const perDaySalary = Number(summary.daysInMonth)
          ? Number(formData.basicSalary || 0) / Number(summary.daysInMonth)
          : 0;

        const lopDeduction = Math.max(0, Number(summary.daysAbsent || 0) * perDaySalary);
        const overtimeHours = Number(summary.overtimeHours || 0);
        const overtimeRate = perDaySalary > 0 ? perDaySalary / 8 : 0;
        const overtimePay = overtimeHours * overtimeRate;

        setSummaryInfo({
          ...summary,
          perDaySalary,
          lopDeduction,
          overtimeHours,
          overtimePay,
        });
      } catch (error) {
        setSummaryInfo(null);
      }
    };

    loadSummary();

    return () => {
      active = false;
    };
  }, [formData.employee, formData.month, formData.year, formData.basicSalary]);

  // ======================================
  // Handle Change
  // ======================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================
  // Update Payroll
  // ======================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...formData,
        totalEarnings,
        totalDeductions,
        netSalary,
      };

      await payrollService.updatePayroll(id, payload);

      toast.success("Payroll Updated Successfully");

      navigate(`/${role}/payroll`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update payroll"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <h2>Loading Payroll...</h2>;
  }

  return (
    <div className="payroll-form-page">
      <div className="payroll-form-card">
        <h2>Edit Payroll</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Employee</label>

              <select
                name="employee"
                value={formData.employee}
                onChange={handleChange}
              >
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employeeId} - {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Month</label>

              <input
                type="text"
                name="month"
                value={formData.month}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Year</label>

              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Basic Salary</label>

              <input
                type="number"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>HRA</label>

              <input
                type="number"
                name="hra"
                value={formData.hra}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Allowance</label>

              <input
                type="number"
                name="allowance"
                value={formData.allowance}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Overtime Hours</label>

              <input
                type="number"
                name="overtimeHours"
                value={formData.overtimeHours}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Overtime Pay</label>

              <input
                type="number"
                name="overtime"
                value={formData.overtime}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Bonus</label>

              <input
                type="number"
                name="bonus"
                value={formData.bonus}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>PF</label>

              <input
                type="number"
                name="pf"
                value={formData.pf}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>ESI</label>

              <input
                type="number"
                name="esi"
                value={formData.esi}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Professional Tax</label>

              <input
                type="number"
                name="professionalTax"
                value={formData.professionalTax}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Days in Month</label>

              <input
                type="number"
                name="daysInMonth"
                value={formData.daysInMonth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Days Present</label>

              <input
                type="number"
                name="daysPresent"
                value={formData.daysPresent}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Approved Leave Days</label>

              <input
                type="number"
                name="daysOnApprovedLeave"
                value={formData.daysOnApprovedLeave}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Days Absent</label>

              <input
                type="number"
                name="daysAbsent"
                value={formData.daysAbsent}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Per Day Salary</label>

              <input
                type="number"
                name="perDaySalary"
                value={formData.perDaySalary}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>LOP Deduction</label>

              <input
                type="number"
                name="lopDeduction"
                value={formData.lopDeduction}
                onChange={handleChange}
              />
            </div>
          </div>

          {summaryInfo && (
            <div className="form-group full-width">
              <div className="salary-summary">
                <div className="summary-card"> 
                  <h4>Attendance Summary</h4>
                  <p>
                    {summaryInfo.daysPresent} present · {summaryInfo.daysOnApprovedLeave} approved leave · {summaryInfo.daysAbsent} absent
                  </p>
                  <p>
                    LOP formula: {summaryInfo.daysAbsent} × ₹{Number(summaryInfo.perDaySalary || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })} = ₹{Number(formData.lopDeduction || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </p>
                  <p>
                    Overtime: {summaryInfo.overtimeHours || 0} hrs × ₹{Number(summaryInfo.perDaySalary > 0 ? summaryInfo.perDaySalary / 8 : 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}/hr = ₹{Number(summaryInfo.overtimePay || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="form-group full-width">
            <div className="salary-summary">
              <div className="summary-card earnings">
                <h4>Total Earnings</h4>
                <h2>₹ {totalEarnings}</h2>
              </div>

              <div className="summary-card deductions">
                <h4>Total Deductions</h4>
                <h2>₹ {totalDeductions}</h2>
              </div>

              <div className="summary-card net">
                <h4>Net Salary</h4>
                <h2>₹ {netSalary}</h2>
              </div>
            </div>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/${role}/payroll`)}
            >
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? "Updating..." : "Update Payroll"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPayroll;