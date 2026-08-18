import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import employeeService from "../../services/employeeService";
import EmployeeForm from "../../components/employee/EmployeeForm";

import "./Employee.css";

const AddEmployee = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [loading, setLoading] = useState(false);
  const [pendingFaceDescriptor, setPendingFaceDescriptor] = useState(null);

  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: "",
    joiningDate: "",
    status: "Active",
    address: "",
    emergencyContact: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        faceDescriptor: pendingFaceDescriptor,
      };

      const res = await employeeService.createEmployee(payload);

      toast.success(
        pendingFaceDescriptor
          ? "Employee Created Successfully — face enrolled"
          : "Employee Created Successfully — you can now enroll their face",
      );

      // Redirect into Edit Employee either way — lets them verify the
      // enrollment (or re-enroll/remove it) even if it was captured here.
      navigate(`/${role}/employees/edit/${res.employee._id}`);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to create employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployeeForm
      title="Add New Employee"
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      loading={loading}
      submitText="Create Employee"
      pendingFaceDescriptor={pendingFaceDescriptor}
      onCapturePendingFace={setPendingFaceDescriptor}
      onClearPendingFace={() => setPendingFaceDescriptor(null)}
    />
  );
};

export default AddEmployee;
