import { Navigate, Outlet } from "react-router-dom";
import { useClientAuth } from "../context/ClientAuthContext";

const ClientProtectedRoute = () => {
  const { isAuthenticated } = useClientAuth();

  if (!isAuthenticated) {
    return <Navigate to="/portal/login" replace />;
  }

  return <Outlet />;
};

export default ClientProtectedRoute;
