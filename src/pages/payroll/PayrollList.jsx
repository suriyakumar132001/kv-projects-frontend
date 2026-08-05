import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import payrollService from "../../services/payrollService";

import PayrollToolbar from "../../components/payroll/PayrollToolbar";
import PayrollTable from "../../components/payroll/PayrollTable";
import DeleteModal from "../../components/modal/DeleteModal";

import "./Payroll.css";

const PayrollList = () => {
  const navigate = useNavigate();

  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadPayrolls = async () => {
    try {
      setLoading(true);

      const res = await payrollService.getPayrolls();

      setPayrolls(res.payrolls || []);
    } catch (error) {
      toast.error("Failed to load payrolls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayrolls();
  }, []);

  const openDeleteModal = (payroll) => {
    setSelectedPayroll(payroll);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedPayroll(null);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await payrollService.deletePayroll(selectedPayroll._id);

      toast.success("Payroll Deleted Successfully");

      closeDeleteModal();
      loadPayrolls();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete Failed"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleMarkPaid = async (payroll) => {
    try {
      await payrollService.markAsPaid(payroll._id);

      toast.success("Salary Marked as Paid");

      loadPayrolls();
    } catch (error) {
      toast.error("Failed to mark salary as paid");
    }
  };

  if (loading) {
    return <h2>Loading Payroll Records...</h2>;
  }

  return (
    <div className="payroll-page">

      <div className="payroll-header">
        <div>
          <h2>Payroll Management</h2>
          <p>Manage employee salary records</p>
        </div>
      </div>

      <PayrollToolbar
        onRefresh={loadPayrolls}
        onGenerate={() => navigate("/owner/payroll/generate")}
      />

      <PayrollTable
        payrolls={payrolls}
        onView={(payroll) =>
          navigate(`/owner/payroll/view/${payroll._id}`)
        }
        onEdit={(payroll) =>
          navigate(`/owner/payroll/edit/${payroll._id}`)
        }
        onDelete={openDeleteModal}
        onPay={handleMarkPaid}
      />

      <DeleteModal
        isOpen={deleteModal}
        title="Delete Payroll"
        message={`Delete payroll for ${
          selectedPayroll?.employee?.name || ""
        }?`}
        loading={deleteLoading}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default PayrollList;