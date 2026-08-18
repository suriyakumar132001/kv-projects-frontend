import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

import analyticsService from "../../services/analyticsService";

import "./AdvancedDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const PERIODS = [
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
  { key: "1y", label: "1 Year" },
  { key: "all", label: "All Time" },
];

const STATUS_COLORS = {
  draft: "#9ca3af",
  pending: "#ffa94d",
  approved: "#339af0",
  ordered: "#7048e8",
  received: "#3ccb6e",
  cancelled: "#ff6b6b",
};

const money = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`;

// Resolves a value from the first of several possible API result shapes,
// so the UI still renders sensibly while backend routes are being built.
const settledValue = (result, fallback) =>
  result.status === "fulfilled" ? result.value : fallback;

const AdvancedDashboard = () => {
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [poSummary, setPoSummary] = useState(null);
  const [topVendors, setTopVendors] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [overdueInvoices, setOverdueInvoices] = useState([]);
  const [projectStatus, setProjectStatus] = useState([]);

  useEffect(() => {
    loadAll(period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const loadAll = async (activePeriod) => {
    setLoading(true);

    const results = await Promise.allSettled([
      analyticsService.getDashboardSummary(),
      analyticsService.getMonthlyRevenue({ period: activePeriod }),
      analyticsService.getMonthlyExpenses({ period: activePeriod }),
      analyticsService.getPurchaseOrderSummary({ period: activePeriod }),
      analyticsService.getTopVendors({ period: activePeriod, limit: 5 }),
      analyticsService.getLowStockItems(),
      analyticsService.getOverdueInvoices(),
      analyticsService.getProjectStatusOverview(),
    ]);

    const [
      summaryRes,
      revenueRes,
      expensesRes,
      poRes,
      vendorsRes,
      lowStockRes,
      overdueRes,
      projectsRes,
    ] = results;

    setSummary(settledValue(summaryRes, { value: {} }).summary || {});
    setRevenue(settledValue(revenueRes, { value: {} }).revenue || []);
    setExpenses(settledValue(expensesRes, { value: {} }).expenses || []);
    setPoSummary(settledValue(poRes, { value: {} }) || {});
    setTopVendors(settledValue(vendorsRes, { value: {} }).vendors || []);
    setLowStock(settledValue(lowStockRes, { value: {} }).items || []);
    setOverdueInvoices(settledValue(overdueRes, { value: {} }).invoices || []);
    setProjectStatus(settledValue(projectsRes, { value: {} }).projects || []);

    const failedCount = results.filter((r) => r.status === "rejected").length;
    if (failedCount > 0) {
      toast.warn(
        `${failedCount} dashboard section${
          failedCount > 1 ? "s" : ""
        } couldn't load — showing what's available.`,
      );
    }

    setLoading(false);
  };

  const buildMonthlyData = (data) => {
    const values = new Array(12).fill(0);
    data.forEach((item) => {
      const monthIndex = (item._id?.month || 1) - 1;
      values[monthIndex] = item.amount;
    });
    return values;
  };

  const revenueValues = useMemo(() => buildMonthlyData(revenue), [revenue]);
  const expenseValues = useMemo(() => buildMonthlyData(expenses), [expenses]);
  const profitValues = useMemo(
    () => revenueValues.map((r, i) => r - expenseValues[i]),
    [revenueValues, expenseValues],
  );

  const revenueVsExpenseData = {
    labels: MONTHS,
    datasets: [
      {
        label: "Revenue",
        data: revenueValues,
        backgroundColor: "#2563eb",
        borderRadius: 6,
      },
      {
        label: "Expenses",
        data: expenseValues,
        backgroundColor: "#ff6b6b",
        borderRadius: 6,
      },
    ],
  };

  const profitTrendData = {
    labels: MONTHS,
    datasets: [
      {
        label: "Profit",
        data: profitValues,
        borderColor: "#2e7d4f",
        backgroundColor: "rgba(46, 125, 79, 0.12)",
        tension: 0.3,
        fill: true,
        pointRadius: 3,
      },
    ],
  };

  const statusBreakdown = poSummary?.statusBreakdown || [];
  const poStatusData = {
    labels: statusBreakdown.map((s) => s.status),
    datasets: [
      {
        data: statusBreakdown.map((s) => s.count),
        backgroundColor: statusBreakdown.map(
          (s) => STATUS_COLORS[s.status?.toLowerCase()] || "#94a3b8",
        ),
        borderWidth: 0,
      },
    ],
  };

  const vendorChartData = {
    labels: topVendors.map((v) => v.name),
    datasets: [
      {
        label: "Total Spend",
        data: topVendors.map((v) => v.totalSpend),
        backgroundColor: "#7048e8",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: true, position: "bottom" } },
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: { legend: { display: true, position: "bottom" } },
  };

  const vendorBarOptions = {
    indexAxis: "y",
    responsive: true,
    plugins: { legend: { display: false } },
  };

  if (loading) return <h2>Loading Advanced Dashboard...</h2>;

  return (
    <div className="adv-dashboard">
      <div className="adv-header">
        <div>
          <h2>Advanced Dashboard</h2>
          <p>
            Company-wide performance across sales, purchasing, inventory and
            finance
          </p>
        </div>

        <div className="period-filter">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              className={period === p.key ? "is-active" : ""}
              onClick={() => setPeriod(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI strip */}
      <div className="kpi-grid">
        <div className="kpi-card k-revenue">
          <h4>Total Revenue</h4>
          <h2>{money(summary?.totalRevenue)}</h2>
        </div>
        <div className="kpi-card k-expense">
          <h4>Total Expenses</h4>
          <h2>{money(summary?.totalExpenses)}</h2>
        </div>
        <div className="kpi-card k-profit">
          <h4>Net Profit</h4>
          <h2>{money(summary?.totalProfit)}</h2>
        </div>
        <div className="kpi-card k-outstanding">
          <h4>Outstanding</h4>
          <h2>{money(summary?.totalOutstanding)}</h2>
        </div>
        <div className="kpi-card">
          <h4>Active Projects</h4>
          <h2>{summary?.totalProjects ?? 0}</h2>
        </div>
        <div className="kpi-card">
          <h4>Employees</h4>
          <h2>{summary?.totalEmployees ?? 0}</h2>
        </div>
        <div className="kpi-card k-po">
          <h4>Open Purchase Orders</h4>
          <h2>{poSummary?.openCount ?? 0}</h2>
        </div>
        <div className="kpi-card k-alert">
          <h4>Low Stock Alerts</h4>
          <h2>{lowStock.length}</h2>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="charts-row">
        <div className="chart-card">
          <h3>Revenue vs Expenses</h3>
          <Bar data={revenueVsExpenseData} options={barOptions} />
        </div>
        <div className="chart-card">
          <h3>Profit Trend</h3>
          <Line data={profitTrendData} options={lineOptions} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="charts-row">
        <div className="chart-card chart-card-small">
          <h3>Purchase Order Status</h3>
          {statusBreakdown.length ? (
            <Doughnut data={poStatusData} options={doughnutOptions} />
          ) : (
            <p className="empty-note">No purchase order data available</p>
          )}
        </div>
        <div className="chart-card">
          <h3>Top Vendors by Spend</h3>
          {topVendors.length ? (
            <Bar data={vendorChartData} options={vendorBarOptions} />
          ) : (
            <p className="empty-note">No vendor spend data available</p>
          )}
        </div>
      </div>

      {/* Recent Purchase Orders */}
      <div className="table-section">
        <h3>Recent Purchase Orders</h3>
        {poSummary?.recent?.length ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {poSummary.recent.map((po) => (
                  <tr key={po.id}>
                    <td className="mono">{po.poNumber}</td>
                    <td>{po.vendorName}</td>
                    <td className="mono">{money(po.amount)}</td>
                    <td>
                      <span
                        className={`status-pill status-${po.status?.toLowerCase()}`}
                      >
                        {po.status}
                      </span>
                    </td>
                    <td>
                      {po.date
                        ? new Date(po.date).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-note">No recent purchase orders</p>
        )}
      </div>

      {/* Low Stock + Overdue Invoices side by side */}
      <div className="tables-row">
        <div className="table-section">
          <h3>Low Stock Inventory</h3>
          {lowStock.length ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Reorder Level</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td className="mono danger-text">{item.currentStock}</td>
                      <td className="mono">{item.reorderLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-note">All stock levels are healthy</p>
          )}
        </div>

        <div className="table-section">
          <h3>Overdue Invoices</h3>
          {overdueInvoices.length ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Client</th>
                    <th>Amount</th>
                    <th>Days Overdue</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="mono">{inv.invoiceNo}</td>
                      <td>{inv.clientName}</td>
                      <td className="mono">{money(inv.amount)}</td>
                      <td className="mono danger-text">{inv.daysOverdue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-note">No overdue invoices</p>
          )}
        </div>
      </div>

      {/* Project Status Overview */}
      <div className="table-section">
        <h3>Project Status Overview</h3>
        {projectStatus.length ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Budget</th>
                  <th>Spent</th>
                  <th>% Used</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projectStatus.map((proj) => {
                  const pct = proj.budget
                    ? Math.min(
                        100,
                        Math.round((proj.spent / proj.budget) * 100),
                      )
                    : 0;
                  return (
                    <tr key={proj.id}>
                      <td>{proj.name}</td>
                      <td className="mono">{money(proj.budget)}</td>
                      <td className="mono">{money(proj.spent)}</td>
                      <td>
                        <div className="usage-bar">
                          <div
                            className={`usage-fill ${
                              pct >= 100 ? "over" : pct >= 80 ? "warn" : ""
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="usage-label">{pct}%</span>
                      </td>
                      <td>
                        <span
                          className={`status-pill status-${proj.status?.toLowerCase()}`}
                        >
                          {proj.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-note">No project status data available</p>
        )}
      </div>
    </div>
  );
};

export default AdvancedDashboard;
