// ===============================================
// KV Projects ERP
// Project Profitability
// ===============================================

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  LinearProgress,
} from "@mui/material";

import {
  ArrowBack,
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
  Warning,
  Business,
} from "@mui/icons-material";

import { toast } from "react-toastify";

import profitabilityService from "../../services/profitabilityService";

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
// Component
// ===============================================

const ProjectProfitability = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =============================================
  // State
  // =============================================

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =============================================
  // Load Profitability
  // =============================================

  const loadProfitability = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await profitabilityService.getProjectProfitability(id);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load profitability.");
      }

      setData(response);
    } catch (err) {
      console.error("Load profitability error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to load profitability data.";

      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Project ID is missing.");
      setLoading(false);
      return;
    }

    loadProfitability();
  }, [id]);

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

  if (error || !data) {
    return (
      <Box p={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("../projects")}
          sx={{ mb: 2 }}
        >
          Back to Projects
        </Button>

        <Alert severity="error">
          {error || "Profitability data not found."}
        </Alert>
      </Box>
    );
  }

  const {
    project,
    budget,
    actualCost,
    revenue,
    variance,
    profit,
    budgetUsedPercent,
    isOverBudget,
    expensesByCategory,
  } = data;

  const isProfitable = profit >= 0;

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
          onClick={() => navigate(`../projects/view/${project._id}`)}
          sx={{ mb: 1 }}
        >
          Back to Project
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
          <Box display="flex" alignItems="center" gap={1.5}>
            <AccountBalanceWallet color="primary" sx={{ fontSize: 36 }} />

            <Box>
              <Typography variant="h4" fontWeight={700}>
                {project.projectName}
              </Typography>

              <Typography color="text.secondary">
                Budget vs actual cost, revenue and profit
              </Typography>
            </Box>
          </Box>

          <Chip
            label={project.status}
            color={project.status === "Completed" ? "success" : "primary"}
          />
        </Box>
      </Box>

      {/* =========================================
          OVER BUDGET WARNING
      ========================================= */}

      {isOverBudget && (
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 3 }}>
          This project has exceeded its budget by{" "}
          <strong>{formatCurrency(Math.abs(variance))}</strong>.
        </Alert>
      )}

      {/* =========================================
          KPI CARDS
      ========================================= */}

      <Grid container spacing={2} mb={3}>
        {/* Budget */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="body2" color="text.secondary">
              Budget
            </Typography>

            <Typography variant="h5" fontWeight={700} mt={1}>
              {formatCurrency(budget)}
            </Typography>
          </Paper>
        </Grid>

        {/* Actual Cost */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="body2" color="text.secondary">
              Actual Cost
            </Typography>

            <Typography
              variant="h5"
              fontWeight={700}
              mt={1}
              color={isOverBudget ? "error.main" : "text.primary"}
            >
              {formatCurrency(actualCost)}
            </Typography>
          </Paper>
        </Grid>

        {/* Revenue */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="body2" color="text.secondary">
              Revenue (Paid Invoices)
            </Typography>

            <Typography variant="h5" fontWeight={700} mt={1}>
              {formatCurrency(revenue)}
            </Typography>
          </Paper>
        </Grid>

        {/* Profit */}

        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              height: "100%",
              bgcolor: isProfitable ? "success.light" : "error.light",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Profit
                </Typography>

                <Typography variant="h5" fontWeight={700} mt={1}>
                  {formatCurrency(profit)}
                </Typography>
              </Box>

              {isProfitable ? (
                <TrendingUp color="success" />
              ) : (
                <TrendingDown color="error" />
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* =========================================
          BUDGET USAGE
      ========================================= */}

      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight={700}>
            Budget Utilization
          </Typography>

          <Typography
            variant="h6"
            fontWeight={700}
            color={isOverBudget ? "error.main" : "primary.main"}
          >
            {budgetUsedPercent}%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={Math.min(budgetUsedPercent, 100)}
          color={isOverBudget ? "error" : "primary"}
          sx={{ height: 10, borderRadius: 5 }}
        />

        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography variant="body2" color="text.secondary">
            {formatCurrency(actualCost)} spent
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {formatCurrency(budget)} budget
          </Typography>
        </Box>
      </Paper>

      {/* =========================================
          EXPENSE BREAKDOWN BY CATEGORY
      ========================================= */}

      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Expense Breakdown by Category
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {Object.keys(expensesByCategory || {}).length === 0 ? (
          <Typography color="text.secondary">
            No expenses recorded for this project yet.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {Object.entries(expensesByCategory).map(([cat, amount]) => (
              <Grid item xs={12} sm={6} md={4} key={cat}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Typography fontWeight={600}>{cat}</Typography>

                  <Typography fontWeight={700}>
                    {formatCurrency(amount)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* =========================================
          PROJECT INFO
      ========================================= */}

      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Project Information
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1.5}>
              <Business color="action" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Site
                </Typography>

                <Typography fontWeight={600}>
                  {project.site?.siteName || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1.5}>
              <Business color="action" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Project Manager
                </Typography>

                <Typography fontWeight={600}>
                  {project.projectManager?.name || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProjectProfitability;
