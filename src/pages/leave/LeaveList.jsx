import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import leaveService from "../../services/leaveService";

import LeaveToolbar from "../../components/leave/LeaveToolbar";
import LeaveTable from "../../components/leave/LeaveTable";
import DeleteModal from "../../components/modal/DeleteModal";

import "./Leave.css";

const LeaveList = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [leaveType, setLeaveType] = useState("");

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadLeaves();
  }, []);

  // ===============================
  // Load Leaves
  // ===============================
  const loadLeaves = async () => {
    try {
      setLoading(true);

      const res = await leaveService.getLeaves({
        page: 1,
        limit: 10,
        search,
        status,
        leaveType,
      });

      setLeaves(res.leaves || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load leave records");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Search
  // ===============================
  const handleSearch = async (value) => {
    try {
      setSearch(value);

      const res = await leaveService.getLeaves({
        page: 1,
        limit: 10,
        search: value,
        status,
        leaveType,
      });

      setLeaves(res.leaves || []);
    } catch (error) {
      console.error(error);
      toast.error("Search failed");
    }
  };

  // ===============================
  // Status Filter
  // ===============================
  const handleStatus = async (value) => {
    try {
      setStatus(value);

      const res = await leaveService.getLeaves({
        page: 1,
        limit: 10,
        search,
        status: value,
        leaveType,
      });

      setLeaves(res.leaves || []);
    } catch (error) {
      console.error(error);
      toast.error("Filter failed");
    }
  };

  // ===============================
  // Leave Type Filter
  // ===============================
  const handleType = async (value) => {
    try {
      setLeaveType(value);

      const res = await leaveService.getLeaves({
        page: 1,
        limit: 10,
        search,
        status,
        leaveType: value,
      });

      setLeaves(res.leaves || []);
    } catch (error) {
      console.error(error);
      toast.error("Filter failed");
    }
  };

  // ===============================
  // Delete Modal
  // ===============================
  const openDeleteModal = (leave) => {
    setSelectedLeave(leave);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedLeave(null);
  };

  // ===============================
  // Delete Leave
  // ===============================
  const handleDelete = async () => {
    if (!selectedLeave) return;

    try {
      setDeleteLoading(true);

      await leaveService.deleteLeave(selectedLeave._id);

      toast.success("Leave deleted successfully");

      closeDeleteModal();
      loadLeaves();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ===============================
  // Approve Leave
  // ===============================
  const handleApprove = async (leave) => {
    try {
      await leaveService.approveLeave(leave._id);

      toast.success("Leave approved successfully");

      loadLeaves();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Approval failed"
      );
    }
  };

  // ===============================
  // Reject Leave
  // ===============================
  const handleReject = async (leave) => {
    try {
      await leaveService.rejectLeave(leave._id);

      toast.success("Leave rejected successfully");

      loadLeaves();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Reject failed"
      );
    }
  };

  if (loading) {
    return <h2>Loading Leave Records...</h2>;
  }

  return (
    <div className="leave-page">
      <LeaveToolbar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={handleStatus}
        leaveType={leaveType}
        setLeaveType={handleType}
        onSearch={handleSearch}
        onRefresh={loadLeaves}
        onApplyLeave={() => navigate(`/${role}/leave/apply`)}
      />

      <LeaveTable
        leaves={leaves}
        onView={(leave) => navigate(`/${role}/leave/view/${leave._id}`)}
        onEdit={(leave) => navigate(`/${role}/leave/edit/${leave._id}`)}
        onDelete={openDeleteModal}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <DeleteModal
        isOpen={deleteModal}
        title="Delete Leave"
        message={`Are you sure you want to delete leave request for ${
          selectedLeave?.employee?.name || "this employee"
        }?`}
        loading={deleteLoading}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default LeaveList;