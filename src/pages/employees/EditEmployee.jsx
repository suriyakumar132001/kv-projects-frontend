import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import employeeService from "../../services/employeeService";
import EmployeeForm from "../../components/employee/EmployeeForm";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [employee, setEmployee] = useState({
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

  useEffect(() => {
    loadEmployee();
  }, []);

  const loadEmployee = async () => {
    try {
      const res = await employeeService.getEmployee(id);

      setEmployee({
        employeeId: res.employee.employeeId || "",
        name: res.employee.name || "",
        email: res.employee.email || "",
        phone: res.employee.phone || "",
        department: res.employee.department || "",
        designation: res.employee.designation || "",
        salary: res.employee.salary || "",
        joiningDate: res.employee.joiningDate
          ? res.employee.joiningDate.substring(0, 10)
          : "",
        status: res.employee.status || "Active",
        address: res.employee.address || "",
        emergencyContact: res.employee.emergencyContact || "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load employee");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await employeeService.updateEmployee(id, employee);

      toast.success("Employee Updated Successfully");

      navigate("/owner/employees");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <h2>Loading Employee...</h2>;
  }

  return (
    <EmployeeForm
      title="Edit Employee"
      formData={employee}
      onChange={handleChange}
      onSubmit={handleSubmit}
      loading={saving}
      submitText="Update Employee"
    />
  );
};

export default EditEmployee;