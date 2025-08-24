import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDisclosure } from "@mantine/hooks";
import {
    Flex,
    Text,
    Group,
    Button,
    Drawer,
    Stack,
    Box,
    ActionIcon,
    Menu,
    NavLink,
    UnstyledButton,
    Avatar
} from "@mantine/core";
import { List, SignIn, UserPlus } from "@phosphor-icons/react";

import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../hooks/useModal";
import { AppPaths, UserRole } from "../../types";
import { NavItem, NavItemProps } from "./NavItem";
import { ResNavItem } from "./ResNavItem";

const navItems: NavItemProps[] = [
    {
        name: "Ofertas Laborales",
        to: AppPaths.jobBoard
    },
    {
        name: "Ofertas y CV",
        to: "",
        options: [
            {
                name: "Publica Tu Oferta",
                to: AppPaths.publishJob,
                roles: [UserRole.company]
            },
            {
                name: "Sube Tu CV",
                to: AppPaths.profesionalInfo,
                roles: [UserRole.candidate]
            }
        ],
        roles: [UserRole.candidate, UserRole.company]
    },
    {
        name: "Apoyo Al Talento",
        to: "",
        options: [
            {
                name: "Talento Acreditado",
                to: "",
                roles: [UserRole.candidate]
            },
            {
                name: "Consejos Empleabilidad",
                to: AppPaths.publications
            }
        ]
    },
    {
        name: "Conocenos",
        to: "",
        options: [
            {
                name: "Nosotros",
                to: AppPaths.aboutUs
            },
            {
                name: "Contacto",
                to: AppPaths.contact
            }
        ]
    },
    {
        name: "Servicios",
        to: AppPaths.services,
        roles: [UserRole.candidate, UserRole.company]
    }
];

export const Navbar = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const { openedModal } = useModal();
    const [openedDrawer, { open, close }] = useDisclosure();
    const [scrolled, setScrolled] = useState(false);

    const visibleNavItems = navItems.filter(item => {
        if (!item.roles) return true;
        // Filter NavItems By User Role
        if (user?.user_role == undefined || user?.user_role == null) return false;
        if (item.roles) return item.roles.includes(user?.user_role);
    });

    useEffect(() => {
        const changeNavbarColor = () => setScrolled(window.scrollY >= 100);
        window.addEventListener("scroll", changeNavbarColor);
        return () => window.removeEventListener("scroll", changeNavbarColor);
    }, []);

    return (
        <>
            <Box
                id="portal-header"
                component="header"
                className={scrolled ? "scrolled" : ""}
                /* Fix The Problem With Portal Z-Index In Some Components (Modals, Select, Etc) */
                style={{ zIndex: (openedModal) ? 1 : 400 }}
                w="100%">
                <Box
                    id="portal-navbar"
                    component="nav">
                    <Flex
                        justify="space-between"
                        align="center">
                        <Link
                            className="react-link"
                            to={AppPaths.home}>
                            <Text
                                size="xl"
                                tt="uppercase"
                                component="span"
                                fw="bold">
                                Empleo Talento
                            </Text>
                        </Link>
                        <Group
                            visibleFrom="lg"
                            gap="xl">
                            {
                                visibleNavItems.map((o, index) => (
                                    <NavItem
                                        key={index}
                                        {...o}
                                    />
                                ))
                            }
                        </Group>
                        {isAuthenticated
                            ? <Menu>
                                <Menu.Target>
                                    <UnstyledButton visibleFrom="lg">
                                        <Avatar
                                            size="md"
                                            radius="xl" />
                                    </UnstyledButton>
                                </Menu.Target>
                                <Menu.Dropdown mt="lg">
                                    <Menu.Label>¡Bienvenido!</Menu.Label>
                                    {(user?.user_role != UserRole.candidate) &&
                                        <Link
                                            to={user?.user_role == UserRole.admin ? AppPaths.myCompanies : AppPaths.myJobs}
                                            className="react-link">
                                            <Menu.Item>Panel</Menu.Item>
                                        </Link>
                                    }
                                    {(user?.user_role == UserRole.candidate) &&
                                        <Link
                                            to={AppPaths.profesionalInfo}
                                            className="react-link">
                                            <Menu.Item>Mi Perfil</Menu.Item>
                                        </Link>
                                    }
                                    <Menu.Item onClick={logout}>Cerrar Sesion</Menu.Item>
                                </Menu.Dropdown>
                            </Menu >
                            : <Menu>
                                <Menu.Target>
                                    <Button visibleFrom="lg">Mi Cuenta</Button>
                                </Menu.Target>
                                <Menu.Dropdown mt="lg">
                                    <Menu.Item
                                        leftSection={<UserPlus />}
                                        onClick={() => navigate(AppPaths.registerCandidate)}>
                                        Crear Cuenta
                                    </Menu.Item>
                                    <Menu.Item
                                        leftSection={<SignIn />}
                                        onClick={() => navigate(AppPaths.login)}>
                                        Iniciar Sesion
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        }
                        <ActionIcon
                            id="nav-btn-drawer"
                            variant="transparent"
                            radius="md"
                            size="xl"
                            hiddenFrom="lg"
                            onClick={open}>
                            <List width="70%" height="70%" />
                        </ActionIcon>
                    </Flex>
                </Box>
            </Box>
            {/* Responsive Navbar */}
            <Drawer
                classNames={{ root: "nav-drawer" }}
                size="100%"
                opened={openedDrawer}
                onClose={close}
                closeButtonProps={{ size: "xl" }}>
                <Stack
                    mt="xl"
                    gap="lg">
                    {
                        visibleNavItems.map((o, index) => (
                            <ResNavItem
                                key={index}
                                {...o} />
                        ))
                    }
                    {isAuthenticated
                        ? <>
                            <NavLink label="Mi Cuenta">
                                {(user?.user_role != UserRole.candidate) &&
                                    <NavLink
                                        label="Panel"
                                        onClick={() => navigate(user?.user_role == UserRole.admin ? AppPaths.myCompanies : AppPaths.myJobs)} />
                                }
                                {(user?.user_role == UserRole.candidate) &&
                                    <NavLink
                                        label="Mi Perfil"
                                        onClick={() => navigate(AppPaths.profesionalInfo)} />
                                }
                            </NavLink>
                            <NavLink
                                label="Cerrar Sesion"
                                onClick={logout} />
                        </>
                        : <NavLink label="Mi Cuenta">
                            <NavLink
                                label="Crear Cuenta"
                                onClick={() => navigate(AppPaths.registerCandidate)} />
                            <NavLink
                                label="Iniciar Sesion"
                                onClick={() => navigate(AppPaths.login)} />
                        </NavLink>
                    }
                </Stack>
            </Drawer>
        </>
    )
}