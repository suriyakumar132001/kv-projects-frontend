import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

import analyticsService from "../../services/analyticsService";

import "./Analytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  const [inventory, setInventory] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);

      const [summaryRes, revenueRes, expensesRes, budgetRes, inventoryRes] =
        await Promise.all([
          analyticsService.getDashboardSummary(),
          analyticsService.getMonthlyRevenue(),
          analyticsService.getMonthlyExpenses(),
          analyticsService.getBudgetSummary(),
          analyticsService.getInventorySummary(),
        ]);

      setSummary(summaryRes.summary);
      setRevenue(revenueRes.revenue || []);
      setExpenses(expensesRes.expenses || []);
      setBudget(budgetRes.budget || {});
      setInventory(inventoryRes.inventory || {});
    } catch (error) {
      console.error(error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const buildMonthlyData = (data) => {
    const values = new Array(12).fill(0);

    data.forEach((item) => {
      const monthIndex = (item._id?.month || 1) - 1;
      values[monthIndex] = item.amount;
    });

    return values;
  };

  const revenueChartData = {
    labels: MONTHS,
    datasets: [
      {
        label: "Revenue",
        data: buildMonthlyData(revenue),
        backgroundColor: "#2563eb",
        borderRadius: 6,
      },
    ],
  };

  const expenseChartData = {
    labels: MONTHS,
    datasets: [
      {
        label: "Expenses",
        data: buildMonthlyData(expenses),
        borderColor: "#dc2626",
        backgroundColor: "rgba(220, 38, 38, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  if (loading) {
    return <h2>Loading Analytics...</h2>;
  }

  return (
    <div className="analytics-page">

      <div className="analytics-header">
        <h2>Analytics</h2>
        <p>Business performance overview</p>
      </div>

      <div className="summary-cards">

        <div className="summary-card revenue">
          <h4>Total Revenue</h4>
          <h2>₹ {Number(summary?.totalRevenue || 0).toLocaleString()}</h2>
        </div>

        <div className="summary-card expense">
          <h4>Total Expenses</h4>
          <h2>₹ {Number(summary?.totalExpenses || 0).toLocaleString()}</h2>
        </div>

        <div className="summary-card profit">
          <h4>Total Profit</h4>
          <h2>₹ {Number(summary?.totalProfit || 0).toLocaleString()}</h2>
        </div>

        <div className="summary-card">
          <h4>Pending Invoices</h4>
          <h2>{summary?.pendingInvoices || 0}</h2>
        </div>

      </div>

      <div className="charts-row">

        <div className="chart-card">
          <h3>Monthly Revenue</h3>
          <Bar data={revenueChartData} options={chartOptions} />
        </div>

        <div className="chart-card">
          <h3>Monthly Expenses</h3>
          <Line data={expenseChartData} options={chartOptions} />
        </div>

      </div>

      <div className="bottom-row">

        <div className="summary-card">
          <h4>Employees</h4>
          <h2>{summary?.totalEmployees || 0}</h2>
        </div>

        <div className="summary-card">
          <h4>Active Sites</h4>
          <h2>{summary?.totalSites || 0}</h2>
        </div>

        <div className="summary-card">
          <h4>Clients</h4>
          <h2>{summary?.totalClients || 0}</h2>
        </div>

        <div className="summary-card">
          <h4>Vendors</h4>
          <h2>{summary?.totalVendors || 0}</h2>
        </div>

        <div className="summary-card">
          <h4>Total Budget</h4>
          <h2>₹ {Number(budget?.totalBudget || 0).toLocaleString()}</h2>
        </div>

        <div className="summary-card">
          <h4>Used Budget</h4>
          <h2>₹ {Number(budget?.usedBudget || 0).toLocaleString()}</h2>
        </div>

        <div className="summary-card">
          <h4>Remaining Budget</h4>
          <h2>₹ {Number(budget?.remainingBudget || 0).toLocaleString()}</h2>
        </div>

        <div className="summary-card">
          <h4>Inventory Items</h4>
          <h2>{inventory?.items || 0}</h2>
        </div>

        <div className="summary-card">
          <h4>Total Stock</h4>
          <h2>{inventory?.totalStock || 0}</h2>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsDashboard;