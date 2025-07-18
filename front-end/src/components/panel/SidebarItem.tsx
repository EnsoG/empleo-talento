import { ReactNode } from "react";
import { useNavigate } from "react-router";
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
    roles?: UserRole[]; // First Priority To Filter
    positions?: UserPosition[]; // Second Priority To Filter
}

export const SidebarItem = ({ label, icon, path, options }: SidebarItemProps) => {
    const navigate = useNavigate();
    // Check If Item Have Items Nested
    if (options) return (
        <NavLink
            label={label}
            leftSection={icon}>
            {
                options.map((i, index) => (
                    <NavLink
                        key={index}
                        label={i.label}
                        leftSection={i.icon}
                        onClick={() => navigate(i.path)} />
                ))
            }
        </NavLink>
    )

    return (
        <NavLink
            label={label}
            leftSection={icon}
            onClick={() => navigate(path)} />
    )
}