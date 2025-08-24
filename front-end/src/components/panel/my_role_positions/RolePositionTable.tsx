import { Table } from "@mantine/core";

import { RolePosition } from "../../../types";
import { RolePositionTr } from "./RolePositionTr";

interface RolePositionTableProps {
    rolePositions: RolePosition[];
    onGetRoles: () => Promise<void>;
}

export const RolePositionTable = ({ rolePositions, onGetRoles }: RolePositionTableProps) => {
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
                    {rolePositions.map((r) => (
                        <RolePositionTr
                            key={r.role_id}
                            rolePosition={r}
                            onGetRoles={onGetRoles} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}