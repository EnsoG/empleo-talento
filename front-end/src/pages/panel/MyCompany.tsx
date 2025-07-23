import { useEffect } from "react";
import { Skeleton, Stack } from "@mantine/core";
import { Building } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { CompanySectors } from "../../types";
import { endpoints } from "../../endpoints";
import { PanelLayout } from "../../layouts/PanelLayout";
import { CompanyLogo } from "../../components/panel/my_company/CompanyLogo";
import { CompanyDetails } from "../../components/panel/my_company/CompanyDetails";

export const MyCompany = () => {
    const { data, isLoading, fetchData } = useFetch<CompanySectors>();

    const getSectors = async () => await fetchData(endpoints.companySectors, {
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getSectors();
    }, []);

    return (
        <PanelLayout
            pageName="Mi Empresa"
            PageIcon={Building}>
            <Skeleton
                height="100%"
                visible={isLoading}>
                <Stack>
                    <CompanyLogo />
                    <CompanyDetails sectors={data?.company_sectors ?? []} />
                </Stack>
            </Skeleton>
        </PanelLayout>
    )
}