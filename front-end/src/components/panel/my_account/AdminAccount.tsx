import { useEffect } from "react";
import {
    ActionIcon,
    Card,
    Divider,
    Group,
    List,
    Skeleton,
    Text
} from "@mantine/core";
import { PencilSimple } from "@phosphor-icons/react";

import { useAuth } from "../../../hooks/useAuth";
import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { Admin } from "../../../types";
import { endpoints } from "../../../endpoints";
import { AdminInfoForm } from "./AdminInfoForm";

export const AdminAccount = () => {
    const { user } = useAuth();
    const { data, isLoading, fetchData } = useFetch<Admin>();
    const { openModal } = useModal();
    const fullName = `${data?.name} ${data?.paternal} ${data?.maternal ? data.maternal : ""}`;

    const getAdmin = async () => await fetchData(`${endpoints.adminUsers}/${user?.sub}`, {
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getAdmin();
    }, []);

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <Group justify="space-between" align="center">
                <Text c="blue" size="md" fw="bold">Datos Personales</Text>
                <ActionIcon
                    size="md"
                    variant="transparent"
                    onClick={() => {
                        if (data) openModal(
                            <AdminInfoForm
                                admin={{
                                    admin_id: data.admin_id,
                                    name: data.name,
                                    paternal: data.paternal,
                                    maternal: data.paternal
                                }}
                                onGetAdmin={getAdmin} />,
                            "Actualizar Datos Personales"
                        )
                    }}>
                    <PencilSimple height="70%" width="70%" />
                </ActionIcon>
            </Group>
            <Divider my="sm" />
            <Skeleton
                height="100%"
                visible={isLoading}>
                <List
                    size="sm"
                    spacing="md"
                    listStyleType="none"
                    center>
                    <List.Item>
                        <Text size="sm" component="span" fw="bold">Nombre Completo:</Text> {fullName}
                    </List.Item>
                </List>
            </Skeleton>
        </Card>
    )
}
