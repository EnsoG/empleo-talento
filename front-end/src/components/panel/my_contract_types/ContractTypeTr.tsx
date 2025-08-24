import { Button, Menu, Table } from "@mantine/core";
import { Eye, GearSix, Trash } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { ContractType } from "../../../types";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";
import { ContractTypeForm } from "./ContractTypeForm";

interface ContractTypeTrProps {
    contractType: ContractType;
    onGetContracts: () => Promise<void>;
}

export const ContractTypeTr = ({ contractType, onGetContracts }: ContractTypeTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removeContract = async () => {
        // Do Request
        await fetchData(`${endpoints.contractTypes}/${contractType.type_id}`, {
            showNotifications: true,
            successMessage: "Tipo contrato eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Contract Types And Close Modal
        await onGetContracts();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{contractType.name}</Table.Td>
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
                                <ContractTypeForm
                                    type="update"
                                    contractType={contractType}
                                    onGetContracts={onGetContracts} />,
                                "Actualizar Tipo Contrato"
                            )}>
                            Ver
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Trash />}
                            onClick={() => openModal(
                                <ModalConfirmation
                                    description="¿Estas seguro de eliminar este tipo contrato?"
                                    btnColor="red"
                                    btnLabel="Eliminar"
                                    onConfirm={removeContract} />,
                                "Eliminar Tipo Contrato"
                            )}>
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}