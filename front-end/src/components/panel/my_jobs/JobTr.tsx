import { Link } from "react-router";
import {
    Badge,
    Button,
    Menu,
    Table,
    Text
} from "@mantine/core";
import { GearSix } from "@phosphor-icons/react";

import { AppPaths, SummaryOffer } from "../../../types";


interface JobTrProps {
    offer: SummaryOffer;
}

export const JobTr = ({ offer }: JobTrProps) => {
    return (
        <Table.Tr>
            <Table.Td>
                <Text
                    size="sm"
                    lineClamp={2}>
                    {offer.title}
                </Text>
            </Table.Td>
            <Table.Td>{new Date(offer.publication_date).toLocaleDateString("es-CL")}</Table.Td>
            <Table.Td>
                {offer.closing_date
                    ? new Date(offer.closing_date).toLocaleDateString("es-CL")
                    : "Sin especificar"
                }
            </Table.Td>
            <Table.Td>
                <Badge>{offer.state}</Badge>
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
                            to={`${AppPaths.jobManagement}/${offer.offer_id}`}
                            className="react-link">
                            <Menu.Item>
                                Ver Oferta
                            </Menu.Item>
                        </Link>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}