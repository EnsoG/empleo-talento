import { Table } from "@mantine/core";

import { CertificationType } from "../../../types";
import { CertificationTypeTr } from "./CertificationTypeTr";

interface CertificationTypeTableProps {
    certificationTypes: CertificationType[];
    onGetTypes: () => Promise<void>;
}

export const CertificationTypeTable = ({ certificationTypes, onGetTypes }: CertificationTypeTableProps) => {
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
                    {certificationTypes.map((t) => (
                        <CertificationTypeTr
                            key={t.certification_type_id}
                            certificationType={t}
                            onGetTypes={onGetTypes} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}