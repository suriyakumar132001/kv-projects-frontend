import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { useAuth } from "../../context/AuthContext";

import budgetService from "../../services/budgetService";
import DeleteModal from "../../components/modal/DeleteModal";

import "./Budget.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const STATUS_PILL = {
  "On Track": "pill pill-success",
  Warning: "pill pill-warning",
  "Over Budget": "pill pill-danger",
};

const BudgetList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const canWrite = role === "owner" || role === "admin";
  const canDelete = role === "owner";

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const res = await budgetService.getBudgets();
      setBudgets(res.budgets || []);
    } catch (error) {
      toast.error("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (budget) => {
    setDeleteTarget(budget);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await budgetService.deleteBudget(deleteTarget._id);
      toast.success("Budget deleted successfully");
      closeDeleteModal();
      loadBudgets();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ---------- Budget vs Actual chart, one bar-pair per site ----------

  const chartData = {
    labels: budgets.map((b) => b.site?.siteName || "—"),
    datasets: [
      {
        label: "Budget",
        data: budgets.map((b) => b.totalBudget || 0),
        backgroundColor: "rgba(124, 58, 237, 0.55)", // var(--orange), the violet accent
        borderRadius: 6,
      },
      {
        label: "Actual",
        data: budgets.map((b) => b.actualExpense || 0),
        backgroundColor: "rgba(236, 72, 153, 0.6)", // var(--amber), the pink accent
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${(value / 1000).toFixed(0)}k`,
        },
      },
    },
  };

  return (
    <div className="page fade-up">
      <div className="page-header">
        <div>
          <h2>Site Budgets</h2>
          <p>Budget vs. actual spend, per site.</p>
        </div>

        {canWrite && (
          <button
            className="btn-accent"
            onClick={() => navigate(`/${role}/budgets/create`)}
          >
            <FaPlus /> New Budget
          </button>
        )}
      </div>

      {!loading && budgets.length > 0 && (
        <div className="card budget-chart-card pop-in">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Site</th>
              <th>Total Budget</th>
              <th>Actual Expense</th>
              <th>Remaining</th>
              <th>Utilization</th>
              <th>Status</th>
              {(canWrite || canDelete) && <th></th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="table-empty">
                  <span className="spinner" /> Loading...
                </td>
              </tr>
            ) : budgets.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty">
                  No budgets set yet.
                </td>
              </tr>
            ) : (
              budgets.map((b) => (
                <tr key={b._id}>
                  <td>{b.site?.siteName || "—"}</td>
                  <td>
                    ₹ {Number(b.totalBudget || 0).toLocaleString("en-IN")}
                  </td>
                  <td>
                    ₹ {Number(b.actualExpense || 0).toLocaleString("en-IN")}
                  </td>
                  <td
                    className={b.remainingBudget < 0 ? "budget-negative" : ""}
                  >
                    ₹ {Number(b.remainingBudget || 0).toLocaleString("en-IN")}
                  </td>
                  <td>{Number(b.utilizationPercentage || 0).toFixed(1)}%</td>
                  <td>
                    <span className={STATUS_PILL[b.status] || "pill"}>
                      {b.status}
                    </span>
                  </td>
                  {(canWrite || canDelete) && (
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        {canWrite && (
                          <button
                            className="lb-icon-btn"
                            title="Edit"
                            onClick={() =>
                              navigate(`/${role}/budgets/edit/${b._id}`)
                            }
                          >
                            <FaEdit />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            className="lb-icon-btn danger"
                            title="Delete"
                            onClick={() => openDeleteModal(b)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DeleteModal
        isOpen={deleteModal}
        title="Delete Budget"
        message={`Delete the budget for ${deleteTarget?.site?.siteName || "this site"}? This cannot be undone.`}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default BudgetList;
