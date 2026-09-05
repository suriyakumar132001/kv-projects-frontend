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
  Button,
} from "@mui/material";
import toast from "react-hot-toast";
import { useClientAuth } from "../../context/ClientAuthContext";

import clientPortalService from "../../services/clientPortalService";

const STATUS_COLORS = {
  Pending: "warning",
  Partial: "info",
  Paid: "success",
};

const formatCurrency = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout."));
    document.body.appendChild(script);
  });

const PortalInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingInvoiceId, setPayingInvoiceId] = useState(null);
  const { client } = useClientAuth();

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const res = await clientPortalService.getMyInvoices();
      setInvoices(res.invoices || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load your invoices.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const payInvoice = async (invoice) => {
    try {
      setPayingInvoiceId(invoice._id);
      await loadRazorpayScript();
      const order = await clientPortalService.createRazorpayOrder(invoice._id);

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "KV Projects ERP",
        description: `Payment for invoice ${invoice.invoiceNumber}`,
        order_id: order.orderId,
        prefill: {
          name: client?.clientName || "",
          email: client?.email || "",
        },
        handler: async (response) => {
          try {
            await clientPortalService.verifyRazorpayPayment({
              invoiceId: invoice._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment completed successfully.");
            await loadInvoices();
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Payment verification failed.",
            );
          } finally {
            setPayingInvoiceId(null);
          }
        },
        modal: {
          ondismiss: () => setPayingInvoiceId(null),
        },
        theme: { color: "#1976d2" },
      });

      checkout.on("payment.failed", (response) => {
        toast.error(response.error?.description || "Payment failed.");
        setPayingInvoiceId(null);
      });
      checkout.open();
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Unable to start payment.",
      );
      setPayingInvoiceId(null);
    }
  };

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
                <TableCell sx={{ fontWeight: 700 }} align="right">
                  Action
                </TableCell>
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
                  <TableCell align="right">
                    {inv.paymentStatus !== "Paid" && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => payInvoice(inv)}
                        disabled={payingInvoiceId === inv._id}
                      >
                        {payingInvoiceId === inv._id ? "Processing..." : "Pay Now"}
                      </Button>
                    )}
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
