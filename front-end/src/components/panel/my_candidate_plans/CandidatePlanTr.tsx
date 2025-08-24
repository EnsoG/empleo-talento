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
import { AppPaths, CandidatePlan } from "../../../types";
import { endpoints } from "../../../endpoints";
import { CLPFormatter } from "../../../utilities";
import { ModalConfirmation } from "../../ModalConfirmation";

interface CandidatePlanTrProps {
    candidatePlan: CandidatePlan;
    onGetPlans: () => Promise<void>;
}

export const CandidatePlanTr = ({ candidatePlan, onGetPlans }: CandidatePlanTrProps) => {
    const { openModal, closeModal } = useModal();
    const { fetchData } = useFetch();

    const removePlan = async () => {
        // Do Request
        await fetchData(`${endpoints.candidatePlans}/${candidatePlan.plan_id}`, {
            showNotifications: true,
            successMessage: "Plan de candidato eliminado exitosamente",
            method: "DELETE",
            credentials: "include"
        });
        // Get Candidate Plans And Close Modal
        await onGetPlans();
        closeModal();
    }

    return (
        <Table.Tr>
            <Table.Td>{candidatePlan.name}</Table.Td>
            <Table.Td>{CLPFormatter.format(candidatePlan.value)}</Table.Td>
            <Table.Td>
                <Badge>{candidatePlan.state}</Badge>
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
                            to={`${AppPaths.candidatePlanDetail}/${candidatePlan.plan_id}`}
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