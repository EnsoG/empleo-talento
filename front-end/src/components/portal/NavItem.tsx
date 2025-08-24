import { useNavigate } from "react-router";
import { Button, Menu } from "@mantine/core";
import { CaretDown } from "@phosphor-icons/react";

import { useAuth } from "../../hooks/useAuth";
import { AppPaths, UserRole } from "../../types";

export interface NavItemProps {
    name: string;
    to: AppPaths | "";
    options?: {
        name: string;
        to: AppPaths | "";
        roles?: UserRole[];
    }[];
    roles?: UserRole[];
};

export const NavItem = ({ name, to, options }: NavItemProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();

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
        <Menu
            classNames={{ dropdown: "nav-item-dropdown" }}
            trigger="click-hover"
            loop={false}
            withinPortal={false}
            trapFocus={false}
            menuItemTabIndex={0}>
            <Menu.Target>
                <Button
                    classNames={{ root: "nav-item-btn" }}
                    size="sm"
                    variant="transparent"
                    color="gray"
                    rightSection={options && <CaretDown />}
                    onClick={() => navigate(to)}>
                    {name}
                </Button>
            </Menu.Target>
            {options &&
                <Menu.Dropdown mt="lg">
                    {
                        visibleNestedNavItems().map(({ name, to }) => (
                            <Menu.Item
                                key={name}
                                onClick={() => navigate(to)}>
                                {name}
                            </Menu.Item>
                        ))
                    }
                </Menu.Dropdown>
            }
        </Menu>
    )
}