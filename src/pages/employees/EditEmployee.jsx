import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import employeeService from "../../services/employeeService";
import EmployeeForm from "../../components/employee/EmployeeForm";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [faceSaving, setFaceSaving] = useState(false);
  const [faceEnrolledAt, setFaceEnrolledAt] = useState(null);

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

      setFaceEnrolledAt(res.employee.faceEnrolledAt || null);
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

      navigate(`/${role}/employees`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // =======================================
  // Face Enrollment
  // =======================================
  //
  // Called by EmployeeForm/FaceCapture once a descriptor has been
  // captured in the browser. The actual match logic never runs
  // here — this just saves the reference descriptor for this
  // employee (see enrollFace in employeeController.js).
  const handleEnrollFace = async (descriptor) => {
    try {
      setFaceSaving(true);

      const res = await employeeService.enrollFace(id, descriptor);

      setFaceEnrolledAt(
        res.employee.faceEnrolledAt || new Date().toISOString(),
      );

      toast.success("Face enrolled successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to enroll face");
    } finally {
      setFaceSaving(false);
    }
  };

  const handleRemoveFace = async () => {
    try {
      setFaceSaving(true);

      await employeeService.removeFace(id);

      setFaceEnrolledAt(null);

      toast.success("Face enrollment removed");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove face enrollment",
      );
    } finally {
      setFaceSaving(false);
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
      employeeId={id}
      faceEnrolledAt={faceEnrolledAt}
      onEnrollFace={handleEnrollFace}
      onRemoveFace={handleRemoveFace}
      faceSaving={faceSaving}
    />
  );
};

export default EditEmployee;
