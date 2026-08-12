// ===============================================
// KV Projects ERP
// Expense List
// ===============================================

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Add,
  CalendarMonth,
  DeleteOutline,
  EditOutlined,
  FilterAltOff,
  Refresh,
  ReceiptLong,
  Search,
  VisibilityOutlined,
  TrendingDown,
} from "@mui/icons-material";

import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import { getExpenses, deleteExpense } from "../../services/expenseService";

import { getProjects } from "../../services/projectService";

// ===============================================
// Categories
// ===============================================

const categories = [
  "Material",
  "Labour",
  "Transport",
  "Machinery",
  "Food",
  "Fuel",
  "Electrical",
  "Miscellaneous",
];

// ===============================================
// Currency Formatter
// ===============================================

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

// ===============================================
// Date Formatter
// ===============================================

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ===============================================
// Category Chip
// ===============================================

const getCategoryColor = (category) => {
  switch (category) {
    case "Material":
      return "primary";

    case "Labour":
      return "secondary";

    case "Transport":
      return "warning";

    case "Machinery":
      return "info";

    case "Food":
      return "success";

    case "Fuel":
      return "error";

    case "Electrical":
      return "secondary";

    default:
      return "default";
  }
};

// ===============================================
// Component
// ===============================================

const ExpenseList = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  // =============================================
  // State
  // =============================================

  const [expenses, setExpenses] = useState([]);

  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  // =============================================
  // Filters
  // =============================================

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");

  const [project, setProject] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  // =============================================
  // Pagination
  // =============================================

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [totalRows, setTotalRows] = useState(0);

  // =============================================
  // Statistics
  // =============================================

  const [totalAmount, setTotalAmount] = useState(0);

  // =============================================
  // Load Projects
  // =============================================

  const loadProjects = useCallback(async () => {
    try {
      const response = await getProjects();

      setProjects(response?.projects || []);
    } catch (err) {
      console.error("Load projects error:", err);
    }
  }, []);

  // =============================================
  // Load Expenses
  // =============================================

  const loadExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (category) {
        params.category = category;
      }

      if (project) {
        params.project = project;
      }

      if (startDate) {
        params.startDate = startDate;
      }

      if (endDate) {
        params.endDate = endDate;
      }

      const response = await getExpenses(params);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load expenses.");
      }

      setExpenses(response.expenses || []);

      setTotalRows(Number(response.totalExpenses || 0));

      setTotalAmount(Number(response.totalAmount || 0));
    } catch (err) {
      console.error("Load expenses error:", err);

      const message =
        err.response?.data?.message ||
        err.message ||
        "Unable to load expenses.";

      setError(message);

      setExpenses([]);
      setTotalRows(0);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, category, project, startDate, endDate]);

  // =============================================
  // Initial Projects
  // =============================================

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // =============================================
  // Load Expenses
  // =============================================

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // =============================================
  // Reset Filters
  // =============================================

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setProject("");
    setStartDate("");
    setEndDate("");
    setPage(0);
  };

  // =============================================
  // Search Change
  // =============================================

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  // =============================================
  // Category Change
  // =============================================

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(0);
  };

  // =============================================
  // Project Change
  // =============================================

  const handleProjectChange = (event) => {
    setProject(event.target.value);
    setPage(0);
  };

  // =============================================
  // Start Date
  // =============================================

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    setPage(0);
  };

  // =============================================
  // End Date
  // =============================================

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    setPage(0);
  };

  // =============================================
  // Pagination
  // =============================================

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number(event.target.value));

    setPage(0);
  };

  // =============================================
  // Delete Expense
  // =============================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await deleteExpense(id);

      if (!response?.success) {
        throw new Error(response?.message || "Unable to delete expense.");
      }

      toast.success(response.message || "Expense deleted successfully.");

      await loadExpenses();
    } catch (err) {
      console.error("Delete expense error:", err);

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Unable to delete expense.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =============================================
  // Filter Status
  // =============================================

  const activeFilterCount = useMemo(() => {
    return [search, category, project, startDate, endDate].filter(Boolean)
      .length;
  }, [search, category, project, startDate, endDate]);

  // =============================================
  // Render
  // =============================================

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      {/* =========================================
          HEADER
      ========================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Expenses
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Manage and monitor project expenses
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={loadExpenses}
            disabled={loading}
            sx={{
              textTransform: "none",
            }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(`/${role}/expenses/create`)}
            sx={{
              textTransform: "none",
            }}
          >
            Add Expense
          </Button>
        </Stack>
      </Box>

      {/* =========================================
          KPI CARDS
      ========================================= */}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Total Expense */}

        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={1}
            sx={{
              height: "100%",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Expenses
                  </Typography>

                  <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                    {formatCurrency(totalAmount)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "error.light",
                  }}
                >
                  <TrendingDown color="error" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Expense Count */}

        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={1}
            sx={{
              height: "100%",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Expense Records
                  </Typography>

                  <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                    {totalRows}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.light",
                  }}
                >
                  <ReceiptLong color="primary" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Filters */}

        <Grid item xs={12} sm={12} md={4}>
          <Card
            elevation={1}
            sx={{
              height: "100%",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Active Filters
                  </Typography>

                  <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                    {activeFilterCount}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "warning.light",
                  }}
                >
                  <CalendarMonth color="warning" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* =========================================
          FILTER PANEL
      ========================================= */}

      <Paper
        elevation={1}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            Filters
          </Typography>

          {activeFilterCount > 0 && (
            <Button
              size="small"
              startIcon={<FilterAltOff />}
              onClick={handleClearFilters}
              sx={{
                textTransform: "none",
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>

        <Grid container spacing={2}>
          {/* Search */}

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Vendor, bill number, description..."
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Category */}

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>

              <Select
                value={category}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">All Categories</MenuItem>

                {categories.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Project */}

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>

              <Select
                value={project}
                label="Project"
                onChange={handleProjectChange}
              >
                <MenuItem value="">All Projects</MenuItem>

                {projects.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.projectName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Start Date */}

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="date"
              label="From Date"
              value={startDate}
              onChange={handleStartDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* End Date */}

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="date"
              label="To Date"
              value={endDate}
              onChange={handleEndDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* =========================================
          ERROR
      ========================================= */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={loadExpenses}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* =========================================
          TABLE
      ========================================= */}

      <Paper
        elevation={1}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Expense Records
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Showing {expenses.length} records
            </Typography>
          </Box>
        </Box>

        <Divider />

        <TableContainer
          sx={{
            maxHeight: 650,
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Date</strong>
                </TableCell>

                <TableCell>
                  <strong>Project</strong>
                </TableCell>

                <TableCell>
                  <strong>Category</strong>
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

                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Loading */}

              {loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <CircularProgress />

                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                      Loading expenses...
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {/* Empty */}

              {!loading && expenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <ReceiptLong
                      sx={{
                        fontSize: 50,
                        color: "text.disabled",
                      }}
                    />

                    <Typography variant="h6" sx={{ mt: 1 }}>
                      No expenses found
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      Try changing your filters or add a new expense.
                    </Typography>

                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => navigate(`/${role}/expenses/create`)}
                      sx={{
                        mt: 2,
                        textTransform: "none",
                      }}
                    >
                      Add Expense
                    </Button>
                  </TableCell>
                </TableRow>
              )}

              {/* Data */}

              {!loading &&
                expenses.map((expense) => (
                  <TableRow key={expense._id} hover>
                    {/* Date */}

                    <TableCell>{formatDate(expense.expenseDate)}</TableCell>

                    {/* Project */}

                    <TableCell>
                      <Box>
                        <Typography fontWeight={600} variant="body2">
                          {expense.project?.projectName || "-"}
                        </Typography>

                        {expense.project?.clientName && (
                          <Typography variant="caption" color="text.secondary">
                            {expense.project.clientName}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    {/* Category */}

                    <TableCell>
                      <Chip
                        label={expense.category || "Miscellaneous"}
                        size="small"
                        color={getCategoryColor(expense.category)}
                      />
                    </TableCell>

                    {/* Vendor */}

                    <TableCell>{expense.vendorName || "-"}</TableCell>

                    {/* Bill */}

                    <TableCell>{expense.billNumber || "-"}</TableCell>

                    {/* Amount */}

                    <TableCell align="right">
                      <Typography fontWeight={700}>
                        {formatCurrency(expense.amount)}
                      </Typography>
                    </TableCell>

                    {/* Actions */}

                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                      >
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              navigate(`/${role}/expenses/view/${expense._id}`)
                            }
                          >
                            <VisibilityOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() =>
                              navigate(`/${role}/expenses/edit/${expense._id}`)
                            }
                          >
                            <EditOutlined fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={deletingId === expense._id}
                              onClick={() => handleDelete(expense._id)}
                            >
                              {deletingId === expense._id ? (
                                <CircularProgress size={18} />
                              ) : (
                                <DeleteOutline fontSize="small" />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* =======================================
            PAGINATION
        ======================================= */}

        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
    </Box>
  );
};

export default ExpenseList;
