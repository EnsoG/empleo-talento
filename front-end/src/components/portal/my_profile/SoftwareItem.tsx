import {
    ActionIcon,
    Box,
    Group,
    Text
} from "@mantine/core";
import { PencilSimple, Trash } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { CandidateSoftware } from "../../../types";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";
import { CandidateSoftwareForm } from "./CandidateSoftwareForm";

interface SoftwareItemProps {
    software: CandidateSoftware;
    onGetSoftwares: () => Promise<void>;
}

export const SoftwareItem = ({ software, onGetSoftwares }: SoftwareItemProps) => {
    const { fetchData } = useFetch();
    const { closeModal, openModal } = useModal();

    const removeSoftware = async () => {
        await fetchData(`${endpoints.candidateSoftwares}/${software.candidate_software_id}`, {
            showNotifications: true,
            successMessage: "Software eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Softwares And Close Modal
        closeModal();
        await onGetSoftwares();
    }

    return (
        <Box>
            <Group
                justify="space-between"
                align="center">
                <Text size="sm">{software.software.name}</Text>
                <Group>
                    <ActionIcon
                        size="md"
                        variant="transparent"
                        onClick={() => openModal(
                            <CandidateSoftwareForm
                                type="update"
                                candidateSoftware={{
                                    candidate_software_id: software.candidate_software_id,
                                    knownledge_level: software.knownledge_level
                                }}
                                onGetSoftwares={onGetSoftwares} />,
                            "Actualizar Software"
                        )}>
                        <PencilSimple height="70%" width="70%" />
                    </ActionIcon>
                    <ActionIcon
                        c="red"
                        size="md"
                        variant="transparent"
                        onClick={() => openModal(
                            <ModalConfirmation
                                description="¿Estas seguro de eliminar este software? Ten en cuenta que esto tendra efecto en las postulaciones que hayas realizado y las que vayas a realizar"
                                btnColor="red"
                                btnLabel="Eliminar"
                                onConfirm={removeSoftware} />,
                            "Eliminar Software"
                        )}>
                        <Trash height="70%" width="70%" />
                    </ActionIcon>
                </Group>
            </Group>
            <Text
                c="gray"
                size="sm">
                Nivel Conocimiento: {software.knownledge_level.name}
            </Text>
        </Box>
    )
}