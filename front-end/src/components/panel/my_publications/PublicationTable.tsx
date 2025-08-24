import { Table } from "@mantine/core";

import { Publication } from "../../../types";
import { PublicationTr } from "./PublicationTr";

interface PublicationTableProps {
    publications: Publication[];
    onGetPublications: () => Promise<void>;
}

export const PublicationTable = ({ publications, onGetPublications }: PublicationTableProps) => {
    return (
        <Table.ScrollContainer minWidth={500}>
            <Table
                striped
                withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Titulo</Table.Th>
                        <Table.Th>Categoria</Table.Th>
                        <Table.Th>Estado</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {publications.map((p) => (
                        <PublicationTr
                            key={p.publication_id}
                            publication={p}
                            onGetPublications={onGetPublications} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}