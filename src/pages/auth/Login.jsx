import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  FaEye,
  FaEyeSlash,
  FaHardHat,
  FaUsers,
  FaWarehouse,
  FaChartLine,
  FaIdCard,
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

  // Simple window grid for each floor of the rising building illustration
  const floorRows = [212, 182, 152, 122, 92];
  const windowCols = [104, 134, 164, 194];

  return (
    <div className="site-container">
      {/* ================= LEFT: Rising Site Panel ================= */}
      <div className="site-left">
        <div className="site-grid-bg"></div>
        <div className="site-vignette"></div>

        <div className="site-left-top">
          <span className="site-eyebrow">
            <span className="site-eyebrow-line"></span>
            Project Access Terminal
          </span>
          <h1 className="site-brand">
            <FaHardHat className="site-brand-icon" />
            KV Projects <span>ERP</span>
          </h1>
          <p className="site-tagline">
            One terminal for your sites — employees, payroll, inventory,
            attendance and progress, always in view.
          </p>
        </div>

        {/* Crane assembles, then the tower rises floor by floor */}
        <div className="site-build-wrap">
          <svg
            className="site-build-svg"
            viewBox="0 0 300 260"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="20" y1="242" x2="280" y2="242" className="ground-line" />
            <rect
              x="20"
              y="246"
              width="260"
              height="5"
              className="hazard-strip"
            />

            <line
              x1="235"
              y1="242"
              x2="235"
              y2="38"
              className="crane-draw"
              style={{ "--len": 204 }}
            />
            <line
              x1="235"
              y1="38"
              x2="285"
              y2="38"
              className="crane-draw"
              style={{ "--len": 50 }}
            />
            <line
              x1="235"
              y1="38"
              x2="205"
              y2="50"
              className="crane-draw"
              style={{ "--len": 33 }}
            />
            <g className="crane-hook-group">
              <line x1="270" y1="38" x2="270" y2="70" className="crane-cable" />
              <circle cx="270" cy="74" r="4" className="crane-hook" />
            </g>

            {floorRows.map((y, i) => (
              <g key={y} className={`floor-group f${i + 1}`}>
                <rect x="90" y={y} width="120" height="28" className="floor" />
                {windowCols.map((x) => (
                  <rect
                    key={x}
                    x={x}
                    y={y + 8}
                    width="10"
                    height="12"
                    className="window"
                  />
                ))}
              </g>
            ))}
          </svg>
        </div>

        <div className="site-feature-strip">
          <div className="site-feature" style={{ "--d": "1.3s" }}>
            <FaUsers />
            <span>Workforce</span>
          </div>
          <div className="site-feature" style={{ "--d": "1.45s" }}>
            <FaWarehouse />
            <span>Sites</span>
          </div>
          <div className="site-feature" style={{ "--d": "1.6s" }}>
            <FaChartLine />
            <span>Progress</span>
          </div>
        </div>

        <div className="site-coordline">
          <span>TERMINAL / KV-ERP</span>
          <span>BUILD 2026.08</span>
        </div>
      </div>

      {/* ================= RIGHT: Access Badge Card ================= */}
      <div className="site-right">
        <div className="badge-card">
          <div className="badge-clip">
            <div className="badge-hole"></div>
          </div>
          <div className="badge-tape"></div>

          <div className="badge-cert">
            <FaIdCard />
            <span>
              Clearance
              <br />
              Verified
            </span>
          </div>

          <div className="badge-head">
            <span className="badge-tag">Site Login</span>
            <h2>Welcome back</h2>
            <p>Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="badge-field">
              <label>Email</label>
              <div className="badge-input-wrap">
                <input
                  type="email"
                  placeholder="you@company.com"
                  {...register("email", { required: "Email is required" })}
                />
                <span className="scan-line"></span>
              </div>
              {errors.email && (
                <span className="badge-error">{errors.email.message}</span>
              )}
            </div>

            <div className="badge-field">
              <label>Password</label>
              <div className="badge-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  className="badge-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <span className="scan-line"></span>
              </div>
              {errors.password && (
                <span className="badge-error">{errors.password.message}</span>
              )}

              <Link to="/forgot-password" className="badge-forgot-link">
                Forgot password?
              </Link>
            </div>

            <button className="badge-submit" disabled={loading}>
              <span className="badge-btn-label">
                {loading && <span className="badge-spinner"></span>}
                <span>{loading ? "Verifying..." : "Swipe to Sign In"}</span>
              </span>
            </button>
          </form>

          <div className="badge-barcode" aria-hidden="true">
            {Array.from({ length: 28 }).map((_, i) => (
              <span key={i}></span>
            ))}
          </div>
          <p className="badge-footer-note">
            © {new Date().getFullYear()} KV Projects ERP
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;