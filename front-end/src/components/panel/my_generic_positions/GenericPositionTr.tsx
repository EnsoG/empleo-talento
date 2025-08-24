import { Button, Menu, Table } from "@mantine/core";
import { Eye, GearSix, Trash } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { GenericPosition } from "../../../types";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";
import { GenericPositionForm } from "./GenericPositionForm";

interface GenericPositionTrProps {
    genericPosition: GenericPosition;
    onGetPositions: () => Promise<void>;
}

export const GenericPositionTr = ({ genericPosition, onGetPositions }: GenericPositionTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removePosition = async () => {
        // Do Request
        await fetchData(`${endpoints.genericPositions}/${genericPosition.position_id}`, {
            showNotifications: true,
            successMessage: "Cargo generico eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Generic Positions And Close Modal
        await onGetPositions();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{genericPosition.name}</Table.Td>
            <Table.Td>{genericPosition.role_position.name}</Table.Td>
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
                                <GenericPositionForm
                                    type="update"
                                    genericPosition={genericPosition}
                                    onGetPositions={onGetPositions} />,
                                "Actualizar Cargo Generico"
                            )}>
                            Ver
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Trash />}
                            onClick={() => openModal(
                                <ModalConfirmation
                                    description="¿Estas seguro de eliminar este cargo generico?"
                                    btnColor="red"
                                    btnLabel="Eliminar"
                                    onConfirm={removePosition} />,
                                "Eliminar Cargo Generico"
                            )}>
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}