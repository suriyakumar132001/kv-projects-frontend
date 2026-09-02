import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import employeeService from "../../services/employeeService";
import EmployeeForm from "../../components/employee/EmployeeForm";

import "./Employee.css";

// Owner can grant any of these; Admin can grant all but Admin;
// HR can only grant Site Engineer — enforced again server-side in
// authController.register(), this is just so the dropdown doesn't
// even offer a role the caller isn't allowed to pick.
const LOGIN_ROLE_OPTIONS = [
  { value: "admin", label: "Admin", allowedFor: ["owner"] },
  { value: "accountant", label: "Accountant", allowedFor: ["owner", "admin"] },
  { value: "hr", label: "HR", allowedFor: ["owner", "admin"] },
  {
    value: "siteengineer",
    label: "Site Engineer",
    allowedFor: ["owner", "admin", "hr"],
  },
];

const AddEmployee = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [loading, setLoading] = useState(false);
  const [pendingFaceDescriptor, setPendingFaceDescriptor] = useState(null);
  const [pendingPhotoFile, setPendingPhotoFile] = useState(null);

  // ---- Login access toggle ----
  const [createLogin, setCreateLogin] = useState(false);
  const [loginRole, setLoginRole] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const availableLoginRoles = LOGIN_ROLE_OPTIONS.filter((opt) =>
    opt.allowedFor.includes(role),
  );

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

  // After either creation path succeeds, chain the face/photo uploads
  // that need a real employee id — same pattern either way.
  const finishEnrollment = async (employeeId) => {
    if (pendingFaceDescriptor) {
      try {
        await employeeService.enrollFace(employeeId, pendingFaceDescriptor);
      } catch (error) {
        toast.error(
          "Employee created, but face enrollment failed — retry it from Edit Employee.",
        );
      }
    }

    if (pendingPhotoFile) {
      try {
        await employeeService.uploadPhoto(employeeId, pendingPhotoFile);
      } catch (error) {
        toast.error(
          "Employee created, but the photo upload failed — retry it from Edit Employee.",
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (createLogin && !loginRole) {
      return toast.error("Please choose a role for this employee's login");
    }
    if (createLogin && (!loginPassword || loginPassword.length < 6)) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      let newEmployeeId;

      if (createLogin) {
        // Merged flow: creates the User (login) + the linked Employee
        // record in one request. Employee ID is auto-generated here,
        // same as accounts created from Add User.
        const res = await employeeService.registerEmployee({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: loginPassword,
          role: loginRole,
          department: formData.department,
          designation: formData.designation,
          salary: formData.salary,
          joiningDate: formData.joiningDate,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
        });

        if (!res.employeeLinked) {
          // User was created, but the auto-linked Employee record
          // failed (see employeeLinkFailedReason) — most commonly a
          // duplicate email already in Employees. Don't silently lose
          // face/photo uploads in that case; there's no employee id
          // to attach them to.
          toast.error(
            res.employeeLinkFailedReason ||
              "Login created, but the Employee profile couldn't be linked. Check the Users page.",
          );
          navigate(`/${role}/users`);
          return;
        }

        newEmployeeId = res.employee._id;

        toast.success(
          "Employee created with login access — their credentials are being emailed to them.",
        );
      } else {
        // Plain flow: Employee-only, no login. Same as before.
        const res = await employeeService.createEmployee(formData);
        newEmployeeId = res.employee._id;

        toast.success("Employee Created Successfully");
      }

      await finishEnrollment(newEmployeeId);

      // Redirect into Edit Employee either way — lets them verify
      // everything (face, photo, details) even if it was captured here.
      navigate(`/${role}/employees/edit/${newEmployeeId}`);
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
      submitText={createLogin ? "Create Employee & Login" : "Create Employee"}
      pendingFaceDescriptor={pendingFaceDescriptor}
      onCapturePendingFace={setPendingFaceDescriptor}
      onClearPendingFace={() => setPendingFaceDescriptor(null)}
      pendingPhotoFile={pendingPhotoFile}
      onSelectPendingPhoto={setPendingPhotoFile}
      onClearPendingPhoto={() => setPendingPhotoFile(null)}
      createLogin={createLogin}
      onToggleCreateLogin={setCreateLogin}
      loginRole={loginRole}
      onLoginRoleChange={setLoginRole}
      loginPassword={loginPassword}
      onLoginPasswordChange={setLoginPassword}
      availableLoginRoles={availableLoginRoles}
    />
  );
};

export default AddEmployee;
