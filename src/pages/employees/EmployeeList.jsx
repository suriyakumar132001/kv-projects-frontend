import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import employeeService from "../../services/employeeService";

import EmployeeToolbar from "../../components/employee/EmployeeToolbar";
import EmployeeTable from "../../components/employee/EmployeeTable";
import DeleteModal from "../../components/modal/DeleteModal";
import Pagination from "../../components/common/Pagination";

import "./Employee.css";

const EmployeeList = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadEmployees(1);
  }, []);

  const loadEmployees = async (currentPage = page) => {
    try {
      setLoading(true);

      const res = await employeeService.getEmployees({
        page: currentPage,
        limit: 10,
        search,
        department,
        status,
      });

      setEmployees(res.employees || []);
      setPage(res.page || 1);
      setTotalPages(res.pages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setSearch(value);

    try {
      const res = await employeeService.getEmployees({
        page: 1,
        limit: 10,
        search: value,
        department,
        status,
      });

      setEmployees(res.employees || []);
      setPage(res.page || 1);
      setTotalPages(res.pages || 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDepartmentChange = async (value) => {
    setDepartment(value);

    try {
      const res = await employeeService.getEmployees({
        page: 1,
        limit: 10,
        search,
        department: value,
        status,
      });

      setEmployees(res.employees || []);
      setPage(res.page || 1);
      setTotalPages(res.pages || 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (value) => {
    setStatus(value);

    try {
      const res = await employeeService.getEmployees({
        page: 1,
        limit: 10,
        search,
        department,
        status: value,
      });

      setEmployees(res.employees || []);
      setPage(res.page || 1);
      setTotalPages(res.pages || 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (newPage) => {
    loadEmployees(newPage);
  };

  const openDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedEmployee(null);
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;

    try {
      setDeleteLoading(true);

      await employeeService.deleteEmployee(selectedEmployee._id);

      toast.success("Employee deleted successfully");

      closeDeleteModal();

      loadEmployees(page);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading Employees...</h2>;
  }

  return (
    <div className="employee-page">

      <EmployeeToolbar
        search={search}
        setSearch={setSearch}
        department={department}
        setDepartment={handleDepartmentChange}
        status={status}
        setStatus={handleStatusChange}
        onSearch={handleSearch}
        onAddEmployee={() => navigate("/owner/employees/add")}
      />

      <EmployeeTable
        employees={employees}
        onView={(emp) =>
          navigate(`/owner/employees/view/${emp._id}`)
        }
        onEdit={(emp) =>
          navigate(`/owner/employees/edit/${emp._id}`)
        }
        onDelete={(emp) => openDeleteModal(emp)}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <DeleteModal
        isOpen={deleteModal}
        title="Delete Employee"
        message={`Are you sure you want to delete ${
          selectedEmployee?.name || "this employee"
        }?`}
        loading={deleteLoading}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default EmployeeList;