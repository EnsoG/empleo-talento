import { Skeleton, Stack } from "@mantine/core";
import { Building } from "@phosphor-icons/react";

import { PanelLayout } from "../../layouts/PanelLayout";
import { CompanyLogo } from "../../components/panel/company_info/CompanyLogo";
import { CompanyDetails } from "../../components/panel/company_info/CompanyDetails";
import { useFetch } from "../../hooks/useFetch";
import { endpoints } from "../../endpoints";
import { useEffect } from "react";
import { CompanySector } from "../../types";

export const CompanyInfo = () => {
    const { data, isLoading, fetchData } = useFetch<CompanySector[]>();

    const getSectors = async () => await fetchData(endpoints.getCompanySectors, {
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getSectors();
    }, []);

    return (
        <PanelLayout
            pageName="Informacion Empresa"
            PageIcon={Building}>
            <Skeleton
                height="100%"
                visible={isLoading}>
                <Stack>
                    <CompanyLogo />
                    <CompanyDetails sectors={data ?? []} />
                </Stack>
            </Skeleton>
        </PanelLayout>
    )
}