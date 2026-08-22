import { useEffect, useState } from "react";
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

import crmService from "../../services/crmService";

import "./CRMDashboard.css";

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

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const pct = (n) => `${Number(n || 0).toFixed(1)}%`;

const STAGE_COLORS = {
  "New Lead": "#1d4ed8",
  Contacted: "#f59e0b",
  "On Hold": "#6b7280",
  Lost: "#b91c1c",
  Converted: "#15803d",
};

const CRMDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [range, setRange] = useState("all"); // all | month | quarter | year | custom
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  const computeDates = () => {
    if (range === "all") return {};
    const now = new Date();
    let from;
    if (range === "month") {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (range === "quarter") {
      const q = Math.floor(now.getMonth() / 3);
      from = new Date(now.getFullYear(), q * 3, 1);
    } else if (range === "year") {
      from = new Date(now.getFullYear(), 0, 1);
    } else if (range === "custom") {
      return { fromDate: fromDate || undefined, toDate: toDate || undefined };
    }
    return { fromDate: from.toISOString().slice(0, 10) };
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const params = computeDates();
      const res = await crmService.getDashboard(params);
      setDashboard(res.dashboard);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to load CRM dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboard) {
    return <div className="crm-loading">Loading CRM dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="crm-empty">No CRM data available yet.</div>;
  }

  const d = dashboard;
  const maxStageCount = Math.max(1, ...d.pipelineByStage.map((s) => s.count));

  const revenueLabels = d.monthlyRevenue.map(
    (r) => `${MONTHS[r.month - 1]} ${r.year}`,
  );
  const revenueData = d.monthlyRevenue.map((r) => r.total);

  const sourceLabels = d.leadsBySource.map((s) => s.source);
  const sourceData = d.leadsBySource.map((s) => s.count);

  return (
    <div className="crm-page">
      <div className="crm-header">
        <div>
          <h2>CRM Dashboard</h2>
          <p className="crm-header-subtitle">
            Live sales pipeline, leads, and revenue — calculated from real data
          </p>
        </div>

        <div className="crm-filters">
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>

          {range === "custom" && (
            <>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </>
          )}

          <button className="crm-refresh-btn" onClick={loadDashboard}>
            {range === "custom" ? "Apply" : "Refresh"}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="crm-kpi-grid">
        <div className="crm-kpi-card">
          <div className="crm-kpi-label">Total Leads</div>
          <div className="crm-kpi-value">{d.totalLeads}</div>
          <div className="crm-kpi-sub">{d.newLeadsToday} added today</div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-label">Qualified Leads</div>
          <div className="crm-kpi-value">{d.qualifiedLeads}</div>
          <div className="crm-kpi-sub">{pct(d.qualificationRate)} of total</div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-label">Converted Leads</div>
          <div className="crm-kpi-value">{d.convertedLeads}</div>
          <div className="crm-kpi-sub positive">
            {pct(d.conversionRate)} conversion rate
          </div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-label">Total Customers</div>
          <div className="crm-kpi-value">{d.totalCustomers}</div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-label">Open Opportunities</div>
          <div className="crm-kpi-value">{d.openOpportunities}</div>
          <div className="crm-kpi-sub">
            {d.totalOpportunities} total quotations
          </div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-label">Won / Lost Opportunities</div>
          <div className="crm-kpi-value">
            {d.wonOpportunities} / {d.lostOpportunities}
          </div>
          <div className="crm-kpi-sub">{pct(d.winRate)} win rate</div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-label">Pipeline Value</div>
          <div className="crm-kpi-value">{inr(d.totalPipelineValue)}</div>
          <div className="crm-kpi-sub">Weighted: {inr(d.weightedPipeline)}</div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-label">Won Revenue</div>
          <div className="crm-kpi-value">{inr(d.wonRevenue)}</div>
          <div className="crm-kpi-sub">Avg deal: {inr(d.averageDealSize)}</div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-label">Total Invoiced</div>
          <div className="crm-kpi-value">{inr(d.totalInvoiced)}</div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-label">Total Paid</div>
          <div className="crm-kpi-value">{inr(d.totalPaid)}</div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-label">Outstanding</div>
          <div className="crm-kpi-value">{inr(d.outstanding)}</div>
        </div>

        <div className="crm-kpi-card">
          <div className="crm-kpi-label">Follow-ups</div>
          <div className="crm-kpi-value">{d.pendingFollowUps}</div>
          <div
            className={`crm-kpi-sub ${d.overdueFollowUps > 0 ? "negative" : ""}`}
          >
            {d.overdueFollowUps} overdue
          </div>
        </div>
      </div>

      {/* Sales Pipeline Strip */}
      <h3 style={{ margin: "0 0 12px", fontSize: 15.5 }}>
        Sales Pipeline (Leads)
      </h3>
      <div className="crm-pipeline-strip">
        {d.pipelineByStage.map((s) => (
          <div className="crm-pipeline-stage" key={s.stage}>
            <div className="name">{s.stage}</div>
            <div className="count">{s.count}</div>
            <div className="crm-pipeline-bar-track">
              <div
                className="crm-pipeline-bar-fill"
                style={{
                  width: `${(s.count / maxStageCount) * 100}%`,
                  background: STAGE_COLORS[s.stage] || "#f59e0b",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="crm-panel-row">
        <div className="crm-panel">
          <h3>Monthly Revenue (Paid Invoices)</h3>
          {revenueData.length === 0 ? (
            <div className="crm-empty">No paid invoices yet</div>
          ) : (
            <Line
              data={{
                labels: revenueLabels,
                datasets: [
                  {
                    label: "Revenue",
                    data: revenueData,
                    borderColor: "#0b1b2b",
                    backgroundColor: "rgba(11,27,43,0.08)",
                    fill: true,
                    tension: 0.3,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          )}
        </div>

        <div className="crm-panel">
          <h3>Leads by Source</h3>
          {sourceData.length === 0 ? (
            <div className="crm-empty">No leads yet</div>
          ) : (
            <Doughnut
              data={{
                labels: sourceLabels,
                datasets: [
                  {
                    data: sourceData,
                    backgroundColor: [
                      "#1d4ed8",
                      "#f59e0b",
                      "#15803d",
                      "#b91c1c",
                      "#6d28d9",
                      "#0891b2",
                    ],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: "bottom" } },
              }}
            />
          )}
        </div>
      </div>

      <div className="crm-panel-row">
        <div className="crm-panel">
          <h3>Opportunities by Stage (Quotations)</h3>
          <Bar
            data={{
              labels: d.opportunitiesByStatus.map((s) => s.status),
              datasets: [
                {
                  label: "Value (₹)",
                  data: d.opportunitiesByStatus.map((s) => s.value),
                  backgroundColor: "#f59e0b",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>

        <div className="crm-panel">
          <h3>Salesperson Performance</h3>
          {d.salesPerformance.length === 0 ? (
            <div className="crm-empty">No assigned leads yet</div>
          ) : (
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Leads</th>
                  <th>Converted</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {d.salesPerformance.map((sp) => (
                  <tr key={sp.salesperson}>
                    <td>{sp.salesperson}</td>
                    <td>{sp.totalLeads}</td>
                    <td>{sp.converted}</td>
                    <td>{pct(sp.conversionRate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;
