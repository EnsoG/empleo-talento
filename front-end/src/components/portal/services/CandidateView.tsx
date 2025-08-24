import { useEffect } from "react";
import { Carousel } from "@mantine/carousel";
import { Alert, Center, Skeleton } from "@mantine/core";
import { Info } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch"
import { CandidatePlans } from "../../../types";
import { endpoints } from "../../../endpoints";
import { PricingPlan } from "../PricingPlan";

export const CandidateView = () => {
    const { data, isLoading, fetchData } = useFetch<CandidatePlans>();

    const getPlans = async () => await fetchData(endpoints.candidatePlans, {
        method: "GET"
    });

    useEffect(() => {
        getPlans();
    }, []);

    if (data?.total_plans == 0) return (
        <Alert
            title="Planes no encontrados"
            variant="outline"
            bg="white"
            mb="md"
            icon={<Info />}>
            No se han encontrado planes
        </Alert>
    )

    return (
        <Skeleton
            height="100%"
            visible={isLoading}>
            <Carousel
                mb="md"
                withControls>
                {
                    data?.candidate_plans.map((p) => (
                        <Carousel.Slide key={p.plan_id}>
                            <Center>
                                <PricingPlan
                                    plan={p} />
                            </Center>
                        </Carousel.Slide>
                    ))
                }
            </Carousel>
        </Skeleton>
    )
}