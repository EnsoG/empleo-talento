import {
    ActionIcon,
    Box,
    Group,
    Text
} from "@mantine/core";
import { PencilSimple, Trash } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { CandidateLanguage } from "../../../types";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";
import { LanguageForm } from "./LanguageForm";

interface LanguageItemProps {
    language: CandidateLanguage;
    onGetLanguages: () => Promise<void>;
}

export const LanguageItem = ({ language, onGetLanguages }: LanguageItemProps) => {
    const { fetchData } = useFetch();
    const { closeModal, openModal } = useModal();

    const removeLanguage = async () => {
        await fetchData(`${endpoints.candidateLanguages}/${language.candidate_language_id}`, {
            showNotifications: true,
            successMessage: "Idioma eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Languages And Close Modal
        closeModal();
        await onGetLanguages();
    }

    return (
        <Box>
            <Group
                justify="space-between"
                align="center">
                <Text size="sm">{language.language.name}</Text>
                <Group>
                    <ActionIcon
                        size="md"
                        variant="transparent"
                        onClick={() => openModal(
                            <LanguageForm
                                type="update"
                                candidateLanguage={{
                                    candidate_language_id: language.candidate_language_id,
                                    language_level: language.language_level
                                }}
                                onGetLanguages={onGetLanguages} />,
                            "Actualizar Idioma"
                        )}>
                        <PencilSimple height="70%" width="70%" />
                    </ActionIcon>
                    <ActionIcon
                        c="red"
                        size="md"
                        variant="transparent"
                        onClick={() => openModal(
                            <ModalConfirmation
                                description="¿Estas seguro de eliminar este idioma? Ten en cuenta que esto tendra efecto en las postulaciones que hayas realizado y las que vayas a realizar"
                                btnColor="red"
                                btnLabel="Eliminar"
                                onConfirm={removeLanguage} />,
                            "Eliminar Idioma"
                        )}>
                        <Trash height="70%" width="70%" />
                    </ActionIcon>
                </Group>
            </Group>
            <Text
                c="gray"
                size="sm">
                Nivel Conocimiento: {language.language_level.name}
            </Text>
        </Box>
    )
}