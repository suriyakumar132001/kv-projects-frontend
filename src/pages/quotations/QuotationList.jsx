// ===============================================
// QuotationList.jsx
// Construction ERP - Quotation List
// ===============================================

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

import { Add, Visibility, Edit, Delete } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = ["Draft", "Sent", "Approved", "Rejected"];

const statusColor = (status) => {
  switch (status) {
    case "Approved":
      return "success";
    case "Sent":
      return "primary";
    case "Rejected":
      return "error";
    default:
      return "warning"; // Draft
  }
};

const QuotationList = () => {
  const navigate = useNavigate();

  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const token = () => localStorage.getItem("token");

  // ===============================================
  // Fetch Quotations
  // ===============================================

  const fetchQuotations = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/quotations",
        {
          headers: { Authorization: `Bearer ${token()}` },
        },
      );

      // Backend returns { success, count, quotations }
      setQuotations(response.data.quotations || []);
    } catch (err) {
      console.log(err);
      setError("Unable to fetch quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // ===============================================
  // Quick Status Update
  // ===============================================

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/quotations/status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token()}` } },
      );

      setQuotations((prev) =>
        prev.map((q) => (q._id === id ? { ...q, status: newStatus } : q)),
      );
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  // ===============================================
  // Delete
  // ===============================================

  const deleteQuotation = async (id) => {
    const confirmDelete = window.confirm("Delete this quotation?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/quotations/${id}`, {
        headers: { Authorization: `Bearer ${token()}` },
      });

      fetchQuotations();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // ===============================================
  // Filter
  // ===============================================

  const filteredQuotations = quotations.filter((item) => {
    const number = item.quotationNumber || "";
    const clientName = item.client?.clientName || "";
    const project = item.projectName || "";

    const searchMatch =
      number.toLowerCase().includes(search.toLowerCase()) ||
      clientName.toLowerCase().includes(search.toLowerCase()) ||
      project.toLowerCase().includes(search.toLowerCase());

    const statusMatch = status ? item.status === status : true;

    return searchMatch && statusMatch;
  });

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

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Quotations
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/owner/quotations/create")}
        >
          New Quotation
        </Button>
      </Box>

      {/* Filters */}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Quotation No / Client / Project"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Filter Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Quotation No</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Valid Till</TableCell>
                <TableCell>Grand Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredQuotations.length > 0 ? (
                filteredQuotations.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <strong>{item.quotationNumber}</strong>
                    </TableCell>

                    <TableCell>{item.client?.clientName || "-"}</TableCell>

                    <TableCell>{item.projectName || "-"}</TableCell>

                    <TableCell>
                      {item.validTill
                        ? new Date(item.validTill).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell>
                      ₹ {Number(item.grandTotal || 0).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <Select
                        size="small"
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item._id, e.target.value)
                        }
                        renderValue={(value) => (
                          <Chip
                            label={value}
                            color={statusColor(value)}
                            size="small"
                          />
                        )}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>

                    <TableCell>
                      <IconButton
                        onClick={() =>
                          navigate(`/owner/quotations/view/${item._id}`)
                        }
                      >
                        <Visibility />
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          navigate(`/owner/quotations/edit/${item._id}`)
                        }
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => deleteQuotation(item._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    style={{ textAlign: "center", padding: "30px" }}
                  >
                    No Quotations Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default QuotationList;