import { Table } from "@mantine/core";

import { JobType } from "../../../types";
import { JobTypeTr } from "./JobTypeTr";

interface JobTypeTableProps {
    jobTypes: JobType[];
    onGetJobTypes: () => Promise<void>;
}

export const JobTypeTable = ({ jobTypes, onGetJobTypes }: JobTypeTableProps) => {
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
                    {jobTypes.map((t) => (
                        <JobTypeTr
                            key={t.job_type_id}
                            jobType={t}
                            onGetJobTypes={onGetJobTypes} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}