// ===============================================
// ProjectList.jsx
// Construction ERP - Project List
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

const ProjectList = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(response.data.projects || []);
    } catch (err) {
      console.log(err);
      setError("Unable to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const deleteProject = async (id) => {
    const confirmDelete = window.confirm("Delete this project?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProjects();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredProjects = projects.filter((item) => {
    const name = item.projectName || item.name || "";
    const searchMatch = name.toLowerCase().includes(search.toLowerCase());
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
          Projects
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate(`/${role}/projects/create`)}
        >
          Add Project
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Project"
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
              <MenuItem value="Running">Running</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Project Name</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.projectName || item.name}</TableCell>
                    <TableCell>{item.clientName || "-"}</TableCell>
                    <TableCell>{item.location || "-"}</TableCell>
                    <TableCell>
                      ₹ {Number(item.budget || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        color={
                          item.status === "Completed"
                            ? "success"
                            : item.status === "Running"
                              ? "primary"
                              : "warning"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          navigate(`/${role}/projects/view/${item._id}`)
                        }
                      >
                        <Visibility />
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          navigate(`/${role}/projects/edit/${item._id}`)
                        }
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => deleteProject(item._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    style={{ textAlign: "center", padding: "30px" }}
                  >
                    No Projects Found
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

export default ProjectList;
