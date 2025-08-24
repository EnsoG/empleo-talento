import { Table } from "@mantine/core";

import { PerformanceArea } from "../../../types";
import { PerformanceAreaTr } from "./PerformanceAreaTr";

interface PerformanceAreaTableProps {
    performanceAreas: PerformanceArea[];
    onGetAreas: () => Promise<void>;
}

export const PerformanceAreaTable = ({ performanceAreas, onGetAreas }: PerformanceAreaTableProps) => {
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
                    {performanceAreas.map((a) => (
                        <PerformanceAreaTr
                            key={a.area_id}
                            performanceArea={a}
                            onGetAreas={onGetAreas} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}