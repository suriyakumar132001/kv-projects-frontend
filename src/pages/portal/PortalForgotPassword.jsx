import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

import clientAuthService from "../../services/clientAuthService";

const PortalForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      const res = await clientAuthService.clientForgotPassword(email.trim());
      setMessage(res.message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
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
        <Typography variant="h5" fontWeight={700} mb={1}>
          Reset Password
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Enter your email and we'll send you a reset link.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <TextField
          fullWidth
          required
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Button type="submit" variant="contained" fullWidth disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
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

export default PortalForgotPassword;
