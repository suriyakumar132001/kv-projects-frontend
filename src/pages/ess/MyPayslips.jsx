import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import essService from "../../services/essService";

import "./Ess.css";

const STATUS_PILL = {
  Paid: "pill pill-success",
  Pending: "pill pill-warning",
};

const MyPayslips = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayslips();
  }, []);

  const loadPayslips = async () => {
    try {
      setLoading(true);
      const res = await essService.getMyPayslips();
      setPayslips(res.payslips || []);
    } catch (error) {
      toast.error("Failed to load your payslips");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page fade-up">
      <div className="page-header">
        <div>
          <h2>My Payslips</h2>
          <p>Your salary history, most recent first.</p>
        </div>

        <button
          type="button"
          className="lb-icon-btn"
          onClick={() => navigate(`/${role}/my-profile`)}
        >
          Back to My Profile
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Year</th>
              <th>Basic Salary</th>
              <th>Net Salary</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  <span className="spinner" /> Loading...
                </td>
              </tr>
            ) : payslips.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  No payslips available yet.
                </td>
              </tr>
            ) : (
              payslips.map((p) => (
                <tr key={p._id}>
                  <td>{p.month}</td>
                  <td>{p.year}</td>
                  <td>
                    ₹ {Number(p.basicSalary || 0).toLocaleString("en-IN")}
                  </td>
                  <td>₹ {Number(p.netSalary || 0).toLocaleString("en-IN")}</td>
                  <td>
                    <span className={STATUS_PILL[p.paymentStatus] || "pill"}>
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      className="lb-icon-btn"
                      title="View"
                      onClick={() =>
                        navigate(`/${role}/my-payslips/view/${p._id}`)
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPayslips;
