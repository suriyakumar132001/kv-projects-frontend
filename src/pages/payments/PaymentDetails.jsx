import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import paymentService from "../../services/paymentService";

import "./Payment.css";

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayment();
  }, []);

  const loadPayment = async () => {
    try {
      const res = await paymentService.getPayment(id);

      setPayment(res.payment);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payment");

      navigate(`/${role}/payments`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!payment) {
    return <h2>Payment not found</h2>;
  }

  return (
    <div className="payment-form-page">

      <div className="details-card">

        <h2>Payment Details</h2>

        <div className="details-grid">

          <div>
            <label>Invoice Number</label>
            <p>{payment.invoice?.invoiceNumber || "-"}</p>
          </div>

          <div>
            <label>Client</label>
            <p>{payment.client?.clientName || "-"}</p>
          </div>

          <div>
            <label>Payment Date</label>
            <p>{new Date(payment.paymentDate).toLocaleDateString()}</p>
          </div>

          <div>
            <label>Amount</label>
            <p>₹ {Number(payment.amount || 0).toLocaleString()}</p>
          </div>

          <div>
            <label>Payment Method</label>
            <p>{payment.paymentMethod}</p>
          </div>

          <div>
            <label>Transaction ID</label>
            <p>{payment.transactionId || "-"}</p>
          </div>

          <div>
            <label>Recorded By</label>
            <p>{payment.createdBy?.name || "-"}</p>
          </div>

          <div className="full-width">
            <label>Remarks</label>
            <p>{payment.remarks || "No Remarks"}</p>
          </div>

        </div>

        <button
          className="back-btn"
          onClick={() => navigate(`/${role}/payments`)}
        >
          Back
        </button>

      </div>

    </div>
  );
};

export default PaymentDetails;