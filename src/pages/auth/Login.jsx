import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaHardHat } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await login(data);
      toast.success(res.message);

      const role = res.user.role.toLowerCase();

      switch (role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "owner":
          navigate("/owner/dashboard");
          break;
        case "hr":
          navigate("/hr/dashboard");
          break;
        case "siteengineer":
          navigate("/siteengineer/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="aura-page">
      {/* Animated gradient-mesh background */}
      <div className="aura-bg" aria-hidden="true">
        <span className="aura-blob aura-blob-1" />
        <span className="aura-blob aura-blob-2" />
        <span className="aura-blob aura-blob-3" />
        <div className="aura-grid" />
      </div>

      {/* Floating glass card */}
      <div className="aura-card">
        <div className="aura-hazard-tape" aria-hidden="true" />
        <div className="aura-hardhat-badge" aria-hidden="true">
          <FaHardHat />
        </div>

        <div className="aura-ring">
          <span className="aura-ring-core">KV</span>
        </div>

        <h1 className="aura-title">Welcome back</h1>
        <p className="aura-subtitle">Sign in to KV Projects ERP</p>

        <form
          className="aura-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="aura-field" style={{ "--i": 0 }}>
            <input
              id="aura-email"
              type="email"
              placeholder=" "
              autoComplete="email"
              {...register("email", { required: "Email is required" })}
            />
            <label htmlFor="aura-email">Email address</label>
            <span className="aura-underline" />
            {errors.email && (
              <span className="aura-error">{errors.email.message}</span>
            )}
          </div>

          <div className="aura-field" style={{ "--i": 1 }}>
            <input
              id="aura-password"
              type={showPassword ? "text" : "password"}
              placeholder=" "
              autoComplete="current-password"
              {...register("password", { required: "Password is required" })}
            />
            <label htmlFor="aura-password">Password</label>
            <span className="aura-underline" />
            <button
              type="button"
              className="aura-eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <span className="aura-error">{errors.password.message}</span>
            )}
          </div>

          <div className="aura-row" style={{ "--i": 2 }}>
            <Link to="/forgot-password" className="aura-forgot">
              Forgot password?
            </Link>
          </div>

          <button
            className="aura-submit"
            disabled={loading}
            style={{ "--i": 3 }}
          >
            <span className="aura-submit-label">
              {loading && <span className="aura-spinner" />}
              <span>{loading ? "Signing in..." : "Sign In"}</span>
            </span>
          </button>
        </form>

        <p className="aura-footer">
          © {new Date().getFullYear()} KV Projects ERP
        </p>
      </div>
    </div>
  );
};

export default Login;
