import { Table } from "@mantine/core";

import { Language } from "../../../types";
import { LanguageTr } from "./LanguageTr";

interface LanguageTableProps {
    languages: Language[];
    onGetLanguages: () => Promise<void>;
}

export const LanguageTable = ({ languages, onGetLanguages }: LanguageTableProps) => {
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
                    {languages.map((l) => (
                        <LanguageTr
                            key={l.language_id}
                            language={l}
                            onGetLanguages={onGetLanguages} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}