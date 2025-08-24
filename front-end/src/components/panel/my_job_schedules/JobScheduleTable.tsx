import { Table } from "@mantine/core";

import { JobSchedule } from "../../../types";
import { JobScheduleTr } from "./JobScheduleTr";

interface JobScheduleTableProps {
    schedules: JobSchedule[];
    onGetSchedules: () => Promise<void>;
}

export const JobScheduleTable = ({ schedules, onGetSchedules }: JobScheduleTableProps) => {
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
                    {schedules.map((s) => (
                        <JobScheduleTr
                            key={s.schedule_id}
                            schedule={s}
                            onGetSchedule={onGetSchedules} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}