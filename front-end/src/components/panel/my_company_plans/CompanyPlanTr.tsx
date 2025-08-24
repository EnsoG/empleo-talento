import { Link } from "react-router";
import {
    Badge,
    Button,
    Menu,
    Table
} from "@mantine/core";
import { Eye, GearSix, Trash } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { AppPaths, CompanyPlan } from "../../../types";
import { endpoints } from "../../../endpoints";
import { CLPFormatter } from "../../../utilities";
import { ModalConfirmation } from "../../ModalConfirmation";

interface CompanyPlanTrProps {
    companyPlan: CompanyPlan;
    onGetPlans: () => Promise<void>;
}

export const CompanyPlanTr = ({ companyPlan, onGetPlans }: CompanyPlanTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removePlan = async () => {
        // Do Request
        await fetchData(`${endpoints.companyPlans}/${companyPlan.plan_id}`, {
            showNotifications: true,
            successMessage: "Plan de empresa eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Company Plans And Close Modal
        await onGetPlans();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{companyPlan.name}</Table.Td>
            <Table.Td>{CLPFormatter.format(companyPlan.value)}</Table.Td>
            <Table.Td>
                <Badge>{companyPlan.state}</Badge>
            </Table.Td>
            <Table.Td>
                <Menu>
                    <Menu.Target>
                        <Button leftSection={<GearSix />}>
                            Acciones
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Link
                            to={`${AppPaths.companyPlanDetail}/${companyPlan.plan_id}`}
                            className="react-link">
                            <Menu.Item leftSection={<Eye />}>
                                Ver
                            </Menu.Item>
                        </Link>
                        <Menu.Item
                            leftSection={<Trash />}
                            onClick={() => openModal(
                                <ModalConfirmation
                                    description="¿Estas seguro de eliminar este plan?"
                                    btnColor="red"
                                    btnLabel="Eliminar"
                                    onConfirm={removePlan} />,
                                "Eliminar Plan"
                            )}>
                            Eliminar
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
        </Table.Tr>
    )
}