import { Table } from "@mantine/core";

import { Shift } from "../../../types";
import { ShiftTr } from "./ShiftTr";

interface ShiftTableProps {
    shifts: Shift[];
    onGetShifts: () => Promise<void>;
}

export const ShiftTable = ({ shifts, onGetShifts }: ShiftTableProps) => {
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
                    {shifts.map((s) => (
                        <ShiftTr
                            key={s.shift_id}
                            shift={s}
                            onGetShifts={onGetShifts} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}