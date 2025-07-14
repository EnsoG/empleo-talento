import {
    ActionIcon,
    Box,
    Center,
    Divider,
    Stack,
    Text,
    Title
} from "@mantine/core";
import {
    Building,
    Buildings,
    CalendarDots,
    Clock,
    GridFour,
    Tag,
    Users,
    X
} from "@phosphor-icons/react";

import { useAuth } from "../../hooks/useAuth";
import { AppPaths, UserPosition, UserRole } from "../../types";
import { SidebarItem, SidebarItemProps } from "./SidebarItem";

const navItems: SidebarItemProps[] = [
    {
        label: "Mis Empresas",
        icon: <Buildings />,
        path: AppPaths.myCompanies,
        roles: [UserRole.admin]
    },
    {
        label: "Mis Ofertas",
        icon: <Tag />,
        path: AppPaths.myJobs,
        roles: [UserRole.admin]
    },
    {
        label: "Mis Softwares",
        icon: <GridFour />,
        path: AppPaths.mySoftwares,
        roles: [UserRole.admin]
    },
    {
        label: "Gestion Jornadas",
        icon: <CalendarDots />,
        path: "",
        options: [
            {
                label: "Mis Horarios",
                icon: <Clock />,
                path: AppPaths.myJobSchedules,
            }
        ],
        roles: [UserRole.admin]
    },
    {
        label: "Mis Ofertas",
        icon: <Tag />,
        path: AppPaths.myJobs,
        positions: [UserPosition.founder, UserPosition.staff]
    },
    {
        label: "Mi Personal",
        icon: <Users />,
        path: AppPaths.myStaff,
        positions: [UserPosition.founder]
    },
    {
        label: "Informacion Empresa",
        icon: <Building />,
        path: AppPaths.companyInfo,
        positions: [UserPosition.founder]
    }
];

interface SidebarProps {
    openedSidebar: boolean
    closeSidebar: () => void
}

export const Sidebar = ({ openedSidebar, closeSidebar }: SidebarProps) => {
    const { user } = useAuth();

    const visibleNavItems = navItems.filter(item => {
        if (!item.positions && !item.roles) return true;
        // Check First Priority
        if (!user?.user_role) return false;
        if (item.roles) return item.roles.includes(user.user_role);
        // Check Second Priority
        if (!user?.user_position) return false;
        if (item.positions) return item.positions.includes(user.user_position);
    });

    return (
        <Box
            id="admin-panel-sidebar"
            className={!openedSidebar ? "hidden" : ""}
            component="aside"
            h="100%"
            p="lg">
            <Center h="10%">
                <Title
                    order={1}
                    size="lg"
                    tt="uppercase">
                    Empleo Talento
                </Title>
            </Center>
            <Divider my="sm" />
            <Text
                size="md"
                c="blue"
                fw="bold"
                tt="uppercase">
                Panel
            </Text>
            <Stack gap="xs">
                {visibleNavItems.map((i, index) => (
                    <SidebarItem
                        key={index}
                        {...i} />
                ))}
            </Stack>
            <ActionIcon
                id="sidebar-btn-close"
                size="lg"
                variant="transparent"
                hiddenFrom="md"
                onClick={closeSidebar}>
                <X width="80%" height="80%" weight="bold" />
            </ActionIcon>
        </Box>
    )
}