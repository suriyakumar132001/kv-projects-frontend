import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

import labourBillService from "../../services/labourBillService";
import DeleteModal from "../../components/modal/DeleteModal";

import "./LabourBill.css";

const STATUS_CLASS = {
  Draft: "pill pill-info",
  Submitted: "pill pill-warning",
  Approved: "pill pill-success",
  Paid: "pill pill-success",
  Rejected: "pill pill-danger",
};

const LabourBillList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const canDelete = role === "owner";

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const loadBills = async () => {
    try {
      setLoading(true);
      const res = await labourBillService.getLabourBills(
        status ? { status } : {},
      );
      setBills(res.bills || []);
    } catch (error) {
      toast.error("Failed to load labour bills");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (bill) => {
    setDeleteTarget(bill);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await labourBillService.deleteLabourBill(deleteTarget._id);
      toast.success("Labour bill deleted successfully");
      closeDeleteModal();
      loadBills();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page fade-up">
      <div className="page-header">
        <div>
          <h2>Labour Bills</h2>
          <p>Subcontractor NMR bills, computed from daily timesheets.</p>
        </div>

        <button
          className="btn-accent"
          onClick={() => navigate(`/${role}/labour-bills/create`)}
        >
          <FaPlus /> New Labour Bill
        </button>
      </div>

      <div className="card lb-header-card">
        <div className="form-row" style={{ maxWidth: 220 }}>
          <label>Filter by status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="Draft">Draft</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Paid">Paid</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Bill No.</th>
              <th>Subcontractor</th>
              <th>Site</th>
              <th>Period</th>
              <th>Grand Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="table-empty">
                  <span className="spinner" /> Loading...
                </td>
              </tr>
            ) : bills.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty">
                  No labour bills yet.
                </td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill.billNumber}</td>
                  <td>{bill.subcontractor?.vendorName || "—"}</td>
                  <td>{bill.site?.siteName || "—"}</td>
                  <td>
                    {new Date(bill.billPeriod?.from).toLocaleDateString(
                      "en-IN",
                    )}
                    {" – "}
                    {new Date(bill.billPeriod?.to).toLocaleDateString("en-IN")}
                  </td>
                  <td>
                    ₹ {Number(bill.grandTotal || 0).toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span className={STATUS_CLASS[bill.status] || "pill"}>
                      {bill.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      {/* No details/view page yet — bill data is fully
                          visible in this row for now. Say the word and
                          I'll add a LabourBillDetails page next, matching
                          InvoiceDetails.jsx's pattern. */}
                      {canDelete && (
                        <button
                          className="lb-icon-btn danger"
                          title="Delete"
                          onClick={() => openDeleteModal(bill)}
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DeleteModal
        isOpen={deleteModal}
        title="Delete Labour Bill"
        message={`Delete bill ${deleteTarget?.billNumber}? This cannot be undone.`}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default LabourBillList;
