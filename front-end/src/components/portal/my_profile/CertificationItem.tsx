import {
    ActionIcon,
    Box,
    Group,
    Text
} from "@mantine/core";
import { PencilSimple, Trash } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { CandidateCertification } from "../../../types";
import { parseDateToLocal } from "../../../utilities";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";
import { CertificationForm, } from "./CertificationForm";

export interface CertificateItemProps {
    certification: CandidateCertification
    onGetCertifications: () => Promise<void>;
}

export const CertificationItem = ({ certification, onGetCertifications }: CertificateItemProps) => {
    const { fetchData } = useFetch();
    const { closeModal, openModal } = useModal();
    const obtDate = certification.obtained_date && parseDateToLocal(certification.obtained_date).toLocaleDateString();
    const expDate = certification.expiration_date && parseDateToLocal(certification.expiration_date).toLocaleDateString();

    const removeCertification = async () => {
        await fetchData(`${endpoints.candidateCertifications}/${certification.certification_id}`, {
            showNotifications: true,
            successMessage: "Certificacion eliminada exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Certifications And Close Modal
        closeModal();
        await onGetCertifications();
    }

    return (
        <Box>
            <Group
                justify="space-between"
                align="center">
                <Text size="sm">{certification.name}</Text>
                <Group>
                    <ActionIcon
                        size="md"
                        variant="transparent"
                        onClick={() => openModal(
                            <CertificationForm
                                type="update"
                                certification={certification}
                                onGetCertifications={onGetCertifications} />,
                            "Agregar Certificado"
                        )}>
                        <PencilSimple height="70%" width="70%" />
                    </ActionIcon>
                    <ActionIcon
                        c="red"
                        size="md"
                        variant="transparent"
                        onClick={() => openModal(
                            <ModalConfirmation
                                description="¿Estas seguro de eliminar esta certificacion? Ten en cuenta que esto tendra efecto en las postulaciones que hayas realizado y las que vayas a realizar"
                                btnColor="red"
                                btnLabel="Eliminar"
                                onConfirm={removeCertification} />,
                            "Eliminar Certificacion"
                        )}>
                        <Trash height="70%" width="70%" />
                    </ActionIcon>
                </Group>
            </Group>
            <Text
                style={{ whiteSpace: 'pre-wrap', wordBreak: "break-word" }}
                size="sm"
                lineClamp={2}>
                {certification.description}
            </Text>
            <Text
                c="gray"
                size="xs">
                Tipo Certificacion: {certification.certification_type.name}
            </Text>
            <Text
                c="gray"
                size="xs">
                Institucion: {certification.institution ?? "Sin especificar"}
            </Text>
            <Text
                c="gray"
                size="xs">
                Fecha Obtencion: {obtDate ?? "Sin especificar"}
            </Text>
            <Text
                c="gray"
                size="xs">
                Fecha Vencimiento: {expDate ?? "Sin especificar"}
            </Text>
        </Box>
    )
}