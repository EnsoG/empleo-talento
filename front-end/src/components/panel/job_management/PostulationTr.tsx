import {
    Badge,
    Button,
    Menu,
    Table
} from "@mantine/core";
import { GearSix } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { PanelPostulation } from "../../../types";
import { PostulationAnswers } from "./PostulationAnswers";
import { PostulationStateForm } from "./PostulationStateForm";


interface PostulationTrProps {
    postulation: PanelPostulation;
    allowUpdateState?: boolean;
    onGetPostulations: () => Promise<void>;
}

export const PostulationTr = ({ postulation, allowUpdateState = true, onGetPostulations }: PostulationTrProps) => {
    const { openModal } = useModal();
    const fullName = `${postulation.candidate.name} ${postulation.candidate.paternal} ${postulation.candidate.maternal ? postulation.candidate.maternal : ""}`;

    return (
        <Table.Tr>
            <Table.Td>{fullName}</Table.Td>
            <Table.Td>{postulation.candidate.email}</Table.Td>
            <Table.Td>{postulation.candidate.phone ?? "Sin especificar"}</Table.Td>
            <Table.Td>
                <Badge>{postulation.state}</Badge>
            </Table.Td>
            <Table.Td>
                <Menu>
                    <Menu.Target>
                        <Button leftSection={<GearSix />}>
                            Acciones
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {(allowUpdateState) &&
                            <Menu.Item onClick={() => openModal(
                                <PostulationStateForm
                                    postulationId={postulation.postulation_id}
                                    state={postulation.state}
                                    onGetPostulations={onGetPostulations} />,
                                "Actualizar Estado Postulante"
                            )}>
                                Actualizar Estado
                            </Menu.Item>
                        }
                        <Menu.Item>
                            Ver CV
                        </Menu.Item>
                        {(postulation.job_answers.length != 0) &&
                            <Menu.Item onClick={() => openModal(
                                <PostulationAnswers answers={postulation.job_answers} />,
                                "Respuestas Postulacion"
                            )}>
                                Ver Respuestas
                            </Menu.Item>
                        }
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}