// ===============================================
// KV Projects ERP
// Project Details / Project 360°
// ===============================================

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProject, getProjectExpenses } from "../../services/projectService";

import api from "../../services/api";

import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  ArrowBack,
  Edit,
  Refresh,
  AccountBalanceWallet,
  ReceiptLong,
  TrendingUp,
  Event,
  LocationOn,
  Person,
  Business,
  Description,
} from "@mui/icons-material";

// ===============================================
// Currency Formatter
// ===============================================

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

// ===============================================
// Date Formatter
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

const ProjectDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  // =============================================
  // State
  // =============================================

  const [project, setProject] = useState(null);

  const [expenseData, setExpenseData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [expenseLoading, setExpenseLoading] = useState(false);

  // =============================================
  // Load Project
  // =============================================

  const loadProject = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProject(id);

      setProject(response?.project || null);
    } catch (err) {
      console.error("Get project error:", err);

      setError(err.response?.data?.message || "Unable to load project.");
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // Load Project Expenses
  // =============================================

  const loadExpenses = async () => {
    try {
      setExpenseLoading(true);

      const response = await api.get(`/expenses/project/${id}`);

      setExpenseData(response?.data || null);
    } catch (err) {
      console.error("Get project expenses error:", err);

      // Don't block the entire project page
      // if expenses are not available.
      setExpenseData(null);
    } finally {
      setExpenseLoading(false);
    }
  };

  // =============================================
  // Initial Load
  // =============================================

  useEffect(() => {
    if (!id) return;

    loadProject();
    loadExpenses();
  }, [id]);

  // =============================================
  // Refresh
  // =============================================

  const handleRefresh = () => {
    loadProject();
    loadExpenses();
  };

  // =============================================
  // Budget
  // =============================================

  const budget = Number(project?.budget || 0);

  // =============================================
  // Expense
  // =============================================

  const totalExpense = Number(expenseData?.summary?.totalExpense || 0);

  // =============================================
  // Remaining Budget
  // =============================================

  const remainingBudget = Math.max(budget - totalExpense, 0);

  // =============================================
  // Utilization
  // =============================================

  const utilization = useMemo(() => {
    if (budget <= 0) return 0;

    return Math.min((totalExpense / budget) * 100, 100);
  }, [budget, totalExpense]);

  // =============================================
  // Progress
  // =============================================

  const progress = Math.min(Math.max(Number(project?.progress || 0), 0), 100);

  // =============================================
  // Category Totals
  // =============================================

  const categoryTotals = expenseData?.categoryTotals || {};

  const categoryEntries = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  );

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
        <CircularProgress />
      </Box>
    );
  }

  // =============================================
  // Error
  // =============================================

  if (error) {
    return (
      <Box p={3}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" onClick={loadProject}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // =============================================
  // Project Not Found
  // =============================================

  if (!project) {
    return (
      <Box p={3}>
        <Alert severity="warning">Project not found.</Alert>
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
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("../projects")}
            sx={{ mb: 1 }}
          >
            Back to Projects
          </Button>

          <Typography variant="h4" fontWeight={700}>
            {project.projectName}
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mt={1}
            flexWrap="wrap"
          >
            <Chip
              label={project.status || "Pending"}
              color={getStatusColor(project.status)}
              size="small"
            />

            {project.clientName && (
              <Typography color="text.secondary">
                Client: {project.clientName}
              </Typography>
            )}
          </Box>
        </Box>

        <Box display="flex" gap={1}>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={expenseLoading}>
              <Refresh />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`../projects/edit/${id}`)}
          >
            Edit Project
          </Button>
        </Box>
      </Box>

      {/* =========================================
          PROJECT KPI CARDS
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
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Project Budget
                </Typography>

                <Typography variant="h5" fontWeight={700} mt={1}>
                  {formatCurrency(budget)}
                </Typography>
              </Box>

              <AccountBalanceWallet color="primary" />
            </Box>
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
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Expenses
                </Typography>

                <Typography variant="h5" fontWeight={700} mt={1}>
                  {formatCurrency(totalExpense)}
                </Typography>
              </Box>

              <ReceiptLong color="error" />
            </Box>
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
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Remaining Budget
                </Typography>

                <Typography variant="h5" fontWeight={700} mt={1}>
                  {formatCurrency(remainingBudget)}
                </Typography>
              </Box>

              <TrendingUp color="success" />
            </Box>
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

            <Typography variant="h5" fontWeight={700} mt={1} mb={1}>
              {progress}%
            </Typography>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 5,
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* =========================================
          FINANCIAL OVERVIEW
      ========================================= */}

      <Grid container spacing={3} mb={3}>
        {/* Budget Utilization */}

        <Grid item xs={12} md={7}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Budget Utilization
            </Typography>

            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">Spent</Typography>

              <Typography fontWeight={700}>
                {formatCurrency(totalExpense)}
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={utilization}
              sx={{
                height: 12,
                borderRadius: 6,
              }}
            />

            <Box display="flex" justifyContent="space-between" mt={1}>
              <Typography variant="body2" color="text.secondary">
                {utilization.toFixed(1)}% utilized
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Budget: {formatCurrency(budget)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Expense Categories */}

        <Grid item xs={12} md={5}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Expense Categories
            </Typography>

            {categoryEntries.length === 0 ? (
              <Typography color="text.secondary">
                No project expenses yet.
              </Typography>
            ) : (
              categoryEntries.map(([category, amount]) => {
                const percentage =
                  totalExpense > 0 ? (Number(amount) / totalExpense) * 100 : 0;

                return (
                  <Box key={category} mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography>{category}</Typography>

                      <Typography fontWeight={600}>
                        {formatCurrency(amount)}
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 6,
                        borderRadius: 4,
                      }}
                    />
                  </Box>
                );
              })
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* =========================================
          PROJECT INFORMATION
      ========================================= */}

      <Paper
        sx={{
          p: 3,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={2}>
          Project Information
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Client */}

          <Grid item xs={12} sm={6} md={4}>
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

          <Grid item xs={12} sm={6} md={4}>
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

          {/* Created By */}

          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" gap={1.5}>
              <Person color="action" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Created By
                </Typography>

                <Typography fontWeight={600}>
                  {project.createdBy?.name || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Start Date */}

          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" gap={1.5}>
              <Event color="action" />

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

          <Grid item xs={12} sm={6} md={4}>
            <Box display="flex" gap={1.5}>
              <Event color="action" />

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

          {/* Description */}

          <Grid item xs={12}>
            <Box display="flex" gap={1.5}>
              <Description color="action" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Description
                </Typography>

                <Typography
                  mt={0.5}
                  sx={{
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {project.description || "No description available."}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* =========================================
          RECENT EXPENSES
      ========================================= */}

      <Paper
        sx={{
          borderRadius: 2,
          overflow: "hidden",
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
              Project Expenses
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Recent expenses recorded against this project
            </Typography>
          </Box>

          <Button variant="outlined" onClick={() => navigate("../expenses")}>
            View All Expenses
          </Button>
        </Box>

        <Divider />

        {expenseLoading ? (
          <Box py={6} display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : !expenseData?.expenses?.length ? (
          <Box py={6} textAlign="center">
            <ReceiptLong
              sx={{
                fontSize: 50,
                opacity: 0.3,
              }}
            />

            <Typography variant="h6" mt={1}>
              No expenses found
            </Typography>

            <Typography variant="body2" color="text.secondary">
              No expenses have been recorded for this project.
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
                    <strong>Site</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Vendor</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Bill No.</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>Amount</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {expenseData.expenses.slice(0, 10).map((expense) => (
                  <TableRow key={expense._id} hover>
                    <TableCell>{formatDate(expense.expenseDate)}</TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={expense.category || "Miscellaneous"}
                      />
                    </TableCell>

                    <TableCell>{expense.site?.siteName || "-"}</TableCell>

                    <TableCell>{expense.vendorName || "-"}</TableCell>

                    <TableCell>{expense.billNumber || "-"}</TableCell>

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
    </Box>
  );
};

export default ProjectDetails;
