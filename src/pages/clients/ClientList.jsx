// ===============================================
// ClientList.jsx
// Construction ERP - Client List
// ===============================================

import React, { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  MenuItem,
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

import { useAuth } from "../../context/AuthContext";

const ClientList = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchClients = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get("/clients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setClients(response.data.clients || []);
    } catch (err) {
      console.log(err);
      setError("Unable to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const deleteClient = async (id) => {
    const confirmDelete = window.confirm("Delete this client?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/clients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchClients();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const filteredClients = clients.filter((item) => {
    const name = item.clientName || "";
    const company = item.companyName || "";

    const searchMatch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase());

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
          Clients
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate(`/${role}/clients/add`)}
        >
          Add Client
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Client / Company"
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
              <MenuItem value="Lead">Lead</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client Name</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <strong>{item.clientName}</strong>
                    </TableCell>

                    <TableCell>{item.companyName || "-"}</TableCell>

                    <TableCell>{item.phone || "-"}</TableCell>

                    <TableCell>{item.email || "-"}</TableCell>

                    <TableCell>{item.projectName || "-"}</TableCell>

                    <TableCell>
                      <Chip
                        label={item.status}
                        color={
                          item.status === "Active"
                            ? "primary"
                            : item.status === "Completed"
                              ? "success"
                              : "warning"
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <IconButton
                        onClick={() =>
                          navigate(`/${role}/clients/view/${item._id}`)
                        }
                      >
                        <Visibility />
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          navigate(`/${role}/clients/edit/${item._id}`)
                        }
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => deleteClient(item._id)}
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
                    No Clients Found
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

export default ClientList;