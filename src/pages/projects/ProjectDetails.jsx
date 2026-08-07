// ===============================================
// ProjectDetails.jsx
// Construction ERP - Project Details
// ===============================================

import React, { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  LocationOn,
  Person,
  CurrencyRupee,
  CalendarMonth,
  Engineering,
} from "@mui/icons-material";

import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProject = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get(`/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProject(response.data.project);
    } catch (err) {
      console.log(err);
      setError("Unable to load project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <Box
        height="70vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!project) {
    return (
      <Box p={3}>
        <Alert severity="warning">Project not found</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Project Details
        </Typography>

        <Button
          variant="outlined"
          onClick={() => navigate(`/${role}/projects`)}
        >
          Back
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          {project.projectName || project.name}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography>
              <Person />
              Client
            </Typography>
            <Typography>{project.clientName || "-"}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <LocationOn />
              Location
            </Typography>
            <Typography>{project.location || "-"}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <CurrencyRupee />
              Budget
            </Typography>
            <Typography>
              ₹ {Number(project.budget || 0).toLocaleString()}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <CalendarMonth />
              Start Date
            </Typography>
            <Typography>
              {project.startDate
                ? new Date(project.startDate).toLocaleDateString()
                : "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <Engineering />
              Manager
            </Typography>
            <Typography>{project.projectManager || "-"}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>Status</Typography>
            <Chip
              label={project.status}
              color={
                project.status === "Completed"
                  ? "success"
                  : project.status === "Running"
                    ? "primary"
                    : "warning"
              }
            />
          </Grid>
        </Grid>
      </Paper>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            Project Progress
          </Typography>

          <Typography mt={2}>{project.progress || 0}% Completed</Typography>

          <LinearProgress
            variant="determinate"
            value={project.progress || 0}
            sx={{ height: 10, borderRadius: 5, mt: 2 }}
          />
        </CardContent>
      </Card>

      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Assigned Team
        </Typography>

        {project.team?.length > 0 ? (
          project.team.map((member) => (
            <Chip key={member._id} label={member.name} sx={{ m: 1 }} />
          ))
        ) : (
          <Typography mt={2}>No team assigned</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ProjectDetails;