import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import clientService from "../../services/clientService";
import invoiceService from "../../services/invoiceService";

import "./Invoice.css";

const CreateInvoice = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    invoiceNumber: "",
    client: "",
    projectName: "",
    dueDate: "",
    subtotal: "",
    tax: "",
    discount: "",
    remarks: "",
  });

  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    const total =
      Number(formData.subtotal || 0) +
      Number(formData.tax || 0) -
      Number(formData.discount || 0);

    setGrandTotal(total > 0 ? total : 0);
  }, [formData.subtotal, formData.tax, formData.discount]);

  const loadClients = async () => {
    try {
      const res = await clientService.getClients();

      setClients(res.clients || []);
    } catch (error) {
      toast.error("Failed to load clients");
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

    if (!formData.invoiceNumber || !formData.client || !formData.projectName || !formData.dueDate || !formData.subtotal) {
      return toast.error("Please fill all required fields");
    }

    try {
      setLoading(true);

      await invoiceService.createInvoice({
        ...formData,
        grandTotal,
      });

      toast.success("Invoice Created Successfully");

      navigate(`/${role}/invoices`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create invoice"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invoice-form-page">

      <div className="invoice-form-card">

        <h2>Create Invoice</h2>

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

            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Invoice"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateInvoice;