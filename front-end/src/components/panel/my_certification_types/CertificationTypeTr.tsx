import { Button, Menu, Table } from "@mantine/core";
import { Eye, GearSix, Trash } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { CertificationType } from "../../../types";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { ModalConfirmation } from "../../ModalConfirmation";
import { CertificationTypeForm } from "./CertificationTypeForm";

interface CertificationTypeTrProps {
    certificationType: CertificationType;
    onGetTypes: () => Promise<void>;
}

export const CertificationTypeTr = ({ certificationType, onGetTypes }: CertificationTypeTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removeCertificationType = async () => {
        // Do Request
        await fetchData(`${endpoints.certificationTypes}/${certificationType.certification_type_id}`, {
            showNotifications: true,
            successMessage: "Tipo certificacion eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Certification Types And Close Modal
        await onGetTypes();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{certificationType.name}</Table.Td>
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
                                <CertificationTypeForm
                                    type="update"
                                    certificationType={certificationType}
                                    onGetTypes={onGetTypes} />,
                                "Actualizar Tipo Certificacion"
                            )}>
                            Ver
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<Trash />}
                            onClick={() => openModal(
                                <ModalConfirmation
                                    description="¿Estas seguro de eliminar este tipo de certificacion?"
                                    btnColor="red"
                                    btnLabel="Eliminar"
                                    onConfirm={removeCertificationType} />,
                                "Eliminar Tipo Certificacion"
                            )}>
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}