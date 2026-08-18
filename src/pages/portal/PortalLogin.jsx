import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
} from "@mui/material";
import { Business, Email, Lock } from "@mui/icons-material";

import { useClientAuth } from "../../context/ClientAuthContext";

const PortalLogin = () => {
  const navigate = useNavigate();
  const { login } = useClientAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      await login(formData);
      navigate("/portal/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to log in. Please try again.",
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
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Business color="primary" />
          <Typography variant="h5" fontWeight={700}>
            Client Portal
          </Typography>
        </Box>

        <Typography color="text.secondary" mb={3}>
          Track your project's progress, invoices, and payments.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          required
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          required
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </Button>

        <Box mt={2} textAlign="center">
          <Typography
            component={Link}
            to="/portal/forgot-password"
            variant="body2"
            color="primary"
            sx={{ textDecoration: "none" }}
          >
            Forgot your password?
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default PortalLogin;
