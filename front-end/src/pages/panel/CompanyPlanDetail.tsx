import { useParams } from "react-router";
import { Card, Skeleton } from "@mantine/core";
import { Building } from "@phosphor-icons/react";

import { PanelLayout } from "../../layouts/PanelLayout";
import { PlanForm } from "../../components/panel/PlanForm";
import { useFetch } from "../../hooks/useFetch";
import { AppPaths, CompanyPlan } from "../../types";
import { endpoints } from "../../endpoints";
import { useEffect } from "react";

export const CompanyPlanDetail = () => {
    const { id } = useParams();
    const { data, isLoading, fetchData } = useFetch<CompanyPlan>();

    const getPlan = async () => await fetchData(`${endpoints.companyPlans}/${id}`, {
        errorRedirect: AppPaths.myCompanyPlans,
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getPlan();
    }, []);

    return (
        <PanelLayout
            pageName="Detalle Plan Empresa"
            PageIcon={Building}>
            <Skeleton
                height="100%"
                visible={isLoading}>
                {(data) &&
                    <Card
                        padding="lg"
                        shadow="sm"
                        withBorder>
                        <PlanForm
                            type="update"
                            planType="company"
                            plan={data} />
                    </Card>
                }
            </Skeleton>
        </PanelLayout>
    )
}