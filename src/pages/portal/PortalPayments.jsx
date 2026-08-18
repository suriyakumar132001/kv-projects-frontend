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

const formatCurrency = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const PortalPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await clientPortalService.getMyPayments();
        setPayments(res.payments || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load your payments.",
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

  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Your Payments
        </Typography>

        {payments.length > 0 && (
          <Typography variant="h6" color="success.main" fontWeight={700}>
            Total Paid: {formatCurrency(totalPaid)}
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        {payments.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography color="text.secondary">
              No payments have been recorded yet.
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fb" }}>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Invoice #</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Method</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {payments.map((p) => (
                <TableRow key={p._id} hover>
                  <TableCell>
                    {new Date(p.paymentDate).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "monospace" }}>
                    {p.invoice?.invoiceNumber || "—"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={p.paymentMethod}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatCurrency(p.amount)}
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

export default PortalPayments;
