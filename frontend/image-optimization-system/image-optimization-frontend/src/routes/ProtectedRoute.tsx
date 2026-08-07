import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
    requireAdmin?: boolean;
}

function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && user?.role?.toUpperCase() !== "ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;