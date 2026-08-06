import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import invoiceService from "../../services/invoiceService";

import InvoiceToolbar from "../../components/invoice/InvoiceToolbar";
import InvoiceTable from "../../components/invoice/InvoiceTable";
import DeleteModal from "../../components/modal/DeleteModal";

import "./Invoice.css";

const InvoiceList = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const canDelete = role === "owner";

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);

      const res = await invoiceService.getInvoices();

      setInvoices(res.invoices || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (invoice) => {
    setDeleteTarget(invoice);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await invoiceService.deleteInvoice(deleteTarget._id);

      toast.success("Invoice Deleted Successfully");

      closeDeleteModal();
      loadInvoices();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete Failed"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredInvoices = invoices.filter((item) => {
    const searchMatch =
      item.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      item.projectName?.toLowerCase().includes(search.toLowerCase());

    const statusMatch = status ? item.paymentStatus === status : true;

    return searchMatch && statusMatch;
  });

  if (loading) {
    return <h2>Loading Invoices...</h2>;
  }

  return (
    <div className="invoice-page">

      <div className="invoice-header">
        <div>
          <h2>Invoices</h2>
          <p>Manage client invoices and payment status</p>
        </div>
      </div>

      <InvoiceToolbar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        onAddInvoice={() => navigate(`/${role}/invoices/create`)}
      />

      <InvoiceTable
        invoices={filteredInvoices}
        onView={(inv) => navigate(`/${role}/invoices/view/${inv._id}`)}
        onEdit={(inv) => navigate(`/${role}/invoices/edit/${inv._id}`)}
        onDelete={openDeleteModal}
        canDelete={canDelete}
      />

      <DeleteModal
        isOpen={deleteModal}
        title="Delete Invoice"
        message={`Are you sure you want to delete invoice ${
          deleteTarget?.invoiceNumber || ""
        }?`}
        loading={deleteLoading}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default InvoiceList;