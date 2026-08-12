import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, token } = useAuth();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role.toLowerCase())) {
        return <Navigate to="/" replace />;
    }

    // Support both inline children and nested routes via <Outlet />
    if (children) return children;

    return <Outlet />;
};

export default ProtectedRoute;