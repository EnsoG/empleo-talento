import { useEffect } from "react";
import { Carousel } from "@mantine/carousel";
import { Alert, Center, Skeleton } from "@mantine/core";
import { Info } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch"
import { CompanyPlans } from "../../../types";
import { endpoints } from "../../../endpoints";
import { PricingPlan } from "../PricingPlan";

export const CompanyView = () => {
    const { data, isLoading, fetchData } = useFetch<CompanyPlans>();

    const getPlans = async () => await fetchData(endpoints.companyPlans, {
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
            {
                data?.company_plans.map((p) => (
                    <Carousel.Slide key={p.plan_id}>
                        <Center>
                            <PricingPlan
                                plan={p} />
                        </Center>
                    </Carousel.Slide>
                ))
            }
        </Skeleton>
    )
}