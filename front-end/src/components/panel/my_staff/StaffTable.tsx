import { Table } from "@mantine/core";

import { CompanyUser } from "../../../types";
import { StaffTr } from "./StaffTr";

interface StaffTableProps {
    staff: CompanyUser[];
    onGetStaff: () => Promise<void>;
}

export const StaffTable = ({ staff, onGetStaff }: StaffTableProps) => {
    return (
        <Table.ScrollContainer minWidth={500}>
            <Table
                striped
                withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Nombre</Table.Th>
                        <Table.Th>Cargo</Table.Th>
                        <Table.Th>Correo</Table.Th>
                        <Table.Th>Numero Telefonico</Table.Th>
                        <Table.Th>Estado</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {staff.map((s) => (
                        <StaffTr
                            key={s.user_id}
                            staff={s}
                            onGetStaff={onGetStaff} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}