import { Button, Menu, Table } from "@mantine/core";
import { Eye, GearSix, Trash } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { Software } from "../../../types";
import { SoftwareForm } from "./SoftwareForm";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";

interface SoftwareTrProps {
    software: Software;
    onGetSoftwares: () => Promise<void>;
}

export const SoftwareTr = ({ software, onGetSoftwares }: SoftwareTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removeSoftware = async () => {
        // Do Request
        await fetchData(`${endpoints.softwares}/${software.software_id}`, {
            showNotifications: true,
            successMessage: "Software eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Softwares And Close Modal
        await onGetSoftwares();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{software.name}</Table.Td>
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
                                <SoftwareForm
                                    type="update"
                                    software={software}
                                    onGetSoftwares={onGetSoftwares} />,
                                "Actualizar Software"
                            )}>
                            Ver
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Trash />}
                            onClick={() => openModal(
                                <ModalConfirmation
                                    description="¿Estas seguro de eliminar este software?"
                                    btnColor="red"
                                    btnLabel="Eliminar"
                                    onConfirm={removeSoftware} />,
                                "Eliminar Software"
                            )}>
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}