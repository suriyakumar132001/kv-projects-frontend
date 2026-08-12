// ===============================================
// KV Projects ERP
// Project 360° Dashboard
// ===============================================

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  ArrowBack,
  AccountBalanceWallet,
  TrendingUp,
  ReceiptLong,
  LocationOn,
  Business,
  CalendarMonth,
  Warning,
} from "@mui/icons-material";

import { toast } from "react-toastify";

import api from "../../services/api";

import { getProject } from "../../services/projectService";

// ===============================================
// Currency
// ===============================================

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

// ===============================================
// Date
// ===============================================

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ===============================================
// Status Color
// ===============================================

const getStatusColor = (status) => {
  switch (status) {
    case "Running":
      return "success";

    case "Completed":
      return "primary";

    case "On Hold":
      return "warning";

    case "Pending":
      return "default";

    default:
      return "default";
  }
};

// ===============================================
// Component
// ===============================================

const ProjectDashboard = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  // =============================================
  // State
  // =============================================

  const [project, setProject] = useState(null);

  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =============================================
  // Load Project
  // =============================================

  const loadProject = async () => {
    try {
      const response = await getProject(id);

      setProject(response?.project || null);
    } catch (err) {
      console.error("Load project error:", err);

      throw err;
    }
  };

  // =============================================
  // Load Project Expenses
  // =============================================

  const loadExpenses = async () => {
    try {
      const response = await api.get(`/expenses/project/${id}`);

      setExpenses(response?.data?.expenses || []);
    } catch (err) {
      console.error("Load project expenses error:", err);

      // Don't crash the whole dashboard
      setExpenses([]);
    }
  };

  // =============================================
  // Initial Load
  // =============================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([loadProject(), loadExpenses()]);
      } catch (err) {
        console.error("Project dashboard error:", err);

        const message =
          err.response?.data?.message || "Unable to load project dashboard.";

        setError(message);

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDashboard();
    }
  }, [id]);

  // =============================================
  // Total Expenses
  // =============================================

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (total, expense) => total + Number(expense.amount || 0),
      0,
    );
  }, [expenses]);

  // =============================================
  // Budget
  // =============================================

  const budget = Number(project?.budget || 0);

  // =============================================
  // Remaining Budget
  // =============================================

  const remainingBudget = budget - totalExpenses;

  // =============================================
  // Expense Percentage
  // =============================================

  const expensePercentage =
    budget > 0 ? Math.min((totalExpenses / budget) * 100, 100) : 0;

  // =============================================
  // Project Progress
  // =============================================

  const projectProgress = Math.min(
    Math.max(Number(project?.progress || 0), 0),
    100,
  );

  // =============================================
  // Category Breakdown
  // =============================================

  const categoryBreakdown = useMemo(() => {
    const breakdown = {};

    expenses.forEach((expense) => {
      const category = expense.category || "Miscellaneous";

      if (!breakdown[category]) {
        breakdown[category] = 0;
      }

      breakdown[category] += Number(expense.amount || 0);
    });

    return Object.entries(breakdown)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  // =============================================
  // Recent Expenses
  // =============================================

  const recentExpenses = [...expenses]
    .sort(
      (a, b) =>
        new Date(b.expenseDate || b.createdAt) -
        new Date(a.expenseDate || a.createdAt),
    )
    .slice(0, 5);

  // =============================================
  // Loading
  // =============================================

  if (loading) {
    return (
      <Box
        minHeight="60vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  // =============================================
  // Error
  // =============================================

  if (error || !project) {
    return (
      <Box p={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("../projects")}
          sx={{ mb: 2 }}
        >
          Back to Projects
        </Button>

        <Alert severity="error">{error || "Project not found."}</Alert>
      </Box>
    );
  }

  // =============================================
  // Render
  // =============================================

  return (
    <Box
      p={{
        xs: 2,
        md: 3,
      }}
    >
      {/* =========================================
          HEADER
      ========================================= */}

      <Box mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("../projects")}
          sx={{ mb: 1 }}
        >
          Back to Projects
        </Button>

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
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {project.projectName}
            </Typography>

            <Typography color="text.secondary" mt={0.5}>
              Project 360° Dashboard
            </Typography>
          </Box>

          <Chip
            label={project.status || "Pending"}
            color={getStatusColor(project.status)}
            sx={{
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      {/* =========================================
          PROJECT INFORMATION
      ========================================= */}

      <Paper
        sx={{
          p: {
            xs: 2,
            md: 3,
          },
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Grid container spacing={3}>
          {/* Client */}

          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" gap={1.5}>
              <Business color="action" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Client
                </Typography>

                <Typography fontWeight={600}>
                  {project.clientName || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Location */}

          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" gap={1.5}>
              <LocationOn color="action" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Location
                </Typography>

                <Typography fontWeight={600}>
                  {project.location || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Start Date */}

          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" gap={1.5}>
              <CalendarMonth color="action" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Start Date
                </Typography>

                <Typography fontWeight={600}>
                  {formatDate(project.startDate)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* End Date */}

          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" gap={1.5}>
              <CalendarMonth color="action" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  End Date
                </Typography>

                <Typography fontWeight={600}>
                  {formatDate(project.endDate)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* =========================================
          KPI CARDS
      ========================================= */}

      <Grid container spacing={2} mb={3}>
        {/* Budget */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Project Budget
            </Typography>

            <Typography variant="h5" fontWeight={700} mt={1}>
              {formatCurrency(budget)}
            </Typography>

            <AccountBalanceWallet color="primary" sx={{ mt: 1 }} />
          </Paper>
        </Grid>

        {/* Expenses */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Total Expenses
            </Typography>

            <Typography variant="h5" fontWeight={700} mt={1}>
              {formatCurrency(totalExpenses)}
            </Typography>

            <ReceiptLong color="error" sx={{ mt: 1 }} />
          </Paper>
        </Grid>

        {/* Remaining */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Remaining Budget
            </Typography>

            <Typography
              variant="h5"
              fontWeight={700}
              mt={1}
              color={remainingBudget < 0 ? "error.main" : "success.main"}
            >
              {formatCurrency(remainingBudget)}
            </Typography>

            {remainingBudget < 0 ? (
              <Warning color="error" sx={{ mt: 1 }} />
            ) : (
              <AccountBalanceWallet color="success" sx={{ mt: 1 }} />
            )}
          </Paper>
        </Grid>

        {/* Progress */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Project Progress
            </Typography>

            <Typography variant="h5" fontWeight={700} mt={1}>
              {projectProgress}%
            </Typography>

            <LinearProgress
              variant="determinate"
              value={projectProgress}
              sx={{
                mt: 1.5,
                height: 7,
                borderRadius: 5,
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* =========================================
          BUDGET + PROGRESS
      ========================================= */}

      <Grid container spacing={3} mb={3}>
        {/* Budget Usage */}

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Budget Utilization
            </Typography>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Used
              </Typography>

              <Typography fontWeight={700}>
                {expensePercentage.toFixed(1)}%
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={expensePercentage}
              sx={{
                height: 12,
                borderRadius: 6,
              }}
            />

            <Box display="flex" justifyContent="space-between" mt={2}>
              <Typography variant="body2">
                Spent: <strong>{formatCurrency(totalExpenses)}</strong>
              </Typography>

              <Typography variant="body2">
                Budget: <strong>{formatCurrency(budget)}</strong>
              </Typography>
            </Box>

            {remainingBudget < 0 && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Project expenses have exceeded the allocated budget.
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Project Progress */}

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Project Progress
            </Typography>

            <Box display="flex" alignItems="center" gap={3}>
              <Box
                sx={{
                  width: 130,
                  height: 130,
                  borderRadius: "50%",
                  border: "10px solid",
                  borderColor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Typography variant="h5" fontWeight={700}>
                  {projectProgress}%
                </Typography>
              </Box>

              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {project.status || "Pending"}
                </Typography>

                <Typography variant="body2" color="text.secondary" mt={1}>
                  Project completion progress based on the current project
                  status and progress.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* =========================================
          EXPENSE BREAKDOWN
      ========================================= */}

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={5}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Expense Breakdown
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {categoryBreakdown.length === 0 ? (
              <Box py={5} textAlign="center">
                <ReceiptLong
                  sx={{
                    fontSize: 50,
                    opacity: 0.3,
                  }}
                />

                <Typography color="text.secondary" mt={1}>
                  No expenses recorded yet.
                </Typography>
              </Box>
            ) : (
              categoryBreakdown.map((item) => {
                const percentage =
                  totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;

                return (
                  <Box key={item.category} mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" fontWeight={600}>
                        {item.category}
                      </Typography>

                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(item.amount)}
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 7,
                        borderRadius: 5,
                      }}
                    />

                    <Typography variant="caption" color="text.secondary">
                      {percentage.toFixed(1)}% of total
                    </Typography>
                  </Box>
                );
              })
            )}
          </Paper>
        </Grid>

        {/* Recent Expenses */}

        <Grid item xs={12} md={7}>
          <Paper
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              height: "100%",
            }}
          >
            <Box
              p={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Recent Expenses
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Latest project expenses
                </Typography>
              </Box>

              <Button onClick={() => navigate("../expenses")}>View All</Button>
            </Box>

            <Divider />

            {recentExpenses.length === 0 ? (
              <Box py={5} textAlign="center">
                <ReceiptLong
                  sx={{
                    fontSize: 50,
                    opacity: 0.3,
                  }}
                />

                <Typography color="text.secondary" mt={1}>
                  No expenses recorded.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Date</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Category</strong>
                      </TableCell>

                      <TableCell>
                        <strong>Vendor</strong>
                      </TableCell>

                      <TableCell align="right">
                        <strong>Amount</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {recentExpenses.map((expense) => (
                      <TableRow
                        key={expense._id}
                        hover
                        sx={{
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`../expenses/${expense._id}`)}
                      >
                        <TableCell>{formatDate(expense.expenseDate)}</TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={expense.category || "Miscellaneous"}
                          />
                        </TableCell>

                        <TableCell>{expense.vendorName || "-"}</TableCell>

                        <TableCell align="right">
                          <Typography fontWeight={700}>
                            {formatCurrency(expense.amount)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* =========================================
          DESCRIPTION
      ========================================= */}

      {project.description && (
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={1}>
            Project Description
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Typography
            color="text.secondary"
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.8,
            }}
          >
            {project.description}
          </Typography>
        </Paper>
      )}

      {/* =========================================
          BOTTOM ACTIONS
      ========================================= */}

      <Box
        display="flex"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("../projects")}
        >
          Back to Projects
        </Button>

        <Box display="flex" gap={1}>
          <Button variant="outlined" onClick={() => navigate("../expenses")}>
            View Expenses
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("../expenses/create")}
          >
            Add Expense
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectDashboard;
