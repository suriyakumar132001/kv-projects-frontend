// ===============================================
// CreateQuotation.jsx
// Construction ERP - Create Quotation
// ===============================================

import React, { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
} from "@mui/material";

import { Add, Delete } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

let rowId = 0;
const newRow = () => ({
  rowId: rowId++,
  description: "",
  quantity: 1,
  unitPrice: 0,
});

const CreateQuotation = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [clients, setClients] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    quotationNumber: "",
    client: "",
    projectName: "",
    validTill: "",
    remarks: "",
  });

  const [items, setItems] = useState([newRow()]);
  const [taxPercent, setTaxPercent] = useState(0);
  const [discount, setDiscount] = useState(0);

  const token = () => localStorage.getItem("token");

  const fetchClients = async () => {
    try {
      const response = await api.get("/clients", {
        headers: { Authorization: `Bearer ${token()}` },
      });

      setClients(response.data.clients || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (rowId, field, value) => {
    setItems((prev) =>
      prev.map((row) =>
        row.rowId === rowId ? { ...row, [field]: value } : row,
      ),
    );
  };

  const addItemRow = () => setItems((prev) => [...prev, newRow()]);

  const removeItemRow = (rowId) => {
    setItems((prev) =>
      prev.length > 1 ? prev.filter((row) => row.rowId !== rowId) : prev,
    );
  };

  const subtotal = items.reduce(
    (sum, row) => sum + Number(row.quantity || 0) * Number(row.unitPrice || 0),
    0,
  );

  const taxAmount = (subtotal * Number(taxPercent || 0)) / 100;

  const grandTotal = subtotal + taxAmount - Number(discount || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client) {
      setError("Please select a client");
      return;
    }

    try {
      const payload = {
        quotationNumber: formData.quotationNumber,
        client: formData.client,
        projectName: formData.projectName,
        validTill: formData.validTill || undefined,
        remarks: formData.remarks,
        items: items.map((row) => ({
          description: row.description,
          quantity: Number(row.quantity || 0),
          unitPrice: Number(row.unitPrice || 0),
          total: Number(row.quantity || 0) * Number(row.unitPrice || 0),
        })),
        subtotal,
        tax: taxAmount,
        discount: Number(discount || 0),
        grandTotal,
      };

      await api.post("/quotations", payload, {
        headers: { Authorization: `Bearer ${token()}` },
      });

      setSuccess("Quotation created successfully");

      setTimeout(() => {
        navigate(`/${role}/quotations`);
      }, 1000);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Quotation creation failed");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        New Quotation
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Quotation Number"
                name="quotationNumber"
                value={formData.quotationNumber}
                onChange={handleChange}
                placeholder="e.g. QTN-2026-001"
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                required
              >
                <MenuItem value="">Select Client</MenuItem>
                {clients.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.clientName}
                    {c.companyName ? ` (${c.companyName})` : ""}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Project Name"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Valid Till"
                name="validTill"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.validTill}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight="bold" mb={2}>
            Items
          </Typography>

          <TableContainer sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell width={120}>Quantity</TableCell>
                  <TableCell width={160}>Unit Price (₹)</TableCell>
                  <TableCell width={160}>Total (₹)</TableCell>
                  <TableCell width={60}></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((row) => (
                  <TableRow key={row.rowId}>
                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Item description"
                        value={row.description}
                        onChange={(e) =>
                          handleItemChange(
                            row.rowId,
                            "description",
                            e.target.value,
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={row.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            row.rowId,
                            "quantity",
                            e.target.value,
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        value={row.unitPrice}
                        onChange={(e) =>
                          handleItemChange(
                            row.rowId,
                            "unitPrice",
                            e.target.value,
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      ₹{" "}
                      {(
                        Number(row.quantity || 0) * Number(row.unitPrice || 0)
                      ).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => removeItemRow(row.rowId)}
                        disabled={items.length === 1}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button startIcon={<Add />} onClick={addItemRow} sx={{ mb: 3 }}>
            Add Item
          </Button>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tax (%)"
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Discount (₹)"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Typography>
              Subtotal: <strong>₹ {subtotal.toLocaleString()}</strong>
            </Typography>

            <Typography>
              Tax ({taxPercent || 0}%):{" "}
              <strong>₹ {taxAmount.toLocaleString()}</strong>
            </Typography>

            <Typography>
              Discount:{" "}
              <strong>- ₹ {Number(discount || 0).toLocaleString()}</strong>
            </Typography>

            <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
              Grand Total: ₹ {grandTotal.toLocaleString()}
            </Typography>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Button type="submit" variant="contained" size="large">
              Save Quotation
            </Button>

            <Button
              sx={{ ml: 2 }}
              variant="outlined"
              onClick={() => navigate(`/${role}/quotations`)}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateQuotation;
