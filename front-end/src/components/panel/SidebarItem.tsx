import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { NavLink } from "@mantine/core";

import { AppPaths, UserPosition, UserRole } from "../../types";

export interface SidebarItemProps {
    label: string;
    icon: ReactNode;
    path: AppPaths | ""; // Empty String For Nested Items
    options?: {
        label: string;
        icon: ReactNode;
        path: AppPaths;
    }[];
    associatedPaths?: AppPaths[]; // To Activate NavLink With Others Associated AppPaths
    roles?: UserRole[]; // First Priority To Filter
    positions?: UserPosition[]; // Second Priority To Filter
}

export const SidebarItem = ({ label, icon, path, options, associatedPaths }: SidebarItemProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check If Item Have Items Nested
    if (options) return (
        <NavLink
            label={label}
            leftSection={icon}
            active={(associatedPaths) && associatedPaths.some(p => location.pathname.includes(p))}
            defaultOpened={options.some(o => location.pathname === o.path)}>
            {
                options.map((i, index) => (
                    <NavLink
                        key={index}
                        label={i.label}
                        leftSection={i.icon}
                        active={location.pathname === i.path}
                        onClick={() => navigate(i.path)} />
                ))
            }
        </NavLink>
    )

    return (
        <NavLink
            label={label}
            leftSection={icon}
            active={location.pathname === path || (associatedPaths) && associatedPaths.some(p => location.pathname.includes(p))}
            onClick={() => navigate(path)} />
    )
}