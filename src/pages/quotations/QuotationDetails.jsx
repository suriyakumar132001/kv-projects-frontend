// ===============================================
// QuotationDetails.jsx
// Construction ERP - Quotation Details
// ===============================================

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";

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
      return "warning";
  }
};

const QuotationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = () => localStorage.getItem("token");

  const fetchQuotation = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:5000/api/quotations/${id}`,
        { headers: { Authorization: `Bearer ${token()}` } },
      );

      setQuotation(response.data.quotation);
    } catch (err) {
      console.log(err);
      setError("Unable to load quotation");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotation();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/quotations/status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token()}` } },
      );

      setQuotation((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Status update failed");
    }
  };

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

  if (!quotation) {
    return (
      <Box p={3}>
        <Alert severity="warning">Quotation not found</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Quotation {quotation.quotationNumber}
        </Typography>

        <Button
          variant="outlined"
          onClick={() => navigate("/owner/quotations")}
        >
          Back
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight="bold">
            {quotation.projectName}
          </Typography>

          <Select
            size="small"
            value={quotation.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            renderValue={(value) => (
              <Chip label={value} color={statusColor(value)} size="small" />
            )}
          >
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography>Client</Typography>
            <Typography fontWeight="bold">
              {quotation.client?.clientName || "-"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {quotation.client?.companyName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {quotation.client?.phone}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>Valid Till</Typography>
            <Typography fontWeight="bold">
              {quotation.validTill
                ? new Date(quotation.validTill).toLocaleDateString()
                : "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>Created By</Typography>
            <Typography fontWeight="bold">
              {quotation.createdBy?.name || "-"}
            </Typography>
          </Grid>

          {quotation.remarks && (
            <Grid item xs={12}>
              <Typography>Remarks</Typography>
              <Typography>{quotation.remarks}</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Items */}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Items
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Unit Price</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {quotation.items?.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    ₹ {Number(item.unitPrice || 0).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    ₹ {Number(item.total || 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ textAlign: "right" }}>
          <Typography>
            Subtotal: ₹ {Number(quotation.subtotal || 0).toLocaleString()}
          </Typography>

          <Typography>
            Tax: ₹ {Number(quotation.tax || 0).toLocaleString()}
          </Typography>

          <Typography>
            Discount: - ₹ {Number(quotation.discount || 0).toLocaleString()}
          </Typography>

          <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
            Grand Total: ₹ {Number(quotation.grandTotal || 0).toLocaleString()}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default QuotationDetails;