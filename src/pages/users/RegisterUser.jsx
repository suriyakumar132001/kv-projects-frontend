import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaUserPlus } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";

import "./Users.css";

// Owner can create Admin, HR or Site Engineer.
// Admin can only create HR or Site Engineer (can't create another Admin).
const ROLE_OPTIONS = [
  { value: "admin", label: "Admin", ownerOnly: true },
  { value: "hr", label: "HR" },
  { value: "siteengineer", label: "Site Engineer" },
];

const RegisterUser = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const availableRoles = ROLE_OPTIONS.filter(
    (opt) => !opt.ownerOnly || role === "owner",
  );

  const onSubmit = async (data) => {
    if (!selectedRole) {
      toast.error("Please choose a role for this user");
      return;
    }

    try {
      setLoading(true);

      const res = await userService.registerUser({
        ...data,
        role: selectedRole,
      });

      if (res.emailSent) {
        toast.success("User registered — login details emailed to them.");
      } else {
        toast.warn(
          "User registered, but the welcome email failed to send. Please share their password manually.",
        );
      }

      navigate(`/${role}/users`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to register user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-page">
      <div className="user-form-card">
        <h2>
          <FaUserPlus style={{ marginRight: 8, verticalAlign: "-2px" }} />
          Add User
        </h2>
        <p>
          Create a login for a new Admin, HR, or Site Engineer. They'll sign in
          with the email and password you set here.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Role</label>
            <div className="role-option-grid">
              {availableRoles.map((opt) => (
                <div
                  key={opt.value}
                  className={`role-option ${
                    selectedRole === opt.value ? "selected" : ""
                  }`}
                  onClick={() => setSelectedRole(opt.value)}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Priya Sharma"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="badge-error">{errors.name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="name@company.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="badge-error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="text" placeholder="Optional" {...register("phone")} />
          </div>

          <div className="form-group">
            <label>Temporary Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <span className="badge-error">{errors.password.message}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(`/${role}/users`)}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;
