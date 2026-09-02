import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaHardHat } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../../context/AuthContext";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin, loading } = useAuth();
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        throw new Error("Google sign-in failed");
      }

      const result = await googleLogin(credentialResponse.credential);
      toast.success(result.message);

      const role = result.user.role.toLowerCase();

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
      toast.error(err.response?.data?.message || err.message || "Google Login Failed");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in failed");
  };

  return (
    <div className="aura-page">
      <div className="aura-bg" aria-hidden="true">
        <div className="blueprint-grid" />
        <div className="construction-scene">
          <div className="building building-left" />
          <div className="building building-right" />
          <div className="beam beam-one" />
          <div className="beam beam-two" />
          <div className="crane crane-left">
            <span className="crane-cabin" />
            <span className="crane-arm arm-one" />
            <span className="crane-arm arm-two" />
          </div>
          <div className="crane crane-right">
            <span className="crane-cabin" />
            <span className="crane-arm arm-one" />
            <span className="crane-arm arm-two" />
          </div>
          <div className="ruler ruler-horizontal" />
          <div className="ruler ruler-vertical" />
        </div>
      </div>

      <div className="aura-card">
        <div className="aura-hazard-tape" aria-hidden="true" />
        <div className="aura-hardhat-badge" aria-hidden="true">
          <FaHardHat />
        </div>

        <div className="aura-topbar">
          <div className="aura-brandmark">
            <span>KV</span>
          </div>
          <span className="aura-chip">Construction ERP</span>
        </div>

        <h1 className="aura-title">Welcome back</h1>
        <p className="aura-subtitle">Secure access to KV Projects ERP</p>

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
            <label className="aura-remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
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
              <span>{loading ? "Signing in..." : "Login"}</span>
            </span>
          </button>

          <div className="aura-google-wrap" style={{ "--i": 4 }}>
            <div className="aura-divider">
              <span>or continue with</span>
            </div>

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              shape="pill"
              size="large"
              width={320}
              theme="filled_black"
              locale="en"
            />
          </div>
        </form>

        <p className="aura-footer">
          © {new Date().getFullYear()} KV Projects ERP
        </p>
      </div>
    </div>
  );
};

export default Login;
