import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import siteService from "../../services/siteService";
import budgetService from "../../services/budgetService";

import "./Budget.css";

const EditBudget = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    site: "",
    materialBudget: "",
    labourBudget: "",
    equipmentBudget: "",
    miscellaneousBudget: "",
    actualExpense: "",
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [siteRes, budgetRes] = await Promise.all([
        siteService.getSites(),
        budgetService.getBudget(id),
      ]);
      setSites(siteRes.sites || []);

      const b = budgetRes.budget;
      setForm({
        site: b.site?._id || b.site,
        materialBudget: b.materialBudget ?? "",
        labourBudget: b.labourBudget ?? "",
        equipmentBudget: b.equipmentBudget ?? "",
        miscellaneousBudget: b.miscellaneousBudget ?? "",
        actualExpense: b.actualExpense ?? "",
      });
    } catch (error) {
      toast.error("Failed to load budget");
    } finally {
      setLoading(false);
    }
  };

  const num = (val) => Number(val) || 0;

  const totalBudget =
    num(form.materialBudget) +
    num(form.labourBudget) +
    num(form.equipmentBudget) +
    num(form.miscellaneousBudget);

  const actualExpense = num(form.actualExpense);
  const remainingBudget = totalBudget - actualExpense;
  const utilizationPercentage =
    totalBudget > 0 ? (actualExpense / totalBudget) * 100 : 0;
  const status =
    utilizationPercentage >= 100
      ? "Over Budget"
      : utilizationPercentage >= 80
        ? "Warning"
        : "On Track";

  const STATUS_PILL = {
    "On Track": "pill pill-success",
    Warning: "pill pill-warning",
    "Over Budget": "pill pill-danger",
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.site) {
      return toast.error("Please select a site");
    }
    if (totalBudget <= 0) {
      return toast.error(
        "Total budget must be greater than zero — enter at least one category amount",
      );
    }

    try {
      setSaving(true);
      await budgetService.updateBudget(id, {
        site: form.site,
        materialBudget: num(form.materialBudget),
        labourBudget: num(form.labourBudget),
        equipmentBudget: num(form.equipmentBudget),
        miscellaneousBudget: num(form.miscellaneousBudget),
        totalBudget,
        actualExpense,
      });

      toast.success("Budget updated successfully");
      navigate(`/${role}/budgets`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update budget");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page fade-up">
        <span className="spinner" /> Loading...
      </div>
    );
  }

  return (
    <div className="page fade-up">
      <div className="page-header">
        <div>
          <h2>Edit Site Budget</h2>
          <p>Update category budgets — the total and status recalculate.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <div className="form-grid">
            <div className="form-row">
              <label>Site *</label>
              <select
                value={form.site}
                onChange={(e) => handleChange("site", e.target.value)}
              >
                <option value="">Select site</option>
                {sites.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.siteName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Material Budget (₹)</label>
              <input
                type="number"
                min="0"
                value={form.materialBudget}
                onChange={(e) => handleChange("materialBudget", e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Labour Budget (₹)</label>
              <input
                type="number"
                min="0"
                value={form.labourBudget}
                onChange={(e) => handleChange("labourBudget", e.target.value)}
              />
            </div>

            <div className="form-row">
              <label>Equipment Budget (₹)</label>
              <input
                type="number"
                min="0"
                value={form.equipmentBudget}
                onChange={(e) =>
                  handleChange("equipmentBudget", e.target.value)
                }
              />
            </div>

            <div className="form-row">
              <label>Miscellaneous Budget (₹)</label>
              <input
                type="number"
                min="0"
                value={form.miscellaneousBudget}
                onChange={(e) =>
                  handleChange("miscellaneousBudget", e.target.value)
                }
              />
            </div>

            <div className="form-row">
              <label>Actual Expense So Far (₹)</label>
              <input
                type="number"
                min="0"
                value={form.actualExpense}
                onChange={(e) => handleChange("actualExpense", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card budget-preview-card">
          <div className="budget-preview-item">
            <span>Total Budget</span>
            <strong>₹ {totalBudget.toLocaleString("en-IN")}</strong>
          </div>
          <div className="budget-preview-item">
            <span>Remaining Budget</span>
            <strong className={remainingBudget < 0 ? "budget-negative" : ""}>
              ₹ {remainingBudget.toLocaleString("en-IN")}
            </strong>
          </div>
          <div className="budget-preview-item">
            <span>Utilization</span>
            <strong>{utilizationPercentage.toFixed(1)}%</strong>
          </div>
          <div className="budget-preview-item">
            <span>Status</span>
            <span className={STATUS_PILL[status]}>{status}</span>
          </div>
        </div>

        <div className="lb-actions">
          <button type="submit" className="btn-accent" disabled={saving}>
            {saving ? "Saving..." : "Update Budget"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBudget;
