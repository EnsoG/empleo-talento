import { Button, Menu, Table } from "@mantine/core";
import { Eye, GearSix, Trash } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { PerformanceArea } from "../../../types";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";
import { PerformanceAreaForm } from "./PerformanceAreaForm";

interface PerformanceAreaTrProps {
    performanceArea: PerformanceArea;
    onGetAreas: () => Promise<void>;
}

export const PerformanceAreaTr = ({ performanceArea, onGetAreas }: PerformanceAreaTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removeArea = async () => {
        // Do Request
        await fetchData(`${endpoints.performanceAreas}/${performanceArea.area_id}`, {
            showNotifications: true,
            successMessage: "Area desmepeño eliminada exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Performance Areas And Close Modal
        await onGetAreas();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{performanceArea.name}</Table.Td>
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
                                <PerformanceAreaForm
                                    type="update"
                                    performanceArea={performanceArea}
                                    onGetAreas={onGetAreas} />,
                                "Actualizar Area Desmepeño"
                            )}>
                            Ver
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Trash />}
                            onClick={() => openModal(
                                <ModalConfirmation
                                    description="¿Estas seguro de eliminar esta area de desempeño?"
                                    btnColor="red"
                                    btnLabel="Eliminar"
                                    onConfirm={removeArea} />,
                                "Eliminar Area Desempeño"
                            )}>
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}