// ===============================================
// KV Projects ERP
// Create Project
// ===============================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { createProject } from "../../services/projectService";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  LinearProgress,
} from "@mui/material";

import {
  ArrowBack,
  Save,
  Business,
  LocationOn,
  Person,
  CalendarMonth,
  CurrencyRupee,
} from "@mui/icons-material";

// ===============================================
// Component
// ===============================================

const CreateProject = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const role = user?.role?.toLowerCase();

  // =============================================
  // Form State
  // =============================================

  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    location: "",
    description: "",
    projectManager: "",
    startDate: "",
    endDate: "",
    budget: "",
    progress: 0,
    status: "Pending",
  });

  // =============================================
  // UI State
  // =============================================

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =============================================
  // Handle Input
  // =============================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =============================================
  // Handle Progress
  // =============================================

  const handleProgressChange = (event) => {
    let value = Number(event.target.value);

    if (Number.isNaN(value)) {
      value = 0;
    }

    value = Math.min(100, Math.max(0, value));

    setFormData((previous) => ({
      ...previous,
      progress: value,
    }));
  };

  // =============================================
  // Validation
  // =============================================

  const validateForm = () => {
    if (!formData.projectName.trim()) {
      return "Project name is required.";
    }

    if (!formData.clientName.trim()) {
      return "Client name is required.";
    }

    if (!formData.location.trim()) {
      return "Project location is required.";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      return "End date cannot be before start date.";
    }

    if (Number(formData.budget) < 0) {
      return "Budget cannot be negative.";
    }

    if (Number(formData.progress) < 0 || Number(formData.progress) > 100) {
      return "Progress must be between 0 and 100.";
    }

    return "";
  };

  // =============================================
  // Submit
  // =============================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      // ===========================================
      // Prepare API Payload
      // ===========================================

      const payload = {
        projectName: formData.projectName.trim(),

        clientName: formData.clientName.trim(),

        location: formData.location.trim(),

        description: formData.description.trim(),

        projectManager: formData.projectManager.trim(),

        startDate: formData.startDate || null,

        endDate: formData.endDate || null,

        budget: Number(formData.budget) || 0,

        progress: Number(formData.progress) || 0,

        status: formData.status,
      };

      // ===========================================
      // Create Project
      // ===========================================

      await createProject(payload);

      setSuccess("Project created successfully.");

      // ===========================================
      // Redirect
      // ===========================================

      setTimeout(() => {
        navigate(`/${role}/projects`);
      }, 800);
    } catch (err) {
      console.error("Create project error:", err);

      setError(err.response?.data?.message || "Unable to create project.");
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // Cancel
  // =============================================

  const handleCancel = () => {
    navigate(`/${role}/projects`);
  };

  // =============================================
  // Render
  // =============================================

  return (
    <Box p={{ xs: 2, md: 3 }}>
      {/* =========================================
          Header
      ========================================= */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          md: "center",
        }}
        flexDirection={{
          xs: "column",
          md: "row",
        }}
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Create Project
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Create a new construction project
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleCancel}
        >
          Back to Projects
        </Button>
      </Box>

      {/* =========================================
          Alerts
      ========================================= */}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* =========================================
          Form
      ========================================= */}

      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 2,
        }}
      >
        {/* =======================================
            Basic Information
        ======================================= */}

        <Typography variant="h6" fontWeight={700} mb={3}>
          Basic Information
        </Typography>

        <Grid container spacing={3}>
          {/* Project Name */}

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Project Name"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="Enter project name"
              InputProps={{
                startAdornment: (
                  <Business
                    sx={{
                      mr: 1,
                      color: "text.secondary",
                    }}
                  />
                ),
              }}
            />
          </Grid>

          {/* Client */}

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Enter client name"
            />
          </Grid>

          {/* Location */}

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter project location"
              InputProps={{
                startAdornment: (
                  <LocationOn
                    sx={{
                      mr: 1,
                      color: "text.secondary",
                    }}
                  />
                ),
              }}
            />
          </Grid>

          {/* Project Manager */}

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Project Manager"
              name="projectManager"
              value={formData.projectManager}
              onChange={handleChange}
              placeholder="Enter project manager"
              InputProps={{
                startAdornment: (
                  <Person
                    sx={{
                      mr: 1,
                      color: "text.secondary",
                    }}
                  />
                ),
              }}
            />
          </Grid>

          {/* Description */}

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter project description"
            />
          </Grid>
        </Grid>

        {/* =======================================
            Project Timeline
        ======================================= */}

        <Typography variant="h6" fontWeight={700} mt={5} mb={3}>
          Project Timeline
        </Typography>

        <Grid container spacing={3}>
          {/* Start Date */}

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <CalendarMonth
                    sx={{
                      mr: 1,
                      color: "text.secondary",
                    }}
                  />
                ),
              }}
            />
          </Grid>

          {/* End Date */}

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <CalendarMonth
                    sx={{
                      mr: 1,
                      color: "text.secondary",
                    }}
                  />
                ),
              }}
            />
          </Grid>

          {/* Budget */}

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              type="number"
              label="Project Budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              inputProps={{
                min: 0,
              }}
              InputProps={{
                startAdornment: (
                  <CurrencyRupee
                    sx={{
                      mr: 1,
                      color: "text.secondary",
                    }}
                  />
                ),
              }}
            />
          </Grid>
        </Grid>

        {/* =======================================
            Project Status & Progress
        ======================================= */}

        <Typography variant="h6" fontWeight={700} mt={5} mb={3}>
          Project Status
        </Typography>

        <Grid container spacing={3}>
          {/* Status */}

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="Pending">Pending</MenuItem>

              <MenuItem value="Running">Running</MenuItem>

              <MenuItem value="Completed">Completed</MenuItem>

              <MenuItem value="On Hold">On Hold</MenuItem>
            </TextField>
          </Grid>

          {/* Progress */}

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Progress (%)"
              name="progress"
              value={formData.progress}
              onChange={handleProgressChange}
              inputProps={{
                min: 0,
                max: 100,
              }}
            />

            <Box mt={2}>
              <LinearProgress
                variant="determinate"
                value={Number(formData.progress || 0)}
                sx={{
                  height: 10,
                  borderRadius: 5,
                }}
              />

              <Typography variant="caption" color="text.secondary">
                {formData.progress}% completed
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* =======================================
            Buttons
        ======================================= */}

        <Box display="flex" justifyContent="flex-end" gap={2} mt={5}>
          <Button variant="outlined" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={loading ? null : <Save />}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </Box>

        {/* Loading indicator */}

        {loading && <LinearProgress sx={{ mt: 3 }} />}
      </Paper>
    </Box>
  );
};

export default CreateProject;
