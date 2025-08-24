import { useEffect } from "react";
import { Alert, Skeleton, Stack } from "@mantine/core";

import { useFetch } from "../../../hooks/useFetch";
import { SummaryOffer } from "../../../types";
import { endpoints } from "../../../endpoints";
import { JobCard } from "../JobCard";
import { Info } from "@phosphor-icons/react";

interface LatestOffersProps {
    featured: boolean;
}

export const LatestOffers = ({ featured }: LatestOffersProps) => {
    const { data, isLoading, fetchData } = useFetch<SummaryOffer[]>();

    const getLatestOffers = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.getLatestOffers);
        const params = new URLSearchParams({ featured: featured.toString() });
        url.search = params.toString();
        // Do Request
        await fetchData(url.toString(), {
            method: "GET"
        });
    }

    useEffect(() => {
        getLatestOffers();
    }, []);

    return (
        <Skeleton
            visible={isLoading}
            height="100%">
            <Stack>
                {(data?.length !== 0)
                    ? data?.map((o) => (
                        <JobCard
                            key={o.offer_id}
                            offer={o} />
                    ))
                    : <Alert
                        title="Sin Ofertas Laborales"
                        variant="outline"
                        bg="white"
                        icon={<Info />}>
                        Por el momento no tenemos registradas ofertas laborales registradas dentro de Empleo Talento, por favor intente nuevamente mas tarde
                    </Alert>
                }
            </Stack>
        </Skeleton>
    )
}