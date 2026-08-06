import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import clientService from "../../services/clientService";
import invoiceService from "../../services/invoiceService";

import "./Invoice.css";

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    client: "",
    projectName: "",
    dueDate: "",
    subtotal: "",
    tax: "",
    discount: "",
    paymentStatus: "Pending",
    remarks: "",
  });

  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const total =
      Number(formData.subtotal || 0) +
      Number(formData.tax || 0) -
      Number(formData.discount || 0);

    setGrandTotal(total > 0 ? total : 0);
  }, [formData.subtotal, formData.tax, formData.discount]);

  const loadData = async () => {
    try {
      const [clientRes, invoiceRes] = await Promise.all([
        clientService.getClients(),
        invoiceService.getInvoice(id),
      ]);

      setClients(clientRes.clients || []);

      const invoice = invoiceRes.invoice;

      setFormData({
        invoiceNumber: invoice.invoiceNumber || "",
        client: invoice.client?._id || "",
        projectName: invoice.projectName || "",
        dueDate: invoice.dueDate ? invoice.dueDate.substring(0, 10) : "",
        subtotal: invoice.subtotal || "",
        tax: invoice.tax || "",
        discount: invoice.discount || "",
        paymentStatus: invoice.paymentStatus || "Pending",
        remarks: invoice.remarks || "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load invoice");
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

      await invoiceService.updateInvoice(id, {
        ...formData,
        grandTotal,
      });

      toast.success("Invoice Updated Successfully");

      navigate(`/${role}/invoices`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <h2>Loading Invoice...</h2>;
  }

  return (
    <div className="invoice-form-page">

      <div className="invoice-form-card">

        <h2>Edit Invoice</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Invoice Number</label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Client</label>
              <select
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
              >
                <option value="">Select Client</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.clientName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Subtotal</label>
              <input
                type="number"
                name="subtotal"
                value={formData.subtotal}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Tax</label>
              <input
                type="number"
                name="tax"
                value={formData.tax}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Discount</label>
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Payment Status</label>
              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
              </select>
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

          <div className="summary-box">
            <strong>Grand Total</strong>
            <h2>₹ {grandTotal.toLocaleString("en-IN")}</h2>
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/${role}/invoices`)}
            >
              Cancel
            </button>

            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? "Updating..." : "Update Invoice"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default EditInvoice;