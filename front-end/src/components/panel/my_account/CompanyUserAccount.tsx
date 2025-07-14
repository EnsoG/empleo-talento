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

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { CompanyUser } from "../../../types";
import { endpoints } from "../../../endpoints";
import { CompanyUserInfoForm } from "./CompanyUserInfoForm";

export const CompanyUserAccount = () => {
    const { data, isLoading, fetchData } = useFetch<CompanyUser>();
    const { openModal } = useModal();
    const fullName = `${data?.name} ${data?.paternal} ${data?.maternal ? data.maternal : ""}`;

    const getCompanyUser = async () => await fetchData(endpoints.companyUsers, {
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getCompanyUser();
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
                            <CompanyUserInfoForm
                                companyUser={{
                                    user_id: data.user_id,
                                    name: data?.name,
                                    paternal: data.paternal,
                                    maternal: data.maternal,
                                    phone: data.phone
                                }}
                                onGetCompanyUser={getCompanyUser} />,
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
                    <List.Item>
                        <Text size="sm" component="span" fw="bold">Cargo:</Text> {data?.position}
                    </List.Item>
                    <List.Item>
                        <Text size="sm" component="span" fw="bold">Numero Telefonico:</Text> {data?.phone}
                    </List.Item>
                </List>
            </Skeleton>
        </Card>
    )
}