import { Table } from "@mantine/core";

import { CompanyPanel } from "../../../types";
import { CompanyTr } from "./CompanyTr";

interface CompanyTableProps {
    companies: CompanyPanel[];
}

export const CompanyTable = ({ companies }: CompanyTableProps) => {
    return (
        <Table.ScrollContainer minWidth={500}>
            <Table
                striped
                withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Nombre Fantasia</Table.Th>
                        <Table.Th>Correo</Table.Th>
                        <Table.Th>Numero Telefonico</Table.Th>
                        <Table.Th>Estado</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {companies.map((c) => (
                        <CompanyTr
                            key={c.company_id}
                            company={{
                                company_id: c.company_id,
                                trade_name: c.trade_name,
                                email: c.email,
                                phone: c.phone,
                                state: c.state
                            }} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}