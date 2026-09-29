import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthSession } from "../hooks/useAuthSession";
import AuthLoadingScreen from "./AuthLoadingScreen";

export default function ProtectedRoute() {
    const status = useAuthSession({ acceptTrusted: true });
    const location = useLocation();

    if (status === "checking") {
        return <AuthLoadingScreen />;
    }

    if (status === "unauthenticated") {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <Outlet />;
}
