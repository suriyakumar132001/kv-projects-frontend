import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaHardHat, FaEye, FaEyeSlash } from "react-icons/fa";

import authService from "../../services/authService";

import "./ForgotPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ password }) => {
    setLoading(true);

    try {
      const res = await authService.resetPassword(token, password);
      toast.success(res.message);
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "This reset link is invalid or has expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-container">
      <div className="fp-card">
        <div className="fp-brand">
          <FaHardHat />
          <span>KV Projects ERP</span>
        </div>

        <h2>Set a new password</h2>
        <p className="fp-sub">
          Choose a new password for your account. Make it something you'll
          remember this time!
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="fp-field">
            <label>New Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className="fp-error">{errors.password.message}</span>
            )}
          </div>

          <div className="fp-field">
            <label>Confirm New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <span className="fp-error">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button className="fp-submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <Link to="/" className="fp-back-link">
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;