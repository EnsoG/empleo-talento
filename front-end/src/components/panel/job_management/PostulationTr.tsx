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
import { endpoints } from "../../../endpoints";
import { notifications } from "@mantine/notifications";


interface PostulationTrProps {
    postulation: PanelPostulation;
    allowUpdateState?: boolean;
    onGetPostulations: () => Promise<void>;
}

export const PostulationTr = ({ postulation, allowUpdateState = true, onGetPostulations }: PostulationTrProps) => {
    const { openModal } = useModal();
    const fullName = `${postulation.candidate.name} ${postulation.candidate.paternal} ${postulation.candidate.maternal ? postulation.candidate.maternal : ""}`;

    const getResume = async () => {
        try {
            const response = await fetch(`${endpoints.getResume}/${postulation.candidate.candidate_id}`, {
                method: "GET",
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Error al obtener el CV");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `cv_${postulation.candidate.candidate_id}.pdf`;
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            notifications.show({
                color: "red",
                title: "Ha Ocurrido Un Error",
                message: "No se ha podido obtener el CV del candidato",
                withBorder: true
            });
        }
    }

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
                        <Menu.Item onClick={getResume}>
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