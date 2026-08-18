import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
  Button,
  Divider,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { ArrowBack, WbSunny, Cloud, Grain } from "@mui/icons-material";

import clientPortalService from "../../services/clientPortalService";

const WEATHER_ICONS = {
  Sunny: <WbSunny fontSize="small" sx={{ color: "#f5a623" }} />,
  Cloudy: <Cloud fontSize="small" sx={{ color: "#90a4ae" }} />,
  Rainy: <Grain fontSize="small" sx={{ color: "#4a90d9" }} />,
};

const STATUS_COLORS = {
  Pending: "default",
  Running: "info",
  Completed: "success",
  "On Hold": "warning",
};

const PortalProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await clientPortalService.getMyProjectDetail(id);
        setProject(res.project);
        setRecentUpdates(res.recentUpdates || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load this project.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Project not found."}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/portal/dashboard")}
        >
          Back to Projects
        </Button>
      </Box>
    );
  }

  const allImages = recentUpdates.flatMap((r) => r.images || []);
  const apiOrigin = (import.meta.env.VITE_API_URL || "").replace(
    /\/api\/?$/,
    "",
  );

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/portal/dashboard")}
        sx={{ mb: 2 }}
      >
        Back to Projects
      </Button>

      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {project.projectName}
            </Typography>
            <Typography color="text.secondary">{project.location}</Typography>
          </Box>

          <Chip
            label={project.status}
            color={STATUS_COLORS[project.status] || "default"}
          />
        </Box>

        {project.description && (
          <Typography color="text.secondary" mb={3}>
            {project.description}
          </Typography>
        )}

        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2" color="text.secondary">
            Overall Progress
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {project.progress || 0}%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={Number(project.progress || 0)}
          sx={{ height: 10, borderRadius: 5, mb: 3 }}
        />

        <Grid container spacing={3}>
          {project.startDate && (
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Start Date
              </Typography>
              <Typography fontWeight={600}>
                {new Date(project.startDate).toLocaleDateString("en-IN")}
              </Typography>
            </Grid>
          )}

          {project.endDate && (
            <Grid item xs={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Expected Completion
              </Typography>
              <Typography fontWeight={600}>
                {new Date(project.endDate).toLocaleDateString("en-IN")}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Recent Site Updates */}

      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Recent Site Updates
        </Typography>

        {recentUpdates.length === 0 ? (
          <Typography color="text.secondary">
            No site updates have been posted yet.
          </Typography>
        ) : (
          recentUpdates.map((report, idx) => (
            <Box key={report._id}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                {WEATHER_ICONS[report.weather]}
                <Typography variant="subtitle2" fontWeight={700}>
                  {new Date(report.reportDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  · Progress at {report.progress}%
                </Typography>
              </Box>

              <Typography color="text.secondary" mb={2}>
                {report.workDescription}
              </Typography>

              {idx < recentUpdates.length - 1 && <Divider sx={{ mb: 2 }} />}
            </Box>
          ))
        )}
      </Paper>

      {/* Site Photos */}

      {allImages.length > 0 && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Site Photos
          </Typography>

          <ImageList cols={4} gap={12} sx={{ m: 0 }}>
            {allImages.map((imgPath, idx) => (
              <ImageListItem
                key={idx}
                sx={{ borderRadius: 1, overflow: "hidden" }}
              >
                <img
                  src={`${apiOrigin}${imgPath}`}
                  alt={`Site photo ${idx + 1}`}
                  loading="lazy"
                  style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Paper>
      )}
    </Box>
  );
};

export default PortalProjectDetails;
