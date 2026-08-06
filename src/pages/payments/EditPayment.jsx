import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import paymentService from "../../services/paymentService";

import "./Payment.css";

const EditPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "Cash",
    transactionId: "",
    remarks: "",
  });

  useEffect(() => {
    loadPayment();
  }, []);

  const loadPayment = async () => {
    try {
      const res = await paymentService.getPayment(id);

      const payment = res.payment;

      setFormData({
        amount: payment.amount || "",
        paymentMethod: payment.paymentMethod || "Cash",
        transactionId: payment.transactionId || "",
        remarks: payment.remarks || "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payment");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await paymentService.updatePayment(id, formData);

      toast.success("Payment Updated Successfully");

      navigate(`/${role}/payments`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <h2>Loading Payment...</h2>;
  }

  return (
    <div className="payment-form-page">

      <div className="payment-form-card">

        <h2>Edit Payment</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            <div className="form-group">
              <label>Transaction ID</label>
              <input
                type="text"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Remarks</label>
              <textarea
                rows="3"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/${role}/payments`)}
            >
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? "Updating..." : "Update Payment"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default EditPayment;