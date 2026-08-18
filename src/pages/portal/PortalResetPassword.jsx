import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

import clientAuthService from "../../services/clientAuthService";

const PortalResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await clientAuthService.clientResetPassword(token, password);
      setSuccess(res.message);
      setTimeout(() => navigate("/portal/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f8f9fb"
      p={2}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 4, maxWidth: 420, width: "100%", borderRadius: 2 }}
      >
        <Typography variant="h5" fontWeight={700} mb={3}>
          Choose a New Password
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <TextField
          fullWidth
          required
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          required
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button type="submit" variant="contained" fullWidth disabled={loading}>
          {loading ? "Saving..." : "Reset Password"}
        </Button>

        <Box mt={2} textAlign="center">
          <Typography
            component={Link}
            to="/portal/login"
            variant="body2"
            color="primary"
            sx={{ textDecoration: "none" }}
          >
            Back to Login
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default PortalResetPassword;
