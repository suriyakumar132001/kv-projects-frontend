// ===============================================
// KV Projects ERP
// Edit Project
// ===============================================

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { getProject, updateProject } from "../../services/projectService";

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
  CircularProgress,
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

const EditProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =============================================
  // Fetch Project
  // =============================================

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProject(id);

      const project = response?.project;

      if (!project) {
        setError("Project not found.");
        return;
      }

      setFormData({
        projectName: project.projectName || "",
        clientName: project.clientName || "",
        location: project.location || "",
        description: project.description || "",
        projectManager: project.projectManager || "",
        startDate: project.startDate
          ? new Date(project.startDate).toISOString().split("T")[0]
          : "",
        endDate: project.endDate
          ? new Date(project.endDate).toISOString().split("T")[0]
          : "",
        budget:
          project.budget !== undefined && project.budget !== null
            ? project.budget
            : "",
        progress:
          project.progress !== undefined && project.progress !== null
            ? project.progress
            : 0,
        status: project.status || "Pending",
      });
    } catch (err) {
      console.error("Fetch project error:", err);

      setError(err.response?.data?.message || "Unable to load project.");
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // Initial Load
  // =============================================

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

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
      setSaving(true);

      // ===========================================
      // API Payload
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
      // Update Project
      // ===========================================

      await updateProject(id, payload);

      setSuccess("Project updated successfully.");

      // ===========================================
      // Redirect
      // ===========================================

      setTimeout(() => {
        navigate(`/${role}/projects/view/${id}`);
      }, 800);
    } catch (err) {
      console.error("Update project error:", err);

      setError(err.response?.data?.message || "Unable to update project.");
    } finally {
      setSaving(false);
    }
  };

  // =============================================
  // Cancel
  // =============================================

  const handleCancel = () => {
    navigate(`/${role}/projects/view/${id}`);
  };

  // =============================================
  // Loading
  // =============================================

  if (loading) {
    return (
      <Box
        minHeight="60vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

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
            Edit Project
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Update project information and progress
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleCancel}
          disabled={saving}
        >
          Back to Project
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
            />
          </Grid>
        </Grid>

        {/* =======================================
            Timeline & Budget
        ======================================= */}

        <Typography variant="h6" fontWeight={700} mt={5} mb={3}>
          Timeline & Budget
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
            Status & Progress
        ======================================= */}

        <Typography variant="h6" fontWeight={700} mt={5} mb={3}>
          Status & Progress
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
            Actions
        ======================================= */}

        <Box display="flex" justifyContent="flex-end" gap={2} mt={5}>
          <Button variant="outlined" onClick={handleCancel} disabled={saving}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={saving ? null : <Save />}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Box>

        {saving && <LinearProgress sx={{ mt: 3 }} />}
      </Paper>
    </Box>
  );
};

export default EditProject;
