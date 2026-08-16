import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import attendanceService from "../../services/attendanceService";

import "./Dashboard.css";

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Animates a number from 0 up to `target` whenever `target` changes.
const useCountUp = (target, duration = 900) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
};

const Dashboard = () => {
  const { user: authUser } = useAuth();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    employees: 0,
    projects: 0,
    attendance: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [ringReady, setRingReady] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [todayAttendanceLoading, setTodayAttendanceLoading] = useState(false);
  const [companyOverview, setCompanyOverview] = useState(null);
  const [companyOverviewLoading, setCompanyOverviewLoading] = useState(false);

  const role = authUser?.role?.toLowerCase();

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      const res = await api.get(`/dashboard/${role}`);

      setUser(res.data.user);
      setStats(res.data.stats || {});
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

    // Load today's attendance for Owner and Admin
    if (role === "owner" || role === "admin") {
      getTodayAttendanceData();
      getCompanyOverviewData();
    }
  };

  const getCompanyOverviewData = async () => {
    try {
      setCompanyOverviewLoading(true);
      const res = await api.get("/projects/reports/company-profitability");
      setCompanyOverview(res?.data?.companyOverview || null);
    } catch (error) {
      console.log("Failed to load company overview:", error);
      setCompanyOverview(null);
    } finally {
      setCompanyOverviewLoading(false);
    }
  };

  const getTodayAttendanceData = async () => {
    try {
      setTodayAttendanceLoading(true);
      const res = await attendanceService.getTodayAttendance();
      setTodayAttendance(res);
    } catch (error) {
      console.log("Failed to load today's attendance:", error);
    } finally {
      setTodayAttendanceLoading(false);
    }
  };

  // Trigger the ring's draw-in animation just after real data has arrived.
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setRingReady(true), 200);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const employees = useCountUp(stats.employees ?? 0);
  const projects = useCountUp(stats.projects ?? 0);
  const attendance = useCountUp(stats.attendance ?? 0);
  const revenue = useCountUp(Number(stats.revenue) || 0, 1100);

  // Real derived metric (not fabricated): how much of today's workforce
  // has been marked present, out of total employees.
  const attendanceRate =
    stats.employees > 0
      ? Math.min(100, Math.round((stats.attendance / stats.employees) * 100))
      : 0;

  const ringOffset = ringReady
    ? CIRCUMFERENCE - (attendanceRate / 100) * CIRCUMFERENCE
    : CIRCUMFERENCE;

  if (loading) return <h2>Loading Dashboard...</h2>;
  if (!user) return <h2>Unable to load dashboard</h2>;

  return (
    <div className="dashboard">
      <div className="welcome-card">
        <div className="welcome-inner">
          <div className="welcome-text">
            <h1>
              Welcome, {user.name} <span className="wave">👋</span>
            </h1>
            <div className="welcome-meta">
              <p>
                Role: <strong>{user.role}</strong>
              </p>
              <p>
                Status:{" "}
                <span
                  className={`status-chip ${
                    user.status === "Active" ? "is-active" : ""
                  }`}
                >
                  {user.status}
                </span>
              </p>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phone}</p>
            </div>
          </div>

          <div className="attendance-ring">
            <svg viewBox="0 0 160 160" width="150" height="150">
              <circle className="ring-track" cx="80" cy="80" r={RADIUS} />
              <circle
                className="ring-bar"
                cx="80"
                cy="80"
                r={RADIUS}
                style={{
                  strokeDasharray: CIRCUMFERENCE,
                  strokeDashoffset: ringOffset,
                }}
              />
            </svg>
            <div className="ring-label">
              <b>{attendanceRate}%</b>
              <span>Today's Attendance</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cards">
        <div className="card c-emp">
          <div className="card-icon">👥</div>
          <h2>Employees</h2>
          <h1>{employees}</h1>
          <div className="accent-bar" />
        </div>

        <div className="card c-proj">
          <div className="card-icon">📐</div>
          <h2>Projects</h2>
          <h1>{projects}</h1>
          <div className="accent-bar" />
        </div>

        <div className="card c-att">
          <div className="card-icon">🗓</div>
          <h2>Attendance</h2>
          <h1>{attendance}</h1>
          <div className="accent-bar" />
        </div>

        <div className="card c-rev">
          <div className="card-icon">₹</div>
          <h2>Revenue</h2>
          <h1>₹ {revenue.toLocaleString("en-IN")}</h1>
          <div className="accent-bar" />
        </div>
      </div>

      {/* Today's Attendance Status — visible only for Owner and Admin */}
      {(role === "owner" || role === "admin") && (
        <div className="today-attendance-section">
          <h2>Today's Attendance Status</h2>

          {todayAttendanceLoading ? (
            <p>Loading attendance data...</p>
          ) : todayAttendance ? (
            <>
              {/* Summary Stats */}
              <div className="attendance-summary">
                <div className="summary-item">
                  <label>Total Employees</label>
                  <span className="stat-value">
                    {todayAttendance.stats.totalEmployees}
                  </span>
                </div>

                <div className="summary-item present">
                  <label>Present</label>
                  <span className="stat-value">
                    {todayAttendance.stats.presentCount}
                  </span>
                </div>

                <div className="summary-item absent">
                  <label>Absent</label>
                  <span className="stat-value">
                    {todayAttendance.stats.absentCount}
                  </span>
                </div>

                <div className="summary-item half-day">
                  <label>Half Day</label>
                  <span className="stat-value">
                    {todayAttendance.stats.halfDayCount}
                  </span>
                </div>

                <div className="summary-item leave">
                  <label>On Leave</label>
                  <span className="stat-value">
                    {todayAttendance.stats.leaveCount}
                  </span>
                </div>

                <div className="summary-item not-marked">
                  <label>Not Marked</label>
                  <span className="stat-value">
                    {todayAttendance.stats.notMarkedCount}
                  </span>
                </div>
              </div>

              {/* Attendance Records Table */}
              <div className="attendance-table-wrapper">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Check-In Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAttendance.records.slice(0, 10).map((record, idx) => (
                      <tr key={idx}>
                        <td>{record.employeeId}</td>
                        <td>{record.name}</td>
                        <td>{record.department}</td>
                        <td>
                          <span
                            className={`status-badge status-${record.status
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td>
                          {record.checkIn
                            ? new Date(record.checkIn).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {todayAttendance.records.length > 10 && (
                  <p className="table-footer">
                    Showing 10 of {todayAttendance.records.length} employees
                  </p>
                )}
              </div>
            </>
          ) : (
            <p>Unable to load attendance data</p>
          )}
        </div>
      )}

      {/* Company Financial Overview — visible only for Owner and Admin */}
      {(role === "owner" || role === "admin") && (
        <div className="finance-overview-section">
          <h2>Company Financial Overview</h2>

          {companyOverviewLoading ? (
            <p>Loading financial overview...</p>
          ) : companyOverview ? (
            <>
              <div className="finance-summary">
                <div className="finance-item">
                  <label>Total Invoiced</label>
                  <span className="stat-value">
                    ₹{companyOverview.totalInvoiced.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="finance-item received">
                  <label>Amount Received</label>
                  <span className="stat-value">
                    ₹{companyOverview.totalReceived.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="finance-item outstanding">
                  <label>Outstanding</label>
                  <span className="stat-value">
                    ₹{companyOverview.totalOutstanding.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="finance-item expense">
                  <label>Total Expense</label>
                  <span className="stat-value">
                    ₹{companyOverview.totalExpense.toLocaleString("en-IN")}
                  </span>
                </div>

                <div
                  className={`finance-item ${
                    companyOverview.totalProfit >= 0 ? "profit" : "loss"
                  }`}
                >
                  <label>Profit ({companyOverview.profitMargin}% margin)</label>
                  <span className="stat-value">
                    ₹{companyOverview.totalProfit.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {(companyOverview.overdueInvoices.count > 0 ||
                companyOverview.overBudgetProjects.length > 0) && (
                <div className="finance-alerts">
                  {companyOverview.overdueInvoices.count > 0 && (
                    <div className="finance-alert-item alert-overdue">
                      {companyOverview.overdueInvoices.count} overdue invoice(s)
                      totaling ₹
                      {companyOverview.overdueInvoices.amount.toLocaleString(
                        "en-IN",
                      )}
                    </div>
                  )}

                  {companyOverview.overBudgetProjects.length > 0 && (
                    <div className="finance-alert-item alert-over-budget">
                      {companyOverview.overBudgetProjects.length} project(s)
                      over budget:{" "}
                      {companyOverview.overBudgetProjects
                        .map((p) => p.projectName)
                        .join(", ")}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <p>Unable to load financial overview</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
