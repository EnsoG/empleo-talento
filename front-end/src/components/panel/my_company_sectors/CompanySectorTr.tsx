import { Button, Menu, Table } from "@mantine/core";
import { Eye, GearSix, Trash } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { CompanySector } from "../../../types";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";
import { CompanySectorForm } from "./CompanySectorForm";

interface CompanySectorTrProps {
    companySector: CompanySector;
    onGetSectors: () => Promise<void>;
}

export const CompanySectorTr = ({ companySector, onGetSectors }: CompanySectorTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removeSector = async () => {
        // Do Request
        await fetchData(`${endpoints.companySectors}/${companySector.sector_id}`, {
            showNotifications: true,
            successMessage: "Sector empresarial eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Company Sectors And Close Modal
        await onGetSectors();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{companySector.name}</Table.Td>
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
                                <CompanySectorForm
                                    type="update"
                                    companySector={companySector}
                                    onGetSectors={onGetSectors} />,
                                "Actualizar Sector Empresarial"
                            )}>
                            Ver
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Trash />}
                            onClick={() => openModal(
                                <ModalConfirmation
                                    description="¿Estas seguro de eliminar este sector empresarial?"
                                    btnColor="red"
                                    btnLabel="Eliminar"
                                    onConfirm={removeSector} />,
                                "Eliminar Sector Empresarial"
                            )}>
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}