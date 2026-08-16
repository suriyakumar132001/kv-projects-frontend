import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaUserEdit } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";

import "./Users.css";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin", ownerOnly: true },
  { value: "accountant", label: "Accountant" },
  { value: "hr", label: "HR" },
  { value: "siteengineer", label: "Site Engineer" },
];

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const availableRoles = ROLE_OPTIONS.filter(
    (opt) => !opt.ownerOnly || role === "owner",
  );

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      setFetching(true);
      const res = await userService.getUserById(id);
      const u = res.user || res;

      reset({
        name: u.name,
        email: u.email,
        phone: u.phone,
      });
      setSelectedRole(u.role?.toLowerCase() || "");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load user");
      navigate(`/${role}/users`);
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedRole) {
      toast.error("Please choose a role for this user");
      return;
    }

    const payload = { ...data, role: selectedRole };
    if (!payload.password) delete payload.password;

    try {
      setLoading(true);
      await userService.updateUser(id, payload);

      toast.success("User updated successfully");
      navigate(`/${role}/users`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <h2>Loading user...</h2>;
  }

  return (
    <div className="user-form-page">
      <div className="user-form-card">
        <h2>
          <FaUserEdit style={{ marginRight: 8, verticalAlign: "-2px" }} />
          Edit User
        </h2>
        <p>Update this user's details, role, or reset their password.</p>

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
            <label>New Password</label>
            <input
              type="password"
              placeholder="Leave blank to keep current password"
              {...register("password", {
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
