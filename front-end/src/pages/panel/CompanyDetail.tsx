import { useEffect } from "react";
import { useParams } from "react-router";
import { Building } from "@phosphor-icons/react";
import {
    Card,
    Grid,
    Skeleton,
    Stack
} from "@mantine/core";

import { useFetch } from "../../hooks/useFetch";
import { AppPaths, CompanyPanel } from "../../types";
import { endpoints } from "../../endpoints";
import { PanelLayout } from "../../layouts/PanelLayout";
import { UpdateCompanyState } from "../../components/panel/company_detail/UpdateCompanyState";
import { CardSection } from "../../components/CardSection";
import { UpdateCompany } from "../../components/panel/company_detail/UpdateCompany";

export const CompanyDetail = () => {
    const { id } = useParams();
    const { data, isLoading, fetchData } = useFetch<CompanyPanel>();

    const getCompany = async () => await fetchData(`${endpoints.companies}/${id}`, {
        errorRedirect: AppPaths.myCompanies,
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
                                        <UpdateCompany
                                            company={{
                                                company_id: data.company_id,
                                                trade_name: data.trade_name,
                                                web: data.web,
                                                email: data.email,
                                                description: data.description,
                                                phone: data.phone,
                                                company_sector: data.company_sector
                                            }}
                                            onGetCompany={getCompany} />
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