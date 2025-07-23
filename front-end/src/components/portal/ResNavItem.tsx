import { useNavigate } from "react-router";
import { NavLink } from "@mantine/core";

import { NavItemProps } from "./NavItem";
import { useAuth } from "../../hooks/useAuth";

interface ResNavItemProps extends NavItemProps { }

export const ResNavItem = ({ name, to, options }: ResNavItemProps) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const visibleNestedNavItems = () => {
        if (options) {
            return options.filter(item => {
                if (!item.roles) return true;
                // Filter NavItems By User Role
                if (user?.user_role == undefined || user?.user_role == null) return false;
                if (item.roles) return item.roles.includes(user.user_role);
            });
        }
        return [];
    }

    return (
        <NavLink
            key={name}
            label={name}
            onClick={() => navigate(to)}>
            {options &&
                visibleNestedNavItems().map(({ name, to }) => (
                    <NavLink
                        key={name}
                        label={name}
                        onClick={() => navigate(to)} />
                ))
            }
        </NavLink>
    )
}