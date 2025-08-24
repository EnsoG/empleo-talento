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
import { Company, CompanySector } from "../../../types";
import { endpoints } from "../../../endpoints";
import { CompanyDetailsForm } from "./CompanyDetailsForm";

interface CompanyDetailsProps {
    sectors: CompanySector[];
}

export const CompanyDetails = ({ sectors }: CompanyDetailsProps) => {
    const { data, isLoading, fetchData } = useFetch<Company>();
    const { openModal } = useModal();

    const getCompanyDetails = async () => await fetchData(endpoints.getUserCompany, {
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getCompanyDetails();
    }, []);

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <Skeleton
                height="100%"
                visible={isLoading}>
                <Group justify="space-between" align="center">
                    <Text c="blue" size="md" fw="bold">Datos Corporativos</Text>
                    <ActionIcon
                        size="md"
                        variant="transparent"
                        onClick={() => {
                            if (data) openModal(
                                <CompanyDetailsForm
                                    companyId={data?.company_id}
                                    companyData={{
                                        trade_name: data?.trade_name,
                                        description: data?.description,
                                        email: data?.email,
                                        phone: data?.phone,
                                        web: data?.web,
                                        sector_id: data?.company_sector?.sector_id ?? 0
                                    }}
                                    sectors={sectors}
                                    onGetCompanyDetails={getCompanyDetails} />,
                                "Actualizar Datos Corporativos"
                            )
                        }}>
                        <PencilSimple height="70%" width="70%" />
                    </ActionIcon>
                </Group>
                <Divider my="sm" />
                <List
                    size="sm"
                    spacing="md"
                    listStyleType="none"
                    center>
                    <List.Item>
                        <Text size="sm" component="span" fw="bold">Nombre Fantasia:</Text> {data?.trade_name}
                    </List.Item>
                    <List.Item>
                        <Text size="sm" component="span" fw="bold">Descripcion:</Text> {data?.description ?? "Sin especificar"}
                    </List.Item>
                    <List.Item>
                        <Text size="sm" component="span" fw="bold">Correo Electronico:</Text> {data?.email}
                    </List.Item>
                    <List.Item>
                        <Text size="sm" component="span" fw="bold">Numero Telefonico:</Text> {data?.phone}
                    </List.Item>
                    <List.Item>
                        <Text size="sm" component="span" fw="bold">Pagina Web:</Text> {data?.web ?? "Sin especificar"}
                    </List.Item>
                    <List.Item>
                        <Text size="sm" component="span" fw="bold">Sector:</Text> {data?.company_sector?.name ?? "Sin especificar"}
                    </List.Item>
                </List>
            </Skeleton>
        </Card>
    )
}