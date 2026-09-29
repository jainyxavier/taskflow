import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getPostLoginPath } from "../utils/auth";
import { useAuthSession } from "../hooks/useAuthSession";
import AuthLoadingScreen from "./AuthLoadingScreen";

type LocationState = {
    from?: string;
};

export default function GuestRoute() {
    const status = useAuthSession();
    const location = useLocation();
    const from = (location.state as LocationState | null)?.from;

    if (status === "checking") {
        return <AuthLoadingScreen />;
    }

    if (status === "authenticated") {
        return <Navigate to={getPostLoginPath(from)} replace />;
    }

    return <Outlet />;
}
