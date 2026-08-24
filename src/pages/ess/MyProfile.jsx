import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import employeeService from "../../services/employeeService";
import essService from "../../services/essService";

import "../employees/EmployeeDetails.css";
import "../../components/employee/EmployeeForm.css";

const MyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employee, setEmployee] = useState(null);

  // Only these are editable here — everything else (salary, department,
  // designation, status) is HR/Admin-managed via the Employees page.
  const [form, setForm] = useState({
    phone: "",
    address: "",
    emergencyContact: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await employeeService.getMyEmployee();

      setEmployee(res.employee);
      setForm({
        phone: res.employee.phone || "",
        address: res.employee.address || "",
        emergencyContact: res.employee.emergencyContact || "",
      });
    } catch (error) {
      toast.error("Failed to load your profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await essService.updateMyProfile(form);

      setEmployee(res.employee);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading Profile...</div>;
  }

  if (!employee) {
    return (
      <div className="loading">
        No employee record is linked to your account. Contact HR/Admin.
      </div>
    );
  }

  return (
    <div className="employee-details">
      <div className="details-header">
        <div>
          <h2>My Profile</h2>
          <p>Your employment details and contact information.</p>
        </div>
      </div>

      {/* Read-only info — managed by HR/Admin */}

      <div className="details-card">
        <div className="details-grid">
          <div>
            <strong>Employee ID</strong>
            <p>{employee.employeeId}</p>
          </div>

          <div>
            <strong>Name</strong>
            <p>{employee.name}</p>
          </div>

          <div>
            <strong>Email</strong>
            <p>{employee.email}</p>
          </div>

          <div>
            <strong>Department</strong>
            <p>{employee.department}</p>
          </div>

          <div>
            <strong>Designation</strong>
            <p>{employee.designation}</p>
          </div>

          <div>
            <strong>Joining Date</strong>
            <p>
              {employee.joiningDate
                ? new Date(employee.joiningDate).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Editable contact details */}

      <div className="employee-form-card" style={{ marginTop: 25 }}>
        <div className="form-header">
          <h2>Edit Contact Details</h2>
          <p>These are the only fields you can update yourself.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Emergency Contact</label>
              <input
                type="text"
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={handleChange}
                placeholder="Name & phone number"
              />
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label>Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;