import { NavLink } from "@mantine/core";

import { NavItemProps } from "./NavItem";

interface ResNavItemProps extends NavItemProps { }

export const ResNavItem = ({ name, to, options, onNavigate }: ResNavItemProps) => {
    return (
        <NavLink
            key={name}
            label={name}
            onClick={() => onNavigate(to)}>
            {options &&
                options.map(({ name, to }) => (
                    <NavLink
                        key={name}
                        label={name}
                        onClick={() => onNavigate(to)} />
                ))
            }
        </NavLink>
    )
}