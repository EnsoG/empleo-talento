import {
    Badge,
    Button,
    Menu,
    Table
} from "@mantine/core";
import { GearSix } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { CompanyUser, companyUserStates } from "../../../types";
import { UpdateStaffStateForm } from "./UpdateStaffStateForm";
import { useAuth } from "../../../hooks/useAuth";

interface StaffTrProps {
    staff: CompanyUser;
    onGetStaff: () => Promise<void>;
}

export const StaffTr = ({ staff, onGetStaff }: StaffTrProps) => {
    const { user } = useAuth();
    const { openModal } = useModal();

    return (
        <Table.Tr>
            <Table.Td>{staff.name}</Table.Td>
            <Table.Td>{staff.position}</Table.Td>
            <Table.Td>{staff.email}</Table.Td>
            <Table.Td>{staff.phone}</Table.Td>
            <Table.Td>
                <Badge>{companyUserStates[staff.state].name}</Badge>
            </Table.Td>
            {(Number(user?.sub) != staff.user_id) &&
                <Table.Td>
                    <Menu>
                        <Menu.Target>
                            <Button leftSection={<GearSix />}>
                                Acciones
                            </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item onClick={() => openModal(
                                <UpdateStaffStateForm
                                    id={staff.user_id}
                                    state={staff.state}
                                    onGetStaff={onGetStaff} />,
                                "Cambiar Estado Personal"
                            )}>
                                Cambiar Estado
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Table.Td>
            }
        </Table.Tr>
    )
}