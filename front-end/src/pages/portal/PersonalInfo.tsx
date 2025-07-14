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

import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { Candidate, driverLicenses } from "../../types";
import { endpoints } from "../../endpoints";
import { PortalLayout } from "../../layouts/PortalLayout";
import { MyProfileLayout } from "../../layouts/MyProfileLayout";
import { PortalBanner } from "../../components/portal/PortalBanner";
import { PersonalInfoForm } from "../../components/portal/my_profile/PersonalInfoForm";

export const PersonalInfo = () => {
    const { data, isLoading, fetchData } = useFetch<Candidate>();
    const { openModal } = useModal()
    const fullName = `${data?.name} ${data?.paternal} ${data?.maternal ? data.maternal : ""}`;

    const getCandidate = async () => await fetchData(endpoints.candidates, {
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getCandidate();
    }, []);

    return (
        <PortalLayout>
            <PortalBanner title="Mi Perfil" />
            <MyProfileLayout>
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
                                if (data) {
                                    openModal(
                                        <PersonalInfoForm
                                            candidate={{
                                                name: data.name,
                                                paternal: data.paternal,
                                                maternal: data.maternal,
                                                run: data.run,
                                                birth_date: data.birth_date,
                                                gender: data.gender,
                                                nationality: data.nationality,
                                                phone: data.phone,
                                                license_id: data.license_id
                                            }}
                                            onGetCandidate={getCandidate} />,
                                        "Actualizar Datos Personales")
                                }
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
                                <Text size="sm" component="span" fw="bold">RUT:</Text> {data?.run ?? "Sin especificar"}
                            </List.Item>
                            <List.Item>
                                <Text size="sm" component="span" fw="bold">Fecha Nacimiento</Text> {data?.birth_date ?? "Sin especificar"}
                            </List.Item>
                            <List.Item>
                                <Text size="sm" component="span" fw="bold">Sexo:</Text> {data?.gender ?? "Sin especificar"}
                            </List.Item>
                            <List.Item>
                                <Text size="sm" component="span" fw="bold">Nacionalidad:</Text> {data?.nationality ?? "Sin especificar"}
                            </List.Item>
                            <List.Item>
                                <Text size="sm" component="span" fw="bold">Numero Telefonico:</Text> {data?.phone ?? "Sin especificar"}
                            </List.Item>
                            <List.Item>
                                <Text size="sm" component="span" fw="bold">Tipo Licencia:</Text> {data?.license_id ? driverLicenses[data.license_id] : "Sin especificar"}
                            </List.Item>
                        </List>
                    </Skeleton>
                </Card>
            </MyProfileLayout>
        </PortalLayout>
    )
}