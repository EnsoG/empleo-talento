import { Button, Menu, Table } from "@mantine/core";
import { Eye, GearSix, Trash } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { PublicationCategory } from "../../../types";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";
import { PublicationCategoryForm } from "./PublicationCategoryForm";

interface PublicationCategoryTrProps {
    publicationCategory: PublicationCategory;
    onGetCategories: () => Promise<void>;
}

export const PublicationCategoryTr = ({ publicationCategory, onGetCategories }: PublicationCategoryTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removeCategory = async () => {
        // Do Request
        await fetchData(`${endpoints.publicationCategories}/${publicationCategory.category_id}`, {
            showNotifications: true,
            successMessage: "Categoria publicacion eliminada exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Publication Categories And Close Modal
        await onGetCategories();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{publicationCategory.name}</Table.Td>
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
                                <PublicationCategoryForm
                                    type="update"
                                    publicationCategory={publicationCategory}
                                    onGetCategories={onGetCategories} />,
                                "Actualizar Categoria Publicacion"
                            )}>
                            Ver
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Trash />}
                            onClick={() => openModal(
                                <ModalConfirmation
                                    description="¿Estas seguro de eliminar esta categoria publicacion?"
                                    btnColor="red"
                                    btnLabel="Eliminar"
                                    onConfirm={removeCategory} />,
                                "Eliminar Categoria Publicacion"
                            )}>
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}