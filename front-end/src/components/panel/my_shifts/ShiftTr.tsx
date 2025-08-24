import { Button, Menu, Table } from "@mantine/core";
import { Eye, GearSix, Trash } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { Shift } from "../../../types";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";
import { ShiftForm } from "./ShiftForm";

interface ShiftTrProps {
    shift: Shift;
    onGetShifts: () => Promise<void>;
}

export const ShiftTr = ({ shift, onGetShifts }: ShiftTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removeShift = async () => {
        // Do Request
        await fetchData(`${endpoints.shifts}/${shift.shift_id}`, {
            showNotifications: true,
            successMessage: "Turno eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Shifts And Close Modal
        await onGetShifts();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{shift.name}</Table.Td>
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
                                <ShiftForm
                                    type="update"
                                    shift={shift}
                                    onGetShifts={onGetShifts} />,
                                "Actualizar Turno"
                            )}>
                            Ver
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Trash />}
                            onClick={() => openModal(
                                <ModalConfirmation
                                    description="¿Estas seguro de eliminar este turno?"
                                    btnColor="red"
                                    btnLabel="Eliminar"
                                    onConfirm={removeShift} />,
                                "Eliminar Turno"
                            )}>
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}