import { Button, Menu, Table } from "@mantine/core";
import { Eye, GearSix, Trash } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { JobSchedule } from "../../../types";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";
import { JobScheduleForm } from "./JobScheduleForm";

interface JobScheduleTrProps {
    schedule: JobSchedule;
    onGetSchedule: () => Promise<void>;
}

export const JobScheduleTr = ({ schedule, onGetSchedule }: JobScheduleTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removeSchedule = async () => {
        // Do Request
        await fetchData(`${endpoints.jobSchedules}/${schedule.schedule_id}`, {
            showNotifications: true,
            successMessage: "Horario eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Schedules And Close Modal
        await onGetSchedule();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{schedule.name}</Table.Td>
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
                                <JobScheduleForm
                                    type="update"
                                    schedule={schedule}
                                    onGetSchedules={onGetSchedule} />,
                                "Actualizar Horario"
                            )}>
                            Ver
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Trash />}
                            onClick={() => openModal(
                                <ModalConfirmation
                                    description="¿Estas seguro de eliminar este horario?"
                                    btnColor="red"
                                    btnLabel="Eliminar"
                                    onConfirm={removeSchedule} />,
                                "Eliminar Horario"
                            )}>
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}