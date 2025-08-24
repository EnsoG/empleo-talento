import { Table } from "@mantine/core"

import { SummaryOffer } from "../../../types"
import { JobTr } from "./JobTr";

interface JobTableProps {
    offers: SummaryOffer[];
}

export const JobTable = ({ offers }: JobTableProps) => {
    return (
        <Table.ScrollContainer minWidth={500}>
            <Table
                striped
                withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Titulo</Table.Th>
                        <Table.Th>Fecha Publicacion</Table.Th>
                        <Table.Th>Fecha Cierre</Table.Th>
                        <Table.Th>Estado</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {offers.map((o) => (
                        <JobTr
                            key={o.offer_id}
                            offer={o} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}
