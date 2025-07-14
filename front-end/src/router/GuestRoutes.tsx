import { Navigate, Outlet } from "react-router";

import { AppPaths } from "../types";
import { useAuth } from "../hooks/useAuth";

export const GuestRoutes = () => {
    const { isAuthenticated, isAuthLoading } = useAuth();

    if (isAuthLoading) return null;

    if (isAuthenticated) return <Navigate to={AppPaths.home} replace />

    return <Outlet />
}