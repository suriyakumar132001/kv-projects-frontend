// ===============================================
// ProjectDashboard.jsx
// Construction ERP - Project Dashboard
// ===============================================

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  Business,
  CheckCircle,
  PendingActions,
  Engineering,
} from "@mui/icons-material";

// ===============================================
// Component
// ===============================================

const ProjectDashboard = () => {
  // ===============================================
  // States
  // ===============================================

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ===============================================
  // Fetch Projects
  // GET /projects
  // ===============================================

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Backend returns { success, count, projects }
      setProjects(response.data.projects || []);
    } catch (err) {
      console.log("Project Error", err);

      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ===============================================
  // Calculations
  // ===============================================

  const totalProjects = projects.length;

  const runningProjects = projects.filter(
    (item) => item.status === "Running",
  ).length;

  const completedProjects = projects.filter(
    (item) => item.status === "Completed",
  ).length;

  const pendingProjects = projects.filter(
    (item) => item.status === "Pending",
  ).length;

  const totalBudget = projects.reduce(
    (sum, item) => sum + Number(item.budget || 0),
    0,
  );

  // ===============================================
  // Loading
  // ===============================================

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

  // ===============================================
  // UI
  // ===============================================

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Project Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Total Projects */}

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Business color="primary" sx={{ fontSize: 40 }} />

              <Typography>Total Projects</Typography>

              <Typography variant="h4" fontWeight="bold">
                {totalProjects}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Running */}

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Engineering color="success" sx={{ fontSize: 40 }} />

              <Typography>Running Projects</Typography>

              <Typography variant="h4" fontWeight="bold">
                {runningProjects}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Completed */}

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <CheckCircle color="primary" sx={{ fontSize: 40 }} />

              <Typography>Completed</Typography>

              <Typography variant="h4" fontWeight="bold">
                {completedProjects}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending */}

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <PendingActions color="warning" sx={{ fontSize: 40 }} />

              <Typography>Pending</Typography>

              <Typography variant="h4" fontWeight="bold">
                {pendingProjects}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Budget */}

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography>Total Project Budget</Typography>

          <Typography variant="h4" fontWeight="bold">
            ₹ {totalBudget.toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProjectDashboard;