// ===============================================
// KV Projects ERP
// Expense Details
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
} from "@mui/material";

import {
  ArrowBack,
  ReceiptLong,
  AccountBalanceWallet,
  Business,
  LocationOn,
  Person,
  CalendarMonth,
  Description,
  ConfirmationNumber,
} from "@mui/icons-material";

import { toast } from "react-toastify";

import api from "../../services/api";

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
// Component
// ===============================================

const ExpenseDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  // =============================================
  // State
  // =============================================

  const [expense, setExpense] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =============================================
  // Load Expense
  // =============================================

  const loadExpense = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/expenses");

      const expenses = response?.data?.expenses || [];

      const foundExpense = expenses.find((item) => item._id === id);

      if (!foundExpense) {
        setError("Expense not found.");

        setExpense(null);
        return;
      }

      setExpense(foundExpense);
    } catch (err) {
      console.error("Get expense details error:", err);

      const message =
        err.response?.data?.message || "Unable to load expense details.";

      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // =============================================
  // Initial Load
  // =============================================

  useEffect(() => {
    if (!id) {
      setError("Expense ID is missing.");

      setLoading(false);

      return;
    }

    loadExpense();
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

  if (error || !expense) {
    return (
      <Box p={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("../expenses")}
          sx={{ mb: 2 }}
        >
          Back to Expenses
        </Button>

        <Alert severity="error">{error || "Expense not found."}</Alert>
      </Box>
    );
  }

  // =============================================
  // Project ID
  // =============================================

  const projectId = expense.project?._id;

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
          onClick={() => navigate("../expenses")}
          sx={{ mb: 1 }}
        >
          Back to Expenses
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
            <ReceiptLong color="primary" sx={{ fontSize: 36 }} />

            <Box>
              <Typography variant="h4" fontWeight={700}>
                Expense Details
              </Typography>

              <Typography color="text.secondary">
                View complete expense information
              </Typography>
            </Box>
          </Box>

          {projectId && (
            <Button
              variant="contained"
              onClick={() => navigate(`../projects/${projectId}`)}
            >
              View Project 360°
            </Button>
          )}
        </Box>
      </Box>

      {/* =========================================
          MAIN KPI
      ========================================= */}

      <Grid container spacing={2} mb={3}>
        {/* Amount */}

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Expense Amount
                </Typography>

                <Typography variant="h4" fontWeight={700} mt={1}>
                  {formatCurrency(expense.amount)}
                </Typography>
              </Box>

              <AccountBalanceWallet color="primary" />
            </Box>
          </Paper>
        </Grid>

        {/* Category */}

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Typography variant="body2" color="text.secondary" mb={1}>
              Expense Category
            </Typography>

            <Chip
              label={expense.category || "Miscellaneous"}
              color="primary"
              variant="outlined"
            />
          </Paper>
        </Grid>

        {/* Date */}

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Typography variant="body2" color="text.secondary" mb={1}>
              Expense Date
            </Typography>

            <Typography variant="h6" fontWeight={600}>
              {formatDate(expense.expenseDate)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

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
        <Typography variant="h6" fontWeight={700} mb={2}>
          Project Information
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Project */}

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1.5}>
              <Business color="action" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Project
                </Typography>

                <Typography fontWeight={600}>
                  {expense.project?.projectName || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Client */}

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1.5}>
              <Business color="action" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Client
                </Typography>

                <Typography fontWeight={600}>
                  {expense.project?.clientName || "-"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Site */}

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1.5}>
              <LocationOn color="action" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Site
                </Typography>

                <Typography fontWeight={600}>
                  {expense.site?.siteName || "-"}
                </Typography>

                {expense.site?.location && (
                  <Typography variant="body2" color="text.secondary">
                    {expense.site.location}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Site Engineer */}

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1.5}>
              <Person color="action" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Site Engineer
                </Typography>

                <Typography fontWeight={600}>
                  {expense.siteEngineer?.name || "-"}
                </Typography>

                {expense.siteEngineer?.email && (
                  <Typography variant="body2" color="text.secondary">
                    {expense.siteEngineer.email}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* =========================================
          BILL / VENDOR INFORMATION
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
        <Typography variant="h6" fontWeight={700} mb={2}>
          Vendor & Bill Information
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Vendor */}

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1.5}>
              <Business color="action" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Vendor Name
                </Typography>

                <Typography fontWeight={600}>
                  {expense.vendorName || "Not provided"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Bill */}

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1.5}>
              <ConfirmationNumber color="action" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Bill Number
                </Typography>

                <Typography fontWeight={600}>
                  {expense.billNumber || "Not provided"}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Date */}

          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1.5}>
              <CalendarMonth color="action" />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Expense Date
                </Typography>

                <Typography fontWeight={600}>
                  {formatDate(expense.expenseDate)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* =========================================
          DESCRIPTION
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
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Description color="action" />

          <Typography variant="h6" fontWeight={700}>
            Description
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography
          sx={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.8,
          }}
          color={expense.description ? "text.primary" : "text.secondary"}
        >
          {expense.description || "No description provided."}
        </Typography>
      </Paper>

      {/* =========================================
          ACTIONS
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
          onClick={() => navigate("../expenses")}
        >
          Back to Expenses
        </Button>

        {projectId && (
          <Button
            variant="contained"
            onClick={() => navigate(`../projects/${projectId}`)}
          >
            Back to Project 360°
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ExpenseDetails;
