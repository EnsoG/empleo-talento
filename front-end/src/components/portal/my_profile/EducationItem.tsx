import {
    ActionIcon,
    Group,
    Text
} from "@mantine/core";
import { PencilSimple, Trash } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { CandidateStudy, months } from "../../../types";
import { endpoints } from "../../../endpoints";
import { parseDateToLocal } from "../../../utilities";
import { ModalConfirmation } from "../../ModalConfirmation";
import { EducationForm } from "./EducationForm";

interface EducationItemProps {
    study: CandidateStudy;
    onGetStudies: () => Promise<void>;
}

export const EducationItem = ({ study, onGetStudies }: EducationItemProps) => {
    const { fetchData } = useFetch();
    const { closeModal, openModal } = useModal();
    const sDate = parseDateToLocal(study.start_date);
    const eDate = study.end_date && parseDateToLocal(study.end_date);

    const removeStudy = async () => {
        // Do Request
        await fetchData(`${endpoints.candidateStudies}/${study.study_id}`, {
            showNotifications: true,
            successMessage: "Estudio eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Studies And Close Modal
        closeModal();
        await onGetStudies();
    }

    return (
        <>
            <Group
                justify="space-between"
                align="center">
                <Text
                    size="sm"
                    component="span">
                    {study.title}
                </Text>
                <Group>
                    <ActionIcon
                        size="md"
                        variant="transparent"
                        onClick={() => openModal(
                            <EducationForm
                                type="update"
                                study={study}
                                onGetStudies={onGetStudies} />,
                            "Actualizar Experiencia Educacional")}>
                        <PencilSimple height="70%" width="70%" />
                    </ActionIcon>
                    <ActionIcon
                        c="red"
                        size="md"
                        variant="transparent"
                        onClick={() => openModal(
                            <ModalConfirmation
                                description="¿Estas seguro de eliminar esta experiencia educacional? Ten en cuenta que esto tendra efecto en las postulaciones que hayas realizado y las que vayas a realizar"
                                btnColor="red"
                                btnLabel="Eliminar"
                                onConfirm={removeStudy} />,
                            "Eliminar Experiencia Educacional"
                        )}>
                        <Trash height="70%" width="70%" />
                    </ActionIcon>
                </Group>
            </Group>
            <Text
                c="gray"
                size="xs">
                {months[sDate.getMonth()]} {sDate.getFullYear()} - {(eDate)
                    ? months[eDate.getMonth()] + " " + eDate.getFullYear()
                    : "Al presente"}
            </Text>
            <Text
                size="xs"
                lineClamp={2}>
                {study.institution}
            </Text>
        </>
    )
}