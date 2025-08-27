import {
    ActionIcon,
    Box,
    Center,
    Divider,
    ScrollArea,
    Stack,
    Text,
    Title
} from "@mantine/core";
import {
    Article,
    Building,
    Buildings,
    Calendar,
    CalendarDots,
    Certificate,
    Clock,
    FileText,
    GridFour,
    Hourglass,
    IdentificationCard,
    Megaphone,
    NotePencil,
    OfficeChair,
    Package,
    Robot,
    Swap,
    Tag,
    Target,
    Timer,
    Translate,
    User,
    UserGear,
    Users,
    UsersThree,
    X
} from "@phosphor-icons/react";

import { useAuth } from "../../hooks/useAuth";
import { AppPaths, UserPosition, UserRole } from "../../types";
import { SidebarItem, SidebarItemProps } from "./SidebarItem";

const navItems: SidebarItemProps[] = [
    {
        label: "Empleos Externos",
        icon: <Robot />,
        path: AppPaths.adminJobManagement,
        roles: [UserRole.admin]
    },
    {
        label: "Mis Empresas",
        icon: <Buildings />,
        path: AppPaths.myCompanies,
        roles: [UserRole.admin]
    },
    {
        label: "Gestion Ofertas",
        icon: <Megaphone />,
        path: "",
        options: [
            {
                label: "Todas",
                icon: <Tag />,
                path: AppPaths.myJobs,
            },
            {
                label: "Por Verificar",
                icon: <Hourglass />,
                path: AppPaths.myPendingJobs,
            }
        ],
        roles: [UserRole.admin]
    },
    {
        label: "Mis Softwares",
        icon: <GridFour />,
        path: AppPaths.mySoftwares,
        roles: [UserRole.admin]
    },
    {
        label: "Mis Idiomas",
        icon: <Translate />,
        path: AppPaths.myLanguages,
        roles: [UserRole.admin]
    },
    {
        label: "Mis Sectores Empresariales",
        icon: <OfficeChair />,
        path: AppPaths.myCompanySectors,
        roles: [UserRole.admin]
    },
    {
        label: "Mis Tipos Certificaciones",
        icon: <Certificate />,
        path: AppPaths.myCertificationTypes,
        roles: [UserRole.admin]
    },
    {
        label: "Mis Areas Desempeño",
        icon: <Target />,
        path: AppPaths.myPerformanceAreas,
        roles: [UserRole.admin]
    },
    {
        label: "Gestion Cargos Genericos",
        icon: <UsersThree />,
        path: "",
        options: [
            {
                label: "Mis Cargos Genericos",
                icon: <IdentificationCard />,
                path: AppPaths.myGenericPositions,
            },
            {
                label: "Mis Roles Cargo",
                icon: <UserGear />,
                path: AppPaths.myRolePositions,
            }
        ],
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
            },
            {
                label: "Mis Tipo Contrato",
                icon: <FileText />,
                path: AppPaths.myContractTypes,
            },
            {
                label: "Mis Jornadas",
                icon: <Timer />,
                path: AppPaths.myJobTypes,
            },
            {
                label: "Mis Turnos",
                icon: <Swap />,
                path: AppPaths.myShifts,
            },
            {
                label: "Mis Dias Laborales",
                icon: <Calendar />,
                path: AppPaths.myJobDays,
            }
        ],
        roles: [UserRole.admin]
    },
    {
        label: "Gestion Planes",
        icon: <Package />,
        path: "",
        options: [
            {
                label: "Planes Candidatos",
                icon: <User />,
                path: AppPaths.myCandidatePlans,
            },
            {
                label: "Planes Empresas",
                icon: <Building />,
                path: AppPaths.myCompanyPlans,
            }
        ],
        roles: [UserRole.admin]
    },
    {
        label: "Gestion Publicaciones",
        icon: <NotePencil />,
        path: "",
        options: [
            {
                label: "Mis Publicaciones",
                icon: <Article />,
                path: AppPaths.myPublications,
            },
            {
                label: "Categorias Publicacion",
                icon: <Tag />,
                path: AppPaths.myPublicationCategories,
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
        path: AppPaths.myCompany,
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
        if (user?.user_role == undefined || user?.user_role == null) return false;
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
            h="100vh"
            p="lg"
            style={{ display: "flex", flexDirection: "column" }}>
            <Center h="10%">
                <Title order={1} size="lg" tt="uppercase">
                    Empleo Talento
                </Title>
            </Center>
            <Divider my="sm" />
            <Text size="md" c="blue" fw="bold" tt="uppercase">
                Panel
            </Text>
            <ScrollArea
                type="auto"
                style={{ flexGrow: 1 }}>
                <Stack gap="xs" pr="md">
                    {visibleNavItems.map((i, index) => (
                        <SidebarItem key={index} {...i} />
                    ))}
                </Stack>
            </ScrollArea>
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