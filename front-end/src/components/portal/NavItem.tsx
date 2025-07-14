import { Button, Menu } from "@mantine/core";
import { CaretDown } from "@phosphor-icons/react";

import { AppPaths } from "../../types";

export type NavItemData = {
    name: string;
    to: AppPaths | "";
    options?: { name: string; to: AppPaths | "" }[];
};

export interface NavItemProps extends NavItemData {
    onNavigate: (to: NavItemProps["to"]) => void,
}

export const NavItem = ({ name, to, onNavigate, options }: NavItemProps) => {
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
                    onClick={() => onNavigate(to)}>
                    {name}
                </Button>
            </Menu.Target>
            {options &&
                <Menu.Dropdown mt="lg">
                    {
                        options.map(({ name, to }) => (
                            <Menu.Item
                                key={name}
                                onClick={() => onNavigate(to)}>
                                {name}
                            </Menu.Item>
                        ))
                    }
                </Menu.Dropdown>
            }
        </Menu>
    )
}