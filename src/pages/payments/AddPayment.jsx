import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import invoiceService from "../../services/invoiceService";
import paymentService from "../../services/paymentService";

import "./Payment.css";

const AddPayment = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    invoice: "",
    client: "",
    amount: "",
    paymentMethod: "Cash",
    transactionId: "",
    remarks: "",
  });

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const res = await invoiceService.getInvoices();

      setInvoices(res.invoices || []);
    } catch (error) {
      toast.error("Failed to load invoices");
    }
  };

  const handleInvoiceChange = (e) => {
    const invoiceId = e.target.value;

    const selectedInvoice = invoices.find((inv) => inv._id === invoiceId);

    setFormData({
      ...formData,
      invoice: invoiceId,
      client: selectedInvoice?.client?._id || "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.invoice || !formData.amount) {
      return toast.error("Please select an invoice and enter amount");
    }

    try {
      setLoading(true);

      await paymentService.createPayment(formData);

      toast.success("Payment Added Successfully");

      navigate(`/${role}/payments`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add payment"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form-page">

      <div className="payment-form-card">

        <h2>Add Payment</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group full-width">
              <label>Invoice</label>
              <select
                name="invoice"
                value={formData.invoice}
                onChange={handleInvoiceChange}
                required
              >
                <option value="">Select Invoice</option>
                {invoices.map((inv) => (
                  <option key={inv._id} value={inv._id}>
                    {inv.invoiceNumber} - {inv.client?.clientName} (₹{inv.grandTotal})
                  </option>
                ))}
              </select>
            </div>

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

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : "Save Payment"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default AddPayment;