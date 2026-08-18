import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
} from "@mui/material";
import { Logout, Business } from "@mui/icons-material";

import { useClientAuth } from "../context/ClientAuthContext";

const NAV_LINKS = [
  { label: "Projects", path: "/portal/dashboard" },
  { label: "Invoices", path: "/portal/invoices" },
  { label: "Payments", path: "/portal/payments" },
];

const PortalLayout = () => {
  const { client, logout } = useClientAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/portal/login");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bgcolor="#f8f9fb"
    >
      <AppBar
        position="static"
        color="default"
        elevation={1}
        sx={{ bgcolor: "#ffffff" }}
      >
        <Toolbar sx={{ gap: 3 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Business color="primary" />
            <Typography variant="h6" fontWeight={700}>
              Client Portal
            </Typography>
          </Box>

          <Box display="flex" gap={1} flexGrow={1}>
            {NAV_LINKS.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                variant={
                  location.pathname.startsWith(link.path) ? "contained" : "text"
                }
                size="small"
              >
                {link.label}
              </Button>
            ))}
          </Box>

          <Typography variant="body2" color="text.secondary">
            {client?.clientName}
          </Typography>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default PortalLayout;
