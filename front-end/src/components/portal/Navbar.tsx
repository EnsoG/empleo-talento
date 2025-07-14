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
    Menu
} from "@mantine/core";
import { List, SignIn, UserPlus } from "@phosphor-icons/react";

import { AppPaths } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { NavItem, NavItemData } from "./NavItem";
import { ResNavItem } from "./ResNavItem";
import { NavAuth } from "./NavAuth";
import { useModal } from "../../hooks/useModal";

const navOptions: NavItemData[] = [
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
                to: AppPaths.publishJob
            },
            {
                name: "Sube Tu CV",
                to: AppPaths.profesionalInfo
            }
        ]
    },
    {
        name: "Apoyo Al Talento",
        to: "",
        options: [
            {
                name: "Talento Acreditado",
                to: ""
            },
            {
                name: "Consejos Empleabilidad",
                to: ""
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
        to: AppPaths.services
    }
];

const navAuthOptions: NavItemData[] = [
    {
        name: "Mi Cuenta",
        to: "",
        options: [
            {
                name: "Panel",
                to: AppPaths.myJobs
            },
            {
                name: "Mi Perfil",
                to: AppPaths.profesionalInfo
            }
        ]
    },
    {
        name: "Empleo Talento",
        to: "",
        options: [
            {
                name: "Cerrar Sesion",
                to: AppPaths.login
            }
        ]
    }
];

export const Navbar = () => {
    const { isAuthenticated } = useAuth();
    const { openedModal } = useModal();
    const [openedDrawer, { open, close }] = useDisclosure();
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const changeNavbarColor = () => setScrolled(window.scrollY >= 100);
        window.addEventListener("scroll", changeNavbarColor);
        return () => window.removeEventListener("scroll", changeNavbarColor);
    }, []);

    const handleNavigate = (to: NavItemData["to"]) => {
        if (to != "") navigate(to);
    }

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
                                navOptions.map((o) => (
                                    <NavItem
                                        key={o.name}
                                        onNavigate={handleNavigate}
                                        {...o}
                                    />
                                ))
                            }
                        </Group>
                        {isAuthenticated
                            ? <NavAuth />
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
                                        Ingresar Cuenta
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
                        navOptions.map((o) => (
                            <ResNavItem
                                onNavigate={handleNavigate}
                                {...o} />
                        ))
                    }
                    {isAuthenticated &&
                        navAuthOptions.map((o) => (
                            <ResNavItem
                                onNavigate={handleNavigate}
                                {...o} />
                        ))
                    }
                </Stack>
            </Drawer>
        </>
    )
}