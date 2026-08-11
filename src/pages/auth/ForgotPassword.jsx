import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FaHardHat, FaArrowLeft } from "react-icons/fa";

import authService from "../../services/authService";

import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ email }) => {
    setLoading(true);

    try {
      const res = await authService.forgotPassword(email);
      toast.success(res.message);
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
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

        {submitted ? (
          <>
            <h2>Check your email</h2>
            <p className="fp-sub">
              If an account exists for that email, we've sent a link to
              reset your password. The link expires in 30 minutes.
            </p>
          </>
        ) : (
          <>
            <h2>Forgot your password?</h2>
            <p className="fp-sub">
              Enter the email linked to your account and we'll send you a
              link to reset your password.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="fp-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <span className="fp-error">{errors.email.message}</span>
                )}
              </div>

              <button className="fp-submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}

        <Link to="/" className="fp-back-link">
          <FaArrowLeft />
          Back to login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;