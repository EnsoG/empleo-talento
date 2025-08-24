import { Button, Menu, Table } from "@mantine/core";
import { Eye, GearSix, Trash } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { JobDay } from "../../../types";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";
import { JobDayForm } from "./JobDayForm";

interface JobDayTrProps {
    jobDay: JobDay;
    onGetDays: () => Promise<void>;
}

export const JobDayTr = ({ jobDay, onGetDays }: JobDayTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removeDay = async () => {
        // Do Request
        await fetchData(`${endpoints.jobDays}/${jobDay.day_id}`, {
            showNotifications: true,
            successMessage: "Dia laboral eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Job Days And Close Modal
        await onGetDays();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{jobDay.name}</Table.Td>
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
                                <JobDayForm
                                    type="update"
                                    jobDay={jobDay}
                                    onGetDays={onGetDays} />,
                                "Actualizar Dia Laboral"
                            )}>
                            Ver
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Trash />}
                            onClick={() => openModal(
                                <ModalConfirmation
                                    description="¿Estas seguro de eliminar este dia laboral?"
                                    btnColor="red"
                                    btnLabel="Eliminar"
                                    onConfirm={removeDay} />,
                                "Eliminar Dia Laboral"
                            )}>
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}