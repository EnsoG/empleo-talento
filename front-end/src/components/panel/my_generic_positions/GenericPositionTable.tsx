import { Table } from "@mantine/core";

import { GenericPosition } from "../../../types";
import { GenericPositionTr } from "./GenericPositionTr";

interface GenericPositionTableProps {
    genericPositions: GenericPosition[];
    onGetPositions: () => Promise<void>;
}

export const GenericPositionTable = ({ genericPositions, onGetPositions }: GenericPositionTableProps) => {
    return (
        <Table.ScrollContainer minWidth={500}>
            <Table
                striped
                withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Nombre</Table.Th>
                        <Table.Th>Rol</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {genericPositions.map((p) => (
                        <GenericPositionTr
                            key={p.position_id}
                            genericPosition={p}
                            onGetPositions={onGetPositions} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}