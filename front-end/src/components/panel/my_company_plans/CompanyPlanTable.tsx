import { Table } from "@mantine/core";

import { CompanyPlanTr } from "./CompanyPlanTr";
import { CompanyPlan } from "../../../types";

interface CompanyPlanTableProps {
    companyPlans: CompanyPlan[];
    onGetPlans: () => Promise<void>;
}

export const CompanyPlanTable = ({ companyPlans, onGetPlans }: CompanyPlanTableProps) => {
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
                    {companyPlans.map((p) => (
                        <CompanyPlanTr
                            key={p.plan_id}
                            companyPlan={p}
                            onGetPlans={onGetPlans} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}