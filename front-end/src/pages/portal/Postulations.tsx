import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Center,
    Pagination,
    Skeleton,
    Stack
} from "@mantine/core";
import { Info } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { CandidatePostulation } from "../../types";
import { endpoints } from "../../endpoints";
import { PortalLayout } from "../../layouts/PortalLayout";
import { MyProfileLayout } from "../../layouts/MyProfileLayout";
import { PortalBanner } from "../../components/portal/PortalBanner";
import { PostulationItem } from "../../components/portal/my_profile/PostulationItem";

type Postulations = {
    total_postulations: number;
    postulations: CandidatePostulation[];
}

export const Postulations = () => {
    const { data, isLoading, fetchData } = useFetch<Postulations>();
    const [activePage, setPage] = useState(1);
    const totalPages = useMemo(() => {
        return data?.total_postulations ? Math.ceil(data.total_postulations / 5) : 1;
    }, [data]);

    const getPostulations = async () => await fetchData(endpoints.postulations, {
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getPostulations()
    }, [activePage]);

    return (
        <PortalLayout>
            <PortalBanner title="Mi Perfil" />
            <MyProfileLayout>
                <Skeleton
                    height="100%"
                    visible={isLoading}>
                    <Stack>
                        {(data?.postulations?.length !== 0)
                            ? data?.postulations.map((p) => (
                                <PostulationItem
                                    key={p.postulation_id}
                                    title={p.job_offer.title}
                                    state={p.state}
                                    postulationDate={p.postulation_date}
                                    tradeName={p.job_offer.company?.trade_name ?? ""}
                                    companyLogo={p.job_offer.company?.logo ?? null}
                                    offerId={p.job_offer.offer_id} />
                            ))
                            : <Alert
                                title="Sin Postulationes Activas"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se han encontrado postulaciones activas en relacion a su cuenta, puedes visitar nuestra seccion "Ofertas Laborales" para explorar cada una de ellas
                            </Alert>
                        }
                        <Center>
                            <Pagination
                                total={totalPages}
                                onChange={setPage} />
                        </Center>
                    </Stack>
                </Skeleton>
            </MyProfileLayout>
        </PortalLayout>
    )
}