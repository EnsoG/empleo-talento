import { Table } from "@mantine/core";

import { PublicationCategory } from "../../../types";
import { PublicationCategoryTr } from "./PublicationCategoryTr";

interface PublicationCategoryTableProps {
    publicationCategories: PublicationCategory[];
    onGetCategories: () => Promise<void>;
}

export const PublicationCategoryTable = ({ publicationCategories, onGetCategories }: PublicationCategoryTableProps) => {
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
                    {publicationCategories.map((c) => (
                        <PublicationCategoryTr
                            key={c.category_id}
                            publicationCategory={c}
                            onGetCategories={onGetCategories} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}