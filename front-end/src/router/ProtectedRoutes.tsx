import { Navigate, Outlet } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { AppPaths, UserPosition, UserRole } from "../types";

interface ProtectedRoutesProps {
    requiredRoles: UserRole[];
    requiredPositions?: UserPosition[];
}

export const ProtectedRoutes = ({ requiredRoles, requiredPositions }: ProtectedRoutesProps) => {
    const { isAuthenticated, isAuthLoading, user } = useAuth();
    if (isAuthLoading) return null;

    if (!isAuthenticated) return <Navigate to={AppPaths.home} replace />

    if (!user || !requiredRoles.includes(user?.user_role)) {
        return <Navigate to={AppPaths.home} replace />
    }

    if (requiredPositions && (!user.user_position || !requiredPositions.includes(user?.user_position))) {
        return <Navigate to={AppPaths.home} replace />;
    }

    return <Outlet />
}