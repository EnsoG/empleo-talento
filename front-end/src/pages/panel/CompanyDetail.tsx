import { useEffect } from "react";
import { useParams } from "react-router";
import { Building } from "@phosphor-icons/react";
import {
    Badge,
    Card,
    Grid,
    Skeleton,
    Stack,
    Table
} from "@mantine/core";

import { useFetch } from "../../hooks/useFetch";
import { CompanyPanel, companyUserStates } from "../../types";
import { endpoints } from "../../endpoints";
import { PanelLayout } from "../../layouts/PanelLayout";
import { UpdateCompanyState } from "../../components/panel/company_detail/UpdateCompanyState";
import { CardSection } from "../../components/CardSection";

export const CompanyDetail = () => {
    const { id } = useParams();
    const { data, isLoading, fetchData } = useFetch<CompanyPanel>();

    const getCompany = async () => await fetchData(`${endpoints.companies}/${id}`, {
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getCompany();
    }, []);

    return (
        <PanelLayout
            pageName="Detalle Empresa"
            PageIcon={Building}>
            <Skeleton
                height="100%"
                visible={isLoading}>
                {(data) &&
                    <Grid>
                        <Grid.Col span={{ base: 12, md: 8 }}>
                            <Stack>
                                <Card
                                    padding="lg"
                                    shadow="sm"
                                    withBorder>
                                    <CardSection
                                        title="Informacion Empresa"
                                        icon={Building}>
                                        <Table
                                            variant="vertical"
                                            layout="fixed"
                                            withTableBorder>
                                            <Table.Tbody>
                                                <Table.Tr>
                                                    <Table.Th>RUT Empresa</Table.Th>
                                                    <Table.Td>{data?.rut}</Table.Td>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th>Razon Social</Table.Th>
                                                    <Table.Td>{data?.legal_name}</Table.Td>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th>Nombre Fantasia</Table.Th>
                                                    <Table.Td>{data?.trade_name}</Table.Td>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th>Sector</Table.Th>
                                                    <Table.Td>{data?.company_sector?.name ?? "Sin especificar"}</Table.Td>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th>Estado Empresa</Table.Th>
                                                    <Table.Td>
                                                        <Badge>{companyUserStates[data?.state].name}</Badge>
                                                    </Table.Td>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th>Correo Electronico Empresa</Table.Th>
                                                    <Table.Td>{data?.email}</Table.Td>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th>Numero Telefonico Empresa</Table.Th>
                                                    <Table.Td>{data?.phone}</Table.Td>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th>Web</Table.Th>
                                                    <Table.Td>{data?.web ?? "Sin especificar"}</Table.Td>
                                                </Table.Tr>
                                                <Table.Tr>
                                                    <Table.Th>Descripcion</Table.Th>
                                                    <Table.Td>{data?.description ?? "Sin especificar"}</Table.Td>
                                                </Table.Tr>
                                            </Table.Tbody>
                                        </Table>
                                    </CardSection>
                                </Card>
                            </Stack>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            <UpdateCompanyState
                                companyId={data?.company_id}
                                state={data?.state}
                                onGetCompany={getCompany} />
                        </Grid.Col>
                    </Grid>
                }
            </Skeleton>
        </PanelLayout>
    )
}