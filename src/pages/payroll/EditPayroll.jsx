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
    bonus: "",

    pf: "",
    esi: "",
    professionalTax: "",
  });

  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);
  const [netSalary, setNetSalary] = useState(0);

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
        bonus: payroll.bonus || 0,

        pf: payroll.pf || 0,
        esi: payroll.esi || 0,
        professionalTax: payroll.professionalTax || 0,
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
      Number(formData.professionalTax || 0);

    setTotalEarnings(earnings);
    setTotalDeductions(deductions);
    setNetSalary(earnings - deductions);
  }, [formData]);

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
              <label>Overtime</label>

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
          </div>

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