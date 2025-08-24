import { useParams } from "react-router";
import { Card, Skeleton } from "@mantine/core";
import { User } from "@phosphor-icons/react";

import { PanelLayout } from "../../layouts/PanelLayout";
import { PlanForm } from "../../components/panel/PlanForm";
import { useFetch } from "../../hooks/useFetch";
import { AppPaths, CandidatePlan } from "../../types";
import { endpoints } from "../../endpoints";
import { useEffect } from "react";

export const CandidatePlanDetail = () => {
    const { id } = useParams();
    const { data, isLoading, fetchData } = useFetch<CandidatePlan>();

    const getPlan = async () => await fetchData(`${endpoints.candidatePlans}/${id}`, {
        errorRedirect: AppPaths.myCandidatePlans,
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getPlan();
    }, []);

    return (
        <PanelLayout
            pageName="Detalle Plan Candidato"
            PageIcon={User}>
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
                            planType="candidate"
                            plan={data} />
                    </Card>
                }
            </Skeleton>
        </PanelLayout>
    )
}