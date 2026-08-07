// ===============================================
// ClientDetails.jsx
// Construction ERP - Client Details
// ===============================================

import React, { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  Business,
  Email,
  Phone,
  LocationOn,
  Badge,
  Engineering,
} from "@mui/icons-material";

import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchClient = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get(`/clients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClient(response.data.client);
    } catch (err) {
      console.log(err);
      setError("Unable to load client details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [id]);

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

  if (!client) {
    return (
      <Box p={3}>
        <Alert severity="warning">Client not found</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Client Details
        </Typography>

        <Button variant="outlined" onClick={() => navigate(`/${role}/clients`)}>
          Back
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            {client.clientName}
          </Typography>

          <Chip
            label={client.status}
            color={
              client.status === "Active"
                ? "primary"
                : client.status === "Completed"
                  ? "success"
                  : "warning"
            }
          />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography>
              <Business fontSize="small" /> Company
            </Typography>
            <Typography>{client.companyName || "-"}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <Email fontSize="small" /> Email
            </Typography>
            <Typography>{client.email || "-"}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <Phone fontSize="small" /> Phone
            </Typography>
            <Typography>{client.phone || "-"}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <LocationOn fontSize="small" /> Address
            </Typography>
            <Typography>
              {[client.address, client.city, client.state, client.pincode]
                .filter(Boolean)
                .join(", ") || "-"}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <Badge fontSize="small" /> GST Number
            </Typography>
            <Typography>{client.gstNumber || "-"}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <Engineering fontSize="small" /> Linked Project
            </Typography>
            <Typography>{client.projectName || "-"}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>Created By</Typography>
            <Typography>{client.createdBy?.name || "-"}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>Added On</Typography>
            <Typography>
              {client.createdAt
                ? new Date(client.createdAt).toLocaleDateString()
                : "-"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ClientDetails;