import { Link } from "react-router";
import {
    Badge,
    Button,
    Menu,
    Table
} from "@mantine/core";
import { Eye, GearSix, Trash } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { AppPaths, Publication } from "../../../types";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";

interface PublicationTrProps {
    publication: Publication;
    onGetPublications: () => Promise<void>;
}

export const PublicationTr = ({ publication, onGetPublications }: PublicationTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removePublication = async () => {
        // Do Request
        await fetchData(`${endpoints.publications}/${publication.publication_id}`, {
            showNotifications: true,
            successMessage: "Publicacion eliminada exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Publications And Close Modal
        await onGetPublications();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{publication.title}</Table.Td>
            <Table.Td>{publication.publication_category.name}</Table.Td>
            <Table.Td>
                <Badge>{publication.state}</Badge>
            </Table.Td>
            <Table.Td>
                <Menu>
                    <Menu.Target>
                        <Button leftSection={<GearSix />}>
                            Acciones
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Link
                            to={`${AppPaths.publicationDetail}/${publication.publication_id}`}
                            className="react-link">
                            <Menu.Item leftSection={<Eye />}>
                                Ver
                            </Menu.Item>
                        </Link>
                        <Menu.Item
                            leftSection={<Trash />}
                            onClick={() => openModal(
                                <ModalConfirmation
                                    description="¿Estas seguro de eliminar esta publicacion?"
                                    btnColor="red"
                                    btnLabel="Eliminar"
                                    onConfirm={removePublication} />,
                                "Eliminar Publicacion"
                            )}>
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}