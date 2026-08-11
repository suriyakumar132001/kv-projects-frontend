import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";

import userService from "../../services/userService";

import "./ChangePasswordModal.css";

const ChangePasswordModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ currentPassword, newPassword }) => {
    setLoading(true);

    try {
      const res = await userService.changePassword({
        currentPassword,
        newPassword,
      });
      toast.success(res.message || "Password changed successfully");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cpm-overlay" onClick={onClose}>
      <div className="cpm-card" onClick={(e) => e.stopPropagation()}>
        <div className="cpm-header">
          <h3>Change Password</h3>
          <button className="cpm-close-btn" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="cpm-field">
            <label>Current Password</label>
            <div className="cpm-input-wrap">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                {...register("currentPassword", {
                  required: "Current password is required",
                })}
              />
              <button
                type="button"
                className="cpm-eye-btn"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label="Toggle visibility"
              >
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.currentPassword && (
              <span className="cpm-error">
                {errors.currentPassword.message}
              </span>
            )}
          </div>

          <div className="cpm-field">
            <label>New Password</label>
            <div className="cpm-input-wrap">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                className="cpm-eye-btn"
                onClick={() => setShowNew(!showNew)}
                aria-label="Toggle visibility"
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.newPassword && (
              <span className="cpm-error">{errors.newPassword.message}</span>
            )}
          </div>

          <div className="cpm-field">
            <label>Confirm New Password</label>
            <input
              type={showNew ? "text" : "password"}
              placeholder="Re-enter new password"
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === watch("newPassword") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <span className="cpm-error">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <div className="cpm-actions">
            <button
              type="button"
              className="cpm-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button className="cpm-submit-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;