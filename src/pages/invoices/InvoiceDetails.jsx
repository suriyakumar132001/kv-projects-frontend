import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import invoiceService from "../../services/invoiceService";

import "./Invoice.css";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailing, setEmailing] = useState(false);

  useEffect(() => {
    loadInvoice();
  }, []);

  const loadInvoice = async () => {
    try {
      const res = await invoiceService.getInvoice(id);
      setInvoice(res.invoice);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load invoice");
      navigate(`/${role}/invoices`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await invoiceService.updatePaymentStatus(id, newStatus);
      toast.success("Payment Status Updated");
      loadInvoice();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailInvoice = async () => {
    try {
      setEmailing(true);
      await invoiceService.sendInvoiceEmail(id);
      toast.success("Invoice emailed to client successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send email");
    } finally {
      setEmailing(false);
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (!invoice) return <h2>Invoice not found</h2>;

  return (
    <div className="invoice-form-page">
      <div className="details-card">
        <h2>Invoice Details</h2>

        <div className="details-grid">
          <div>
            <label>Invoice Number</label>
            <p>{invoice.invoiceNumber}</p>
          </div>
          <div>
            <label>Client</label>
            <p>{invoice.client?.clientName || "-"}</p>
          </div>
          <div>
            <label>Project</label>
            <p>{invoice.projectName}</p>
          </div>
          <div>
            <label>Invoice Date</label>
            <p>{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
          </div>
          <div>
            <label>Due Date</label>
            <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
          <div>
            <label>Payment Status</label>
            <p>{invoice.paymentStatus}</p>
          </div>
          <div>
            <label>Subtotal</label>
            <p>₹ {Number(invoice.subtotal || 0).toLocaleString()}</p>
          </div>
          <div>
            <label>Tax</label>
            <p>₹ {Number(invoice.tax || 0).toLocaleString()}</p>
          </div>
          <div>
            <label>Discount</label>
            <p>₹ {Number(invoice.discount || 0).toLocaleString()}</p>
          </div>
          <div className="full-width">
            <label>Remarks</label>
            <p>{invoice.remarks || "No Remarks"}</p>
          </div>
        </div>

        <div className="summary-box">
          <strong>Grand Total</strong>
          <h2>₹ {Number(invoice.grandTotal || 0).toLocaleString()}</h2>
        </div>

        <div className="form-group" style={{ marginTop: "20px" }}>
          <label>Update Payment Status</label>
          <select
            value={invoice.paymentStatus}
            onChange={(e) => handleStatusUpdate(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
            <option value="Paid">Paid</option>
          </select>
        </div>

        <div className="invoice-actions">
          <button
            className="back-btn"
            onClick={() => navigate(`/${role}/invoices`)}
          >
            Back
          </button>

          <button className="print-btn" onClick={handlePrint}>
            Print Invoice
          </button>

          <button
            className="email-btn"
            onClick={handleEmailInvoice}
            disabled={emailing}
          >
            {emailing ? "Sending..." : "Email Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
