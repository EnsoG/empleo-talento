import { Table } from "@mantine/core";

import { CandidatePlanTr } from "./CandidatePlanTr";
import { CandidatePlan } from "../../../types";

interface CandidatePlanTableProps {
    candidatePlans: CandidatePlan[];
    onGetPlans: () => Promise<void>;
}

export const CandidatePlanTable = ({ candidatePlans, onGetPlans }: CandidatePlanTableProps) => {
    return (
        <Table.ScrollContainer minWidth={500}>
            <Table
                striped
                withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Nombre</Table.Th>
                        <Table.Th>Valor</Table.Th>
                        <Table.Th>Estado</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {candidatePlans.map((p) => (
                        <CandidatePlanTr
                            key={p.plan_id}
                            candidatePlan={p}
                            onGetPlans={onGetPlans} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}