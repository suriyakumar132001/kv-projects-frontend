import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FaPrint, FaFileCsv, FaSync } from "react-icons/fa";

import payrollService from "../../services/payrollService";

import "./Payroll.css";

const PayrollReport = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // ===============================
  // Load Payrolls
  // ===============================

  useEffect(() => {
    loadPayrolls();
  }, []);

  const loadPayrolls = async () => {
    try {
      setLoading(true);

      const res = await payrollService.getPayrolls();

      setPayrolls(res.payrolls || []);
    } catch (error) {
      toast.error("Failed to load payroll report");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Filter Payrolls
  // ===============================

  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((item) => {
      const employee = item.employee?.name?.toLowerCase() || "";

      const matchSearch = employee.includes(search.toLowerCase());

      const matchMonth = month === "" || item.month === month;

      const matchYear = year === "" || String(item.year) === year;

      return matchSearch && matchMonth && matchYear;
    });
  }, [payrolls, search, month, year]);

  // ===============================
  // Summary
  // ===============================

  const totalEarnings = filteredPayrolls.reduce(
    (sum, item) => sum + Number(item.totalEarnings || 0),
    0
  );

  const totalDeductions = filteredPayrolls.reduce(
    (sum, item) => sum + Number(item.totalDeductions || 0),
    0
  );

  const totalNetSalary = filteredPayrolls.reduce(
    (sum, item) => sum + Number(item.netSalary || 0),
    0
  );

  // ===============================
  // Export CSV
  // ===============================

  const csvEscape = (value) => {
    const str = String(value ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const exportCSV = () => {
    const headers = [
      "Employee ID",
      "Employee Name",
      "Department",
      "Month",
      "Year",
      "Net Salary",
      "Status",
    ];

    const rows = filteredPayrolls.map((item) => [
      item.employee?.employeeId,
      item.employee?.name,
      item.employee?.department,
      item.month,
      item.year,
      item.netSalary,
      item.paymentStatus,
    ]);

    const csv = [
      headers.map(csvEscape).join(","),
      ...rows.map((r) => r.map(csvEscape).join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "Payroll_Report.csv";

    a.click();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="loading">Loading Payroll Report...</div>;
  }

  return (
    <div className="payroll-report-page">
      <div className="page-header">
        <div>
          <h2>Payroll Report</h2>
          <p>Monthly Payroll Summary</p>
        </div>

        <div className="report-actions">
          <button className="refresh-btn" onClick={loadPayrolls}>
            <FaSync /> Refresh
          </button>

          <button className="print-btn" onClick={() => window.print()}>
            <FaPrint /> Print
          </button>

          <button className="csv-btn" onClick={exportCSV}>
            <FaFileCsv /> Export CSV
          </button>
        </div>
      </div>

      {/* ======================================
          Filters
      ====================================== */}

      <div className="report-filters">
        <input
          type="text"
          placeholder="Search Employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">All Months</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>

        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>

      {/* ======================================
          Summary Cards
      ====================================== */}

      <div className="salary-summary">
        <div className="summary-card earnings">
          <h4>Total Earnings</h4>
          <h2>₹ {totalEarnings.toLocaleString()}</h2>
        </div>

        <div className="summary-card deductions">
          <h4>Total Deductions</h4>
          <h2>₹ {totalDeductions.toLocaleString()}</h2>
        </div>

        <div className="summary-card net">
          <h4>Total Net Salary</h4>
          <h2>₹ {totalNetSalary.toLocaleString()}</h2>
        </div>
      </div>

      {/* ======================================
          Payroll Report Table
      ====================================== */}

      <div className="table-wrapper">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Month</th>
              <th>Year</th>
              <th>Total Earnings</th>
              <th>Total Deductions</th>
              <th>Net Salary</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayrolls.length > 0 ? (
              filteredPayrolls.map((payroll) => (
                <tr key={payroll._id}>
                  <td>{payroll.employee?.employeeId}</td>

                  <td>{payroll.employee?.name}</td>

                  <td>{payroll.employee?.department}</td>

                  <td>{payroll.month}</td>

                  <td>{payroll.year}</td>

                  <td>
                    ₹{" "}
                    {Number(payroll.totalEarnings || 0).toLocaleString()}
                  </td>

                  <td>
                    ₹{" "}
                    {Number(payroll.totalDeductions || 0).toLocaleString()}
                  </td>

                  <td>
                    <strong style={{ color: "#16a34a" }}>
                      ₹{" "}
                      {Number(payroll.netSalary || 0).toLocaleString()}
                    </strong>
                  </td>

                  <td>
                    <span
                      className={
                        payroll.paymentStatus === "Paid"
                          ? "status-paid"
                          : "status-pending"
                      }
                    >
                      {payroll.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    fontWeight: "600",
                  }}
                >
                  No Payroll Records Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ======================================
          Report Footer
      ====================================== */}

      <div className="report-footer">
        <div className="report-info">
          <h4>Total Records : {filteredPayrolls.length}</h4>

          <p>
            Total Earnings :
            <strong> ₹ {totalEarnings.toLocaleString()}</strong>
          </p>

          <p>
            Total Deductions :
            <strong> ₹ {totalDeductions.toLocaleString()}</strong>
          </p>

          <p>
            Total Net Salary :
            <strong style={{ color: "#16a34a" }}>
              {" "}
              ₹ {totalNetSalary.toLocaleString()}
            </strong>
          </p>
        </div>

        <div className="report-note">
          <p>
            This report is generated automatically by
            <strong> KV Projects ERP </strong>
            Payroll Management System.
          </p>

          <p>Generated On : {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default PayrollReport;