import { Button, Menu, Table } from "@mantine/core";
import { Eye, GearSix, Trash } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { JobType } from "../../../types";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";
import { JobTypeForm } from "./JobTypeForm";

interface JobTypeTrProps {
    jobType: JobType;
    onGetJobTypes: () => Promise<void>;
}

export const JobTypeTr = ({ jobType, onGetJobTypes }: JobTypeTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removeJobType = async () => {
        // Do Request
        await fetchData(`${endpoints.jobTypes}/${jobType.job_type_id}`, {
            showNotifications: true,
            successMessage: "Jornada eliminada exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Job Types And Close Modal
        await onGetJobTypes();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{jobType.name}</Table.Td>
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
                                <JobTypeForm
                                    type="update"
                                    jobType={jobType}
                                    onGetJobTypes={onGetJobTypes} />,
                                "Actualizar Jornada"
                            )}>
                            Ver
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Trash />}
                            onClick={() => openModal(
                                <ModalConfirmation
                                    description="¿Estas seguro de eliminar esta jornada?"
                                    btnColor="red"
                                    btnLabel="Eliminar"
                                    onConfirm={removeJobType} />,
                                "Eliminar Jornada"
                            )}>
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}