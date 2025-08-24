import { Table } from "@mantine/core";

import { JobDay } from "../../../types";
import { JobDayTr } from "./JobDayTr";

interface JobDayTableProps {
    jobDays: JobDay[];
    onGetDays: () => Promise<void>;
}

export const JobDayTable = ({ jobDays, onGetDays }: JobDayTableProps) => {
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
                    {jobDays.map((d) => (
                        <JobDayTr
                            key={d.day_id}
                            jobDay={d}
                            onGetDays={onGetDays} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}