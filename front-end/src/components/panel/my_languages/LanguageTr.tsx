import { Button, Menu, Table } from "@mantine/core";
import { Eye, GearSix, Trash } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { Language } from "../../../types";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";
import { LanguageForm } from "./LanguageForm";

interface LanguageTrProps {
    language: Language;
    onGetLanguages: () => Promise<void>;
}

export const LanguageTr = ({ language, onGetLanguages }: LanguageTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removeLanguage = async () => {
        // Do Request
        await fetchData(`${endpoints.languages}/${language.language_id}`, {
            showNotifications: true,
            successMessage: "Idioma eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Languages And Close Modal
        await onGetLanguages();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{language.name}</Table.Td>
            <Table.Td>
                <Menu>
                    <Menu.Target>
                        <Button leftSection={<GearSix />}>
                            Acciones
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            leftSection={<Eye />}
                            onClick={() => openModal(
                                <LanguageForm
                                    type="update"
                                    language={language}
                                    onGetLanguages={onGetLanguages} />,
                                "Actualizar Idioma"
                            )}>
                            Ver
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Trash />}
                            onClick={() => openModal(
                                <ModalConfirmation
                                    description="¿Estas seguro de eliminar este idioma?"
                                    btnColor="red"
                                    btnLabel="Eliminar"
                                    onConfirm={removeLanguage} />,
                                "Eliminar Idioma"
                            )}>
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}