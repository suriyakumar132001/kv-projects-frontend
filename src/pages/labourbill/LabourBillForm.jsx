import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

import vendorService from "../../services/vendorService";
import siteService from "../../services/siteService";
import labourBillService from "../../services/labourBillService";

import "./LabourBill.css";

const STANDARD_HOURS_PER_DAY = 8;

// "08:00" -> 8.5 style decimal hours, so the preview math is trivial.
// Handles an overnight shift too (out time earlier than in time = next day).
const timeToHours = (time) => {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
};

const computeTotalHours = (inTime, outTime) => {
  const start = timeToHours(inTime);
  const end = timeToHours(outTime);
  if (!inTime || !outTime) return 0;
  const diff = end - start;
  return Number((diff >= 0 ? diff : diff + 24).toFixed(2));
};

let rowIdCounter = 0;
const newRow = (date) => ({
  _key: `row-${rowIdCounter++}`,
  date,
  masonCount: 0,
  helperCount: 0,
  inTime: "08:00",
  outTime: "20:00",
  breakHours: 1,
  remarks: "",
});

const LabourBillForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [activeTab, setActiveTab] = useState("breakup");
  const [loading, setLoading] = useState(false);

  const [vendors, setVendors] = useState([]);
  const [sites, setSites] = useState([]);

  const [header, setHeader] = useState({
    subcontractor: "",
    site: "",
    scopeOfWork: "NMR",
    from: "",
    to: "",
  });

  const [rows, setRows] = useState([newRow("")]);

  // Rates + previous-bill quantities are the only things a human needs to
  // type on the Abstract tab — everything else is computed from `rows`.
  const [items, setItems] = useState([
    {
      itemName: "MASON",
      uom: "M/days",
      unitRate: "",
      previousBillQty: 0,
      remarks: "",
    },
    {
      itemName: "HELPER",
      uom: "M/days",
      unitRate: "",
      previousBillQty: 0,
      remarks: "",
    },
  ]);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [vendorRes, siteRes] = await Promise.all([
        vendorService.getVendors(),
        siteService.getSites(),
      ]);
      setVendors(vendorRes.vendors || []);
      setSites(siteRes.sites || []);
    } catch (error) {
      toast.error("Failed to load subcontractors / sites");
    }
  };

  // ---------- Row helpers ----------

  const updateRow = (key, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r._key === key ? { ...r, [field]: value } : r)),
    );
  };

  const addRow = () => {
    const lastDate = rows[rows.length - 1]?.date || header.from || "";
    setRows((prev) => [...prev, newRow(lastDate)]);
  };

  const removeRow = (key) => {
    setRows((prev) => prev.filter((r) => r._key !== key));
  };

  // ---------- Live preview totals (server recalculates authoritatively) ----------

  const enrichedRows = useMemo(
    () =>
      rows.map((r) => {
        const totalHours = computeTotalHours(r.inTime, r.outTime);
        const netHours = Math.max(totalHours - Number(r.breakHours || 0), 0);
        return {
          ...r,
          totalHours,
          netHours,
          masonManHours: Number(r.masonCount || 0) * netHours,
          helperManHours: Number(r.helperCount || 0) * netHours,
        };
      }),
    [rows],
  );

  const tradeTotals = useMemo(() => {
    const totals = { MASON: 0, HELPER: 0 };
    enrichedRows.forEach((r) => {
      totals.MASON += r.masonManHours;
      totals.HELPER += r.helperManHours;
    });
    return totals;
  }, [enrichedRows]);

  const previewItems = useMemo(
    () =>
      items.map((item) => {
        const manHours = tradeTotals[item.itemName] || 0;
        const thisBillQty = Number(
          (manHours / STANDARD_HOURS_PER_DAY).toFixed(3),
        );
        const billValue = Number(
          (thisBillQty * (Number(item.unitRate) || 0)).toFixed(2),
        );
        return { ...item, thisBillQty, billValue };
      }),
    [items, tradeTotals],
  );

  const grandTotal = previewItems.reduce((sum, i) => sum + i.billValue, 0);

  // ---------- Submit ----------

  const groupRowsByDate = () => {
    const byDate = {};
    enrichedRows.forEach((r) => {
      if (!r.date) return;
      if (!byDate[r.date]) byDate[r.date] = [];
      byDate[r.date].push({
        masonCount: Number(r.masonCount) || 0,
        helperCount: Number(r.helperCount) || 0,
        inTime: r.inTime,
        outTime: r.outTime,
        totalHours: r.totalHours,
        breakHours: Number(r.breakHours) || 0,
        remarks: r.remarks,
      });
    });

    return Object.entries(byDate)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, dateRows], idx) => ({
        slNo: idx + 1,
        date,
        rows: dateRows,
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!header.subcontractor || !header.site || !header.from || !header.to) {
      return toast.error("Please fill subcontractor, site and bill period");
    }
    if (rows.some((r) => !r.date)) {
      return toast.error("Every timesheet row needs a date");
    }

    try {
      setLoading(true);

      await labourBillService.createLabourBill({
        subcontractor: header.subcontractor,
        site: header.site,
        scopeOfWork: header.scopeOfWork,
        billPeriod: { from: header.from, to: header.to },
        dailyEntries: groupRowsByDate(),
        items: items.map((item, idx) => ({
          slNo: idx + 1,
          itemName: item.itemName,
          uom: item.uom,
          unitRate: Number(item.unitRate) || 0,
          previousBillQty: Number(item.previousBillQty) || 0,
          remarks: item.remarks,
        })),
      });

      toast.success("Labour bill created successfully");
      navigate(`/${role}/labour-bills`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page fade-up">
      <div className="page-header">
        <div>
          <h2>New Labour Bill</h2>
          <p>Enter the daily timesheet — the abstract totals itself.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ---------- Header ---------- */}
        <div className="card lb-header-card">
          <div className="form-grid">
            <div className="form-row">
              <label>Subcontractor *</label>
              <select
                value={header.subcontractor}
                onChange={(e) =>
                  setHeader({ ...header, subcontractor: e.target.value })
                }
              >
                <option value="">Select subcontractor</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.vendorName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Site *</label>
              <select
                value={header.site}
                onChange={(e) => setHeader({ ...header, site: e.target.value })}
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
              <label>Scope of Work</label>
              <input
                type="text"
                value={header.scopeOfWork}
                onChange={(e) =>
                  setHeader({ ...header, scopeOfWork: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Bill Period From *</label>
              <input
                type="date"
                value={header.from}
                onChange={(e) => setHeader({ ...header, from: e.target.value })}
              />
            </div>

            <div className="form-row">
              <label>Bill Period To *</label>
              <input
                type="date"
                value={header.to}
                onChange={(e) => setHeader({ ...header, to: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* ---------- Tabs ---------- */}
        <div className="lb-tabs">
          <button
            type="button"
            className={activeTab === "breakup" ? "lb-tab active" : "lb-tab"}
            onClick={() => setActiveTab("breakup")}
          >
            Break-up (daily timesheet)
          </button>
          <button
            type="button"
            className={activeTab === "abstract" ? "lb-tab active" : "lb-tab"}
            onClick={() => setActiveTab("abstract")}
          >
            Abstract (auto-computed)
          </button>
        </div>

        {/* ---------- Break-up tab ---------- */}
        {activeTab === "breakup" && (
          <div className="table-wrap pop-in">
            <table className="data-table lb-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Mason</th>
                  <th>Helper</th>
                  <th>In</th>
                  <th>Out</th>
                  <th>Break (hrs)</th>
                  <th>Net hrs</th>
                  <th>Remarks</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {enrichedRows.map((r) => (
                  <tr key={r._key}>
                    <td>
                      <input
                        type="date"
                        value={r.date}
                        onChange={(e) =>
                          updateRow(r._key, "date", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        className="lb-num"
                        value={r.masonCount}
                        onChange={(e) =>
                          updateRow(r._key, "masonCount", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        className="lb-num"
                        value={r.helperCount}
                        onChange={(e) =>
                          updateRow(r._key, "helperCount", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        value={r.inTime}
                        onChange={(e) =>
                          updateRow(r._key, "inTime", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        value={r.outTime}
                        onChange={(e) =>
                          updateRow(r._key, "outTime", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        className="lb-num"
                        value={r.breakHours}
                        onChange={(e) =>
                          updateRow(r._key, "breakHours", e.target.value)
                        }
                      />
                    </td>
                    <td className="lb-readonly">{r.netHours.toFixed(2)}</td>
                    <td>
                      <input
                        type="text"
                        placeholder="e.g. Curing, Housekeeping"
                        value={r.remarks}
                        onChange={(e) =>
                          updateRow(r._key, "remarks", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="lb-icon-btn danger"
                        onClick={() => removeRow(r._key)}
                        aria-label="Remove row"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {rows.length === 0 && (
              <div className="table-empty">No timesheet rows yet.</div>
            )}

            <button
              type="button"
              className="btn-secondary lb-add-btn"
              onClick={addRow}
            >
              <FaPlus /> Add row
            </button>
          </div>
        )}

        {/* ---------- Abstract tab ---------- */}
        {activeTab === "abstract" && (
          <div className="table-wrap pop-in">
            <table className="data-table lb-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>UOM</th>
                  <th>Unit Rate (₹)</th>
                  <th>Previous Bill Qty</th>
                  <th>This Bill Qty</th>
                  <th>Bill Value (₹)</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {previewItems.map((item, idx) => (
                  <tr key={item.itemName}>
                    <td>{item.itemName}</td>
                    <td>{item.uom}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        className="lb-num"
                        value={item.unitRate}
                        onChange={(e) => {
                          const next = [...items];
                          next[idx].unitRate = e.target.value;
                          setItems(next);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        className="lb-num"
                        value={item.previousBillQty}
                        onChange={(e) => {
                          const next = [...items];
                          next[idx].previousBillQty = e.target.value;
                          setItems(next);
                        }}
                      />
                    </td>
                    <td className="lb-readonly">{item.thisBillQty}</td>
                    <td className="lb-readonly lb-strong">
                      {item.billValue.toLocaleString("en-IN")}
                    </td>
                    <td>
                      <input
                        type="text"
                        value={item.remarks}
                        onChange={(e) => {
                          const next = [...items];
                          next[idx].remarks = e.target.value;
                          setItems(next);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="lb-grand-total-row">
                  <td colSpan={5}>GRAND TOTAL</td>
                  <td colSpan={2}>₹ {grandTotal.toLocaleString("en-IN")}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <div className="lb-actions">
          <button type="submit" className="btn-accent" disabled={loading}>
            {loading ? "Saving..." : "Save Labour Bill"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LabourBillForm;
