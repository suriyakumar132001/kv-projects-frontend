import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
} from "@mui/material";
import { LocationOn, CalendarMonth } from "@mui/icons-material";

import clientPortalService from "../../services/clientPortalService";
import { useClientAuth } from "../../context/ClientAuthContext";

const STATUS_COLORS = {
  Pending: "default",
  Running: "info",
  Completed: "success",
  "On Hold": "warning",
};

const PortalDashboard = () => {
  const { client } = useClientAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await clientPortalService.getMyProjects();
        setProjects(res.projects || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load your projects.",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={0.5}>
        Welcome, {client?.clientName}
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Here's the status of your project{projects.length !== 1 ? "s" : ""}.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!error && projects.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography color="text.secondary">
            No projects have been linked to your account yet. Contact your
            project manager if you believe this is a mistake.
          </Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} key={project._id}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                cursor: "pointer",
                transition: "box-shadow 0.2s ease",
                "&:hover": { boxShadow: 4 },
              }}
              onClick={() => navigate(`/portal/projects/${project._id}`)}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={1}
              >
                <Typography variant="h6" fontWeight={700}>
                  {project.projectName}
                </Typography>

                <Chip
                  label={project.status}
                  color={STATUS_COLORS[project.status] || "default"}
                  size="small"
                />
              </Box>

              <Box display="flex" alignItems="center" gap={0.5} mb={2}>
                <LocationOn fontSize="small" color="disabled" />
                <Typography variant="body2" color="text.secondary">
                  {project.location}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {project.progress || 0}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={Number(project.progress || 0)}
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />

              {project.endDate && (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <CalendarMonth fontSize="small" color="disabled" />
                  <Typography variant="caption" color="text.secondary">
                    Expected completion:{" "}
                    {new Date(project.endDate).toLocaleDateString("en-IN")}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PortalDashboard;
