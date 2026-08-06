import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaUsers,
  FaChartLine,
  FaHardHat,
} from "react-icons/fa";

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
    <div className="bp-container">
      {/* ================= LEFT: Blueprint Panel ================= */}
      <div className="bp-left">
        <div className="bp-grid-bg"></div>
        <div className="bp-vignette"></div>

        <div className="bp-left-top">
          <span className="bp-eyebrow">
            <span className="bp-eyebrow-line"></span>
            Site Operations Platform
          </span>
          <h1 className="bp-brand">
            <FaHardHat className="bp-brand-icon" />
            KV Projects <span>ERP</span>
          </h1>
          <p className="bp-tagline">
            Manage employees, sites, payroll, attendance, inventory and
            projects from one command deck.
          </p>
        </div>

        {/* Animated drafting illustration */}
        <div className="bp-draft-wrap">
          <svg className="bp-draft-svg" viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg">
            <path className="bp-draw" style={{ "--len": 520 }} d="M40 300 L40 60 L230 60" />
            <path className="bp-draw" style={{ "--len": 180 }} d="M40 60 L20 90" />
            <line className="bp-draw" style={{ "--len": 60 }} x1="40" y1="80" x2="60" y2="60" />
            <line className="bp-draw" style={{ "--len": 220 }} x1="230" y1="60" x2="230" y2="120" />
            <circle className="bp-draw" style={{ "--len": 40 }} cx="230" cy="126" r="5" />

            <path className="bp-draw" style={{ "--len": 600 }} d="M120 300 L120 140 L340 140 L340 300" />
            <line className="bp-draw" style={{ "--len": 160 }} x1="120" y1="180" x2="340" y2="180" />
            <line className="bp-draw" style={{ "--len": 160 }} x1="120" y1="220" x2="340" y2="220" />
            <line className="bp-draw" style={{ "--len": 160 }} x1="120" y1="260" x2="340" y2="260" />
            <line className="bp-draw" style={{ "--len": 160 }} x1="176" y1="140" x2="176" y2="300" />
            <line className="bp-draw" style={{ "--len": 160 }} x1="232" y1="140" x2="232" y2="300" />
            <line className="bp-draw" style={{ "--len": 160 }} x1="288" y1="140" x2="288" y2="300" />

            <line className="bp-draw" style={{ "--len": 460 }} x1="20" y1="300" x2="460" y2="300" />
            <line className="bp-dim" x1="120" y1="312" x2="340" y2="312" />
            <text className="bp-dimtext" x="205" y="309">24.60 M</text>
          </svg>
        </div>

        <div className="bp-feature-strip">
          <div className="bp-feature" style={{ "--d": "0s" }}>
            <FaUsers />
            <span>Employees</span>
          </div>
          <div className="bp-feature" style={{ "--d": "0.15s" }}>
            <FaBuilding />
            <span>Sites</span>
          </div>
          <div className="bp-feature" style={{ "--d": "0.3s" }}>
            <FaChartLine />
            <span>Analytics</span>
          </div>
        </div>

        <div className="bp-coordline">
          <span>SITE-042 / BLOCK C</span>
          <span>REV. 2026.03</span>
        </div>
      </div>

      {/* ================= RIGHT: Login Card ================= */}
      <div className="bp-right">
        <div className="bp-card">
          <div className="bp-ticks"></div>
          <div className="bp-stamp">
            <div className="bp-stamp-ring"></div>
            Access
            <br />
            Verified
          </div>

          <div className="bp-card-head">
            <span className="bp-tag">Field Login · 032</span>
            <h2>Welcome back</h2>
            <p>Please login to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bp-field">
              <label>Email</label>
              <div className="bp-input-wrap">
                <input
                  type="email"
                  placeholder="you@company.com"
                  {...register("email", { required: "Email is required" })}
                />
                <div className="bp-ruler-focus"></div>
              </div>
              {errors.email && <span className="bp-error">{errors.email.message}</span>}
            </div>

            <div className="bp-field">
              <label>Password</label>
              <div className="bp-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  className="bp-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <div className="bp-ruler-focus"></div>
              </div>
              {errors.password && <span className="bp-error">{errors.password.message}</span>}
            </div>

            <button className="bp-submit" disabled={loading}>
              <span className="bp-btn-label">
                {loading && <span className="bp-spinner"></span>}
                <span>{loading ? "Signing in..." : "Sign In"}</span>
              </span>
            </button>
          </form>

          <p className="bp-footer-note">© {new Date().getFullYear()} KV Projects ERP</p>
        </div>
      </div>
    </div>
  );
};

export default Login;