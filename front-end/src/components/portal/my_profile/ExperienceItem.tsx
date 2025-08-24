import {
    ActionIcon,
    Group,
    Text
} from "@mantine/core";
import { PencilSimple, Trash } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { months, WorkExperience } from "../../../types";
import { endpoints } from "../../../endpoints";
import { parseDateToLocal } from "../../../utilities";
import { ExperienceForm, } from "./ExperienceForm";
import { ModalConfirmation } from "../../ModalConfirmation";

export interface ExperienceItemProps {
    experience: WorkExperience;
    onGetExperiences: () => Promise<void>;
}

export const ExperienceItem = ({ experience, onGetExperiences }: ExperienceItemProps) => {
    const { fetchData } = useFetch();
    const { closeModal, openModal } = useModal();
    const startDate = parseDateToLocal(experience.start_date);
    const endDate = experience.end_date && parseDateToLocal(experience.end_date);

    const removeExperience = async () => {
        // Do Request
        await fetchData(`${endpoints.candidateWorkExperiences}/${experience.experience_id}`, {
            showNotifications: true,
            successMessage: "Estudio eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Experiences And Close Modal
        closeModal();
        await onGetExperiences()
    }

    return (
        <>
            <Group
                justify="space-between"
                align="center">
                <Text
                    size="sm"
                    component="span">
                    {experience.position}
                </Text>
                <Group>
                    <ActionIcon
                        size="md"
                        variant="transparent"
                        onClick={() => openModal(
                            <ExperienceForm
                                type="update"
                                experience={experience}
                                onGetExperiences={onGetExperiences} />,
                            "Actualizar Experiencia Laboral"
                        )}>
                        <PencilSimple height="70%" width="70%" />
                    </ActionIcon>
                    <ActionIcon
                        c="red"
                        size="md"
                        variant="transparent"
                        onClick={() => openModal(
                            <ModalConfirmation
                                description="¿Estas seguro de eliminar esta experiencia laboral? Ten en cuenta que esto tendra efecto en las postulaciones que hayas realizado y las que vayas a realizar"
                                btnColor="red"
                                btnLabel="Eliminar"
                                onConfirm={removeExperience} />,
                            "Eliminar Experiencia Laboral"
                        )}>
                        <Trash height="70%" width="70%" />
                    </ActionIcon>
                </Group>
            </Group>
            <Text
                c="gray"
                size="xs">
                {months[startDate.getMonth()]} {startDate.getFullYear()} - {(endDate)
                    ? months[endDate.getMonth()] + " " + endDate.getFullYear()
                    : "Al presente"}
            </Text>
            <Text
                size="xs"
                lineClamp={2}>
                Empresa: {experience.company ?? "Sin especificar"}
            </Text>
            <Text
                size="xs"
                lineClamp={2}>
                Descripcion: {experience.description ?? "Sin especificar"}
            </Text>
        </>
    )
}