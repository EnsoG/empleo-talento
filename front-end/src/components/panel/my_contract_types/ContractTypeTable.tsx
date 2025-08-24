import { Table } from "@mantine/core";

import { ContractType } from "../../../types";
import { ContractTypeTr } from "./ContractTypeTr";

interface ContractTypeTableProps {
    contractTypes: ContractType[];
    onGetContracts: () => Promise<void>;
}

export const ContractTypeTable = ({ contractTypes, onGetContracts }: ContractTypeTableProps) => {
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
                    {contractTypes.map((c) => (
                        <ContractTypeTr
                            key={c.type_id}
                            contractType={c}
                            onGetContracts={onGetContracts} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}