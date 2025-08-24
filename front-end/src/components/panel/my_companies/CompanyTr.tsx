import {
    Badge,
    Button,
    Menu,
    Table
} from "@mantine/core";
import { Eye, GearSix } from "@phosphor-icons/react";

import { AppPaths, CompanyPanel, companyUserStates } from "../../../types";
import { Link } from "react-router";

interface CompanyTrProps {
    company: Pick<CompanyPanel,
        "company_id" |
        "trade_name" |
        "email" |
        "phone" |
        "state"
    >;
}

export const CompanyTr = ({ company }: CompanyTrProps) => {
    return (
        <Table.Tr>
            <Table.Td>{company.trade_name}</Table.Td>
            <Table.Td>{company.email}</Table.Td>
            <Table.Td>{company.phone}</Table.Td>
            <Table.Td>
                <Badge>{companyUserStates[company.state].name}</Badge>
            </Table.Td>
            <Table.Td>
                <Menu>
                    <Menu.Target>
                        <Button leftSection={<GearSix />}>
                            Acciones
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Link
                            className="react-link"
                            to={`${AppPaths.companyDetail}/${company.company_id}`}>
                            <Menu.Item leftSection={<Eye />}>
                                Ver
                            </Menu.Item>
                        </Link>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}