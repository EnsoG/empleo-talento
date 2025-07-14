import { Table } from "@mantine/core";

import { Offer, OfferState, PanelPostulation } from "../../../types";
import { PostulationTr } from "./PostulationTr";

interface PostulationTableProps {
    postulations: PanelPostulation[];
    offerState: Offer["state"];
    onGetPostulations: () => Promise<void>;
}

export const PostulationTable = ({ postulations, offerState, onGetPostulations }: PostulationTableProps) => {
    return (
        <Table.ScrollContainer minWidth={500}>
            <Table
                striped
                withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Nombre</Table.Th>
                        <Table.Th>Correo Electronico</Table.Th>
                        <Table.Th>Numero Telefonico</Table.Th>
                        <Table.Th>Estado</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {postulations.map((p) => (
                        <PostulationTr
                            key={p.postulation_id}
                            postulation={p}
                            allowUpdateState={offerState == OfferState.active}
                            onGetPostulations={onGetPostulations} />
                    ))}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}