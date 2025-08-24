import {
    ActionIcon,
    Avatar,
    Box,
    Card,
    Group,
    Menu,
    UnstyledButton
} from "@mantine/core";
import { List } from "@phosphor-icons/react";
import { Link } from "react-router";

import { AppPaths } from "../../types";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
    toggleSidebar: () => void;
}

export const Header = ({ toggleSidebar }: HeaderProps) => {
    const { logout } = useAuth();

    return (
        <Box
            id="admin-panel-header"
            component="header"
            px="md"
            py="lg">
            <Card
                p="md"
                shadow="sm"
                withBorder>
                <Group justify="space-between">
                    <ActionIcon
                        variant="transparent"
                        size="lg"
                        onClick={toggleSidebar}>
                        <List width="80%" height="80%" weight="bold" />
                    </ActionIcon>
                    <Menu>
                        <Menu.Target>
                            <UnstyledButton>
                                <Avatar
                                    size="md"
                                    radius="xl" />
                            </UnstyledButton>
                        </Menu.Target>
                        <Menu.Dropdown mt="lg">
                            <Menu.Label >¡Bienvenido!</Menu.Label>
                            <Link
                                to={AppPaths.myAccount}
                                className="react-link">
                                <Menu.Item>Mi Cuenta</Menu.Item>
                            </Link>
                            <Link
                                to={AppPaths.home}
                                className="react-link">
                                <Menu.Item>Ir Al Portal</Menu.Item>
                            </Link>
                            <Menu.Item onClick={logout}>Cerrar Sesion</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Card>
        </Box>
    )
}
