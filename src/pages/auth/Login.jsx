import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
          navigate("/site-engineer/dashboard");
          break;

        default:
          navigate("/");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <div className="login-container">

      <div className="login-left">

        <h1>KV Projects ERP</h1>

        <h2>Construction Management System</h2>

        <p>
          Manage Employees, Sites, Payroll,
          Attendance, Inventory and Projects
          from one powerful dashboard.
        </p>

      </div>

      <div className="login-right">

        <div className="login-card">

          <h2>Welcome Back</h2>

          <p>Please login to continue</p>

          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="form-group">

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter Email"
                {...register("email", {
                  required: "Email is required",
                })}
              />

              {errors.email && (
                <span>{errors.email.message}</span>
              )}

            </div>

            <div className="form-group">

              <label>Password</label>

              <div className="password-box">

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />

                <button
                  type="button"
                  className="eye-btn"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

              {errors.password && (
                <span>{errors.password.message}</span>
              )}

            </div>

            <button
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Login;