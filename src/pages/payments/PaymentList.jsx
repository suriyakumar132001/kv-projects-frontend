import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import paymentService from "../../services/paymentService";

import PaymentToolbar from "../../components/payment/PaymentToolbar";
import PaymentTable from "../../components/payment/PaymentTable";
import DeleteModal from "../../components/modal/DeleteModal";

import "./Payment.css";

const PaymentList = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const canManage =
    role === "owner" || role === "admin" || role === "accountant";
  const canDelete = role === "owner";

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);

      const res = await paymentService.getPayments();

      setPayments(res.payments || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (payment) => {
    setDeleteTarget(payment);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await paymentService.deletePayment(deleteTarget._id);

      toast.success("Payment Deleted Successfully");

      closeDeleteModal();
      loadPayments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete Failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredPayments = payments.filter((item) => {
    const searchMatch =
      item.invoice?.invoiceNumber
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.client?.clientName?.toLowerCase().includes(search.toLowerCase());

    const methodMatch = method ? item.paymentMethod === method : true;

    return searchMatch && methodMatch;
  });

  if (loading) {
    return <h2>Loading Payments...</h2>;
  }

  return (
    <div className="payment-page">
      <div className="payment-header">
        <div>
          <h2>Payments</h2>
          <p>Track client payments against invoices</p>
        </div>
      </div>

      <PaymentToolbar
        search={search}
        setSearch={setSearch}
        method={method}
        setMethod={setMethod}
        onAddPayment={() => navigate(`/${role}/payments/add`)}
        canCreate={canManage}
      />

      <PaymentTable
        payments={filteredPayments}
        onView={(p) => navigate(`/${role}/payments/view/${p._id}`)}
        onEdit={(p) => navigate(`/${role}/payments/edit/${p._id}`)}
        onDelete={openDeleteModal}
        canEdit={canManage}
        canDelete={canDelete}
      />

      <DeleteModal
        isOpen={deleteModal}
        title="Delete Payment"
        message="Are you sure you want to delete this payment record?"
        loading={deleteLoading}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default PaymentList;
