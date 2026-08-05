import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import employeeService from "../../services/employeeService";
import payrollService from "../../services/payrollService";

import "./Payroll.css";

const GeneratePayroll = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    employee: "",
    month: "",
    year: new Date().getFullYear(),

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

  const [loading, setLoading] = useState(false);

  // ==========================
  // Load Employees
  // ==========================

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await employeeService.getEmployees();

      setEmployees(res.employees || []);
    } catch (error) {
      toast.error("Failed to load employees");
    }
  };

  // ==========================
  // Auto Salary Calculation
  // ==========================

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

  // ==========================
  // Handle Input Change
  // ==========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================
  // Generate Payroll
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.employee) {
      return toast.error("Please select an employee");
    }

    if (!formData.month) {
      return toast.error("Please select month");
    }

    if (!formData.year) {
      return toast.error("Please enter year");
    }

    if (!formData.basicSalary) {
      return toast.error("Please enter basic salary");
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,

        totalEarnings,
        totalDeductions,
        netSalary,
      };

      await payrollService.createPayroll(payload);

      toast.success("Payroll Generated Successfully");

      navigate(`/${role}/payroll`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to generate payroll"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payroll-form-page">
      <div className="payroll-form-card">
        <h2>Generate Payroll</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Employee */}
            <div className="form-group">
              <label>Employee</label>

              <select
                name="employee"
                value={formData.employee}
                onChange={handleChange}
                required
              >
                <option value="">Select Employee</option>

                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employeeId} - {emp.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Month */}
            <div className="form-group">
              <label>Month</label>

              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
              >
                <option value="">Select Month</option>

                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
            </div>

            {/* Year */}
            <div className="form-group">
              <label>Year</label>

              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>

            {/* Basic Salary */}
            <div className="form-group">
              <label>Basic Salary</label>

              <input
                type="number"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleChange}
                required
              />
            </div>

            {/* HRA */}
            <div className="form-group">
              <label>HRA</label>

              <input
                type="number"
                name="hra"
                value={formData.hra}
                onChange={handleChange}
              />
            </div>

            {/* Allowance */}
            <div className="form-group">
              <label>Allowance</label>

              <input
                type="number"
                name="allowance"
                value={formData.allowance}
                onChange={handleChange}
              />
            </div>

            {/* Overtime */}
            <div className="form-group">
              <label>Overtime</label>

              <input
                type="number"
                name="overtime"
                value={formData.overtime}
                onChange={handleChange}
              />
            </div>

            {/* Bonus */}
            <div className="form-group">
              <label>Bonus</label>

              <input
                type="number"
                name="bonus"
                value={formData.bonus}
                onChange={handleChange}
              />
            </div>

            {/* PF */}
            <div className="form-group">
              <label>PF</label>

              <input
                type="number"
                name="pf"
                value={formData.pf}
                onChange={handleChange}
              />
            </div>

            {/* ESI */}
            <div className="form-group">
              <label>ESI</label>

              <input
                type="number"
                name="esi"
                value={formData.esi}
                onChange={handleChange}
              />
            </div>

            {/* Professional Tax */}
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

          {/* Salary Summary */}
          <div className="form-group full-width">
            <div
              style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ marginBottom: "20px" }}>Salary Summary</h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: "20px",
                }}
              >
                <div>
                  <strong>Total Earnings</strong>

                  <h2
                    style={{
                      color: "#16a34a",
                      marginTop: "10px",
                    }}
                  >
                    ₹{totalEarnings.toLocaleString("en-IN")}
                  </h2>
                </div>

                <div>
                  <strong>Total Deductions</strong>

                  <h2
                    style={{
                      color: "#dc2626",
                      marginTop: "10px",
                    }}
                  >
                    ₹{totalDeductions.toLocaleString("en-IN")}
                  </h2>
                </div>

                <div>
                  <strong>Net Salary</strong>

                  <h2
                    style={{
                      color: "#2563eb",
                      marginTop: "10px",
                    }}
                  >
                    ₹{netSalary.toLocaleString("en-IN")}
                  </h2>
                </div>
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

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Generating..." : "Generate Payroll"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeneratePayroll;