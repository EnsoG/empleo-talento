import { Link } from "react-router";
import {
    Avatar,
    Menu,
    UnstyledButton
} from "@mantine/core";

import { AppPaths, UserRole } from "../../types";
import { useAuth } from "../../hooks/useAuth";

export const NavAuth = () => {
    const { user, logout } = useAuth();

    return (
        <Menu>
            <Menu.Target>
                <UnstyledButton visibleFrom="lg">
                    <Avatar
                        size="md"
                        radius="xl" />
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown mt="lg">
                <Menu.Label>Mi Cuenta</Menu.Label>
                <Link
                    to={user?.user_role == UserRole.admin ? AppPaths.myCompanies : AppPaths.myJobs}
                    className="react-link">
                    <Menu.Item>Panel</Menu.Item>
                </Link>
                <Link
                    to={AppPaths.profesionalInfo}
                    className="react-link">
                    <Menu.Item>Mi Perfil</Menu.Item>
                </Link>
                <Menu.Divider />
                <Menu.Label>Empleo Talento</Menu.Label>
                <Menu.Item onClick={logout}>Cerrar Sesion</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    )
}