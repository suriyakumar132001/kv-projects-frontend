import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

import clientPortalService from "../../services/clientPortalService";

const STATUS_COLORS = {
  Pending: "warning",
  Partial: "info",
  Paid: "success",
};

const formatCurrency = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const PortalInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await clientPortalService.getMyInvoices();
        setInvoices(res.invoices || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load your invoices.",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Your Invoices
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        {invoices.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography color="text.secondary">
              No invoices have been issued yet.
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fb" }}>
                <TableCell sx={{ fontWeight: 700 }}>Invoice #</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Amount
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv._id} hover>
                  <TableCell sx={{ fontFamily: "monospace" }}>
                    {inv.invoiceNumber}
                  </TableCell>
                  <TableCell>{inv.projectName}</TableCell>
                  <TableCell>
                    {new Date(inv.invoiceDate).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>
                    {new Date(inv.dueDate).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatCurrency(inv.grandTotal)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={inv.paymentStatus}
                      color={STATUS_COLORS[inv.paymentStatus] || "default"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};

export default PortalInvoices;
