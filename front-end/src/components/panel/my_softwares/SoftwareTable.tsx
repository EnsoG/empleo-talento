import { Table } from "@mantine/core";

import { Software } from "../../../types";
import { SoftwareTr } from "./SoftwareTr";

interface SoftwareTableProps {
    softwares: Software[];
    onGetSoftwares: () => Promise<void>;
}

export const SoftwareTable = ({ softwares, onGetSoftwares }: SoftwareTableProps) => {
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
                    {softwares.map((s) => (
                        <SoftwareTr
                            key={s.software_id}
                            software={s}
                            onGetSoftwares={onGetSoftwares} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}