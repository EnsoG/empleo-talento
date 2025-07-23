import { useParams } from "react-router";
import { Card, Skeleton } from "@mantine/core";
import { User } from "@phosphor-icons/react";

import { PanelLayout } from "../../layouts/PanelLayout";
import { CandidatePlanForm } from "../../components/panel/CandidatePlanForm";
import { useFetch } from "../../hooks/useFetch";
import { CandidatePlan } from "../../types";
import { endpoints } from "../../endpoints";
import { useEffect } from "react";

export const CandidatePlanDetail = () => {
    const { id } = useParams();
    const { data, isLoading, fetchData } = useFetch<CandidatePlan>();

    const getPlan = async () => await fetchData(`${endpoints.candidatePlans}/${id}`, {
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
                        <CandidatePlanForm
                            type="update"
                            candidatePlan={data} />
                    </Card>
                }
            </Skeleton>
        </PanelLayout>
    )
}