import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import essService from "../../services/essService";

import "../payroll/Payroll.css";

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
      const res = await essService.getMyPayslips();

      setPayslips(res.payslips || []);
    } catch (error) {
      toast.error("Failed to load your payslips");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payroll-page">
      <div className="payroll-header">
        <h2>My Payslips</h2>
      </div>

      <div className="table-wrapper">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Year</th>
              <th>Net Salary</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>Loading...</td>
              </tr>
            ) : payslips.length === 0 ? (
              <tr>
                <td colSpan={5}>No payslips generated yet.</td>
              </tr>
            ) : (
              payslips.map((p) => (
                <tr key={p._id}>
                  <td>{p.month}</td>
                  <td>{p.year}</td>
                  <td>₹ {p.netSalary}</td>
                  <td>
                    <span
                      className={
                        p.paymentStatus === "Paid"
                          ? "status-paid"
                          : "status-pending"
                      }
                    >
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(`/${role}/my-payslips/${p._id}`)
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