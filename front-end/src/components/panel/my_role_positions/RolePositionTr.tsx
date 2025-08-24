import { Button, Menu, Table } from "@mantine/core";
import { Eye, GearSix, Trash } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { RolePosition } from "../../../types";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";
import { RolePositionForm } from "./RolePositionForm";

interface RolePositionTrProps {
    rolePosition: RolePosition;
    onGetRoles: () => Promise<void>;
}

export const RolePositionTr = ({ rolePosition, onGetRoles }: RolePositionTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removeRole = async () => {
        // Do Request
        await fetchData(`${endpoints.rolePositions}/${rolePosition.role_id}`, {
            showNotifications: true,
            successMessage: "Rol cargo eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Role Positions And Close Modal
        await onGetRoles();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{rolePosition.name}</Table.Td>
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
                                <RolePositionForm
                                    type="update"
                                    rolePosition={rolePosition}
                                    onGetRoles={onGetRoles} />,
                                "Actualizar Rol Cargo"
                            )}>
                            Ver
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Trash />}
                            onClick={() => openModal(
                                <ModalConfirmation
                                    description="¿Estas seguro de eliminar este rol cargo?"
                                    btnColor="red"
                                    btnLabel="Eliminar"
                                    onConfirm={removeRole} />,
                                "Eliminar Rol Cargo"
                            )}>
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}