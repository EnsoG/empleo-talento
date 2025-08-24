import { Table } from "@mantine/core";

import { CompanySector } from "../../../types";
import { CompanySectorTr } from "./CompanySectorTr";

interface CompanySectorTableProps {
    companySectors: CompanySector[];
    onGetSectors: () => Promise<void>;
}

export const CompanySectorTable = ({ companySectors, onGetSectors }: CompanySectorTableProps) => {
    return (
        <Table.ScrollContainer minWidth={500}>
            <Table
                striped
                withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Nombre</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {companySectors.map((s) => (
                        <CompanySectorTr
                            key={s.sector_id}
                            companySector={s}
                            onGetSectors={onGetSectors} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}