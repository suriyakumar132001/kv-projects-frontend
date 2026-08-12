// ===============================================
// KV Projects ERP
// Project List
// ===============================================

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  getProjects,
  getProjectStats,
  deleteProject,
} from "../../services/projectService";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  InputAdornment,
} from "@mui/material";

import {
  Add,
  Search,
  Visibility,
  Edit,
  Delete,
  Refresh,
  Folder,
  PlayCircle,
  PendingActions,
  CheckCircle,
  PauseCircle,
  CurrencyRupee,
} from "@mui/icons-material";

// ===============================================
// Component
// ===============================================

const ProjectList = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const role = user?.role?.toLowerCase();

  // =============================================
  // State
  // =============================================

  const [projects, setProjects] = useState([]);

  const [stats, setStats] = useState({
    totalProjects: 0,
    runningProjects: 0,
    pendingProjects: 0,
    completedProjects: 0,
    onHoldProjects: 0,
    totalBudget: 0,
  });

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  const [deleting, setDeleting] = useState(null);

  const [error, setError] = useState("");

  // =============================================
  // Fetch Projects
  // =============================================

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProjects();

      setProjects(response?.projects || []);
    } catch (err) {
      console.error("Project fetch error:", err);

      setError(err.response?.data?.message || "Unable to load projects");
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // Fetch Statistics
  // =============================================

  const fetchStats = async () => {
    try {
      const response = await getProjectStats();

      if (response?.stats) {
        setStats(response.stats);
      }
    } catch (err) {
      console.error("Project stats error:", err);
    }
  };

  // =============================================
  // Initial Load
  // =============================================

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  // =============================================
  // Refresh
  // =============================================

  const handleRefresh = async () => {
    await Promise.all([fetchProjects(), fetchStats()]);
  };

  // =============================================
  // Delete Project
  // =============================================

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(projectId);

      await deleteProject(projectId);

      setProjects((previousProjects) =>
        previousProjects.filter((project) => project._id !== projectId),
      );

      await fetchStats();
    } catch (err) {
      console.error("Delete project error:", err);

      setError(err.response?.data?.message || "Unable to delete project");
    } finally {
      setDeleting(null);
    }
  };

  // =============================================
  // Status Color
  // =============================================

  const getStatusColor = (status) => {
    switch (status) {
      case "Running":
        return "primary";

      case "Completed":
        return "success";

      case "Pending":
        return "warning";

      case "On Hold":
        return "error";

      default:
        return "default";
    }
  };

  // =============================================
  // Status Icon
  // =============================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Running":
        return <PlayCircle fontSize="small" />;

      case "Completed":
        return <CheckCircle fontSize="small" />;

      case "Pending":
        return <PendingActions fontSize="small" />;

      case "On Hold":
        return <PauseCircle fontSize="small" />;

      default:
        return null;
    }
  };

  // =============================================
  // Format Currency
  // =============================================

  const formatCurrency = (amount) => {
    const value = Number(amount || 0);

    return `₹ ${value.toLocaleString("en-IN")}`;
  };

  // =============================================
  // Filter Projects
  // =============================================

  const filteredProjects = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !searchValue ||
        project.projectName?.toLowerCase().includes(searchValue) ||
        project.clientName?.toLowerCase().includes(searchValue) ||
        project.location?.toLowerCase().includes(searchValue) ||
        project.projectManager?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  // =============================================
  // KPI Card
  // =============================================

  const StatCard = ({ title, value, icon, color }) => {
    return (
      <Grid item xs={12} sm={6} md={2.4}>
        <Card
          sx={{
            height: "100%",
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>

              {React.cloneElement(icon, {
                sx: {
                  color,
                  fontSize: 28,
                },
              })}
            </Box>

            <Typography variant="h5" fontWeight={700}>
              {value}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
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
            Projects
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Manage and monitor all construction projects
          </Typography>
        </Box>

        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>

          {(role === "owner" || role === "hr") && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate(`/${role}/projects/create`)}
            >
              Add Project
            </Button>
          )}
        </Box>
      </Box>

      {/* =========================================
          Error
      ========================================= */}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* =========================================
          KPI Cards
      ========================================= */}

      <Grid container spacing={2} mb={3}>
        <StatCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<Folder />}
          color="#1976d2"
        />

        <StatCard
          title="Running"
          value={stats.runningProjects}
          icon={<PlayCircle />}
          color="#2e7d32"
        />

        <StatCard
          title="Pending"
          value={stats.pendingProjects}
          icon={<PendingActions />}
          color="#ed6c02"
        />

        <StatCard
          title="Completed"
          value={stats.completedProjects}
          icon={<CheckCircle />}
          color="#388e3c"
        />

        <StatCard
          title="On Hold"
          value={stats.onHoldProjects}
          icon={<PauseCircle />}
          color="#d32f2f"
        />
      </Grid>

      {/* =========================================
          Total Budget
      ========================================= */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1}>
            <CurrencyRupee color="primary" />

            <Typography color="text.secondary">Total Project Budget</Typography>
          </Box>

          <Typography variant="h4" fontWeight={700} mt={1}>
            {formatCurrency(stats.totalBudget)}
          </Typography>
        </CardContent>
      </Card>

      {/* =========================================
          Search + Filter
      ========================================= */}

      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by project, client, location or manager..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              label="Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <MenuItem value="All">All Statuses</MenuItem>

              <MenuItem value="Pending">Pending</MenuItem>

              <MenuItem value="Running">Running</MenuItem>

              <MenuItem value="Completed">Completed</MenuItem>

              <MenuItem value="On Hold">On Hold</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* =========================================
          Result Count
      ========================================= */}

      <Box mb={2}>
        <Typography color="text.secondary">
          Showing <strong>{filteredProjects.length}</strong> of{" "}
          <strong>{projects.length}</strong> projects
        </Typography>
      </Box>

      {/* =========================================
          Project Table
      ========================================= */}

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          overflowX: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Project</strong>
              </TableCell>

              <TableCell>
                <strong>Client</strong>
              </TableCell>

              <TableCell>
                <strong>Location</strong>
              </TableCell>

              <TableCell>
                <strong>Manager</strong>
              </TableCell>

              <TableCell>
                <strong>Budget</strong>
              </TableCell>

              <TableCell sx={{ minWidth: 160 }}>
                <strong>Progress</strong>
              </TableCell>

              <TableCell>
                <strong>Status</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <Folder
                    sx={{
                      fontSize: 50,
                      color: "text.secondary",
                      mb: 1,
                    }}
                  />

                  <Typography variant="h6" color="text.secondary">
                    No projects found
                  </Typography>

                  <Typography color="text.secondary" mt={1}>
                    Try changing your search or status filter.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => {
                const progress = Math.min(
                  100,
                  Math.max(0, Number(project.progress || 0)),
                );

                return (
                  <TableRow key={project._id} hover>
                    {/* Project */}

                    <TableCell>
                      <Typography fontWeight={700}>
                        {project.projectName}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Created{" "}
                        {project.createdAt
                          ? new Date(project.createdAt).toLocaleDateString()
                          : "-"}
                      </Typography>
                    </TableCell>

                    {/* Client */}

                    <TableCell>{project.clientName || "-"}</TableCell>

                    {/* Location */}

                    <TableCell>{project.location || "-"}</TableCell>

                    {/* Manager */}

                    <TableCell>
                      {project.projectManager || "Not Assigned"}
                    </TableCell>

                    {/* Budget */}

                    <TableCell>
                      <Typography fontWeight={600}>
                        {formatCurrency(project.budget)}
                      </Typography>
                    </TableCell>

                    {/* Progress */}

                    <TableCell>
                      <Box>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mb={0.5}
                        >
                          <Typography variant="body2" fontWeight={600}>
                            {progress}%
                          </Typography>
                        </Box>

                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            height: 8,
                            borderRadius: 5,
                          }}
                        />
                      </Box>
                    </TableCell>

                    {/* Status */}

                    <TableCell>
                      <Chip
                        icon={getStatusIcon(project.status)}
                        label={project.status || "Pending"}
                        color={getStatusColor(project.status)}
                        size="small"
                      />
                    </TableCell>

                    {/* Actions */}

                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={0.5}>
                        {/* 360° Dashboard */}

                        <Tooltip title="Project 360°">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              navigate(`/${role}/projects/${project._id}`)
                            }
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>

                        {/* Edit */}

                        {(role === "owner" || role === "hr") && (
                          <Tooltip title="Edit">
                            <IconButton
                              color="warning"
                              onClick={() =>
                                navigate(
                                  `/${role}/projects/edit/${project._id}`,
                                )
                              }
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        )}

                        {/* Delete */}

                        {role === "owner" && (
                          <Tooltip title="Delete">
                            <span>
                              <IconButton
                                color="error"
                                disabled={deleting === project._id}
                                onClick={() => handleDelete(project._id)}
                              >
                                {deleting === project._id ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <Delete />
                                )}
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProjectList;
