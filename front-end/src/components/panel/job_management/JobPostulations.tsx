import { useEffect, useState } from "react";
import {
    Alert,
    Card,
    Center,
    Pagination,
    Skeleton,
    Stack
} from "@mantine/core";
import { Info, Users } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch";
import { Offer, PanelPostulation } from "../../../types";
import { endpoints } from "../../../endpoints";
import { FilterCollapse } from "../../FilterCollapse";
import { CardSection } from "../../CardSection";
import { SearchBar } from "../../SearchBar";
import { PostulationTable } from "./PostulationTable";
import { PostulationFilters } from "./PostulationFilters";

interface JobPostulationsProps {
    offerId: Offer["offer_id"];
    offerState: Offer["state"];
}

type Postulations = {
    total_postulations: number;
    postulations: PanelPostulation[];
}

export const JobPostulations = ({ offerId, offerState }: JobPostulationsProps) => {
    const { data, isLoading, fetchData } = useFetch<Postulations>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: "",
        state: ""
    });
    const totalPages = data?.total_postulations ? Math.ceil(data.total_postulations / 5) : 1;

    const getPostulations = async () => {
        // Set URL And Query Params
        const url = new URL(`${endpoints.postulations}/${offerId}`);
        const params = new URLSearchParams({
            page: String(activePage),
            ...Object.fromEntries(
                Object.entries(filters).filter(
                    ([_, value]) => value !== null && value !== undefined && value !== ""
                )
            )
        });
        url.search = params.toString()
        // Do Request
        await fetchData(url.toString(), {
            method: "GET",
            credentials: "include"
        });
    }

    const updateFilter = (key: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value
        }));
    }

    const handleSearch = () => {
        setPage(1);
        getPostulations();
    }

    useEffect(() => {
        getPostulations();
    }, [activePage]);

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <CardSection
                title="Postulaciones"
                icon={Users}>
                <Skeleton
                    height="100%"
                    visible={isLoading}>
                    <Stack>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda candidato"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        <FilterCollapse>
                            <PostulationFilters
                                filters={filters}
                                onUpdateFilter={updateFilter} />
                        </FilterCollapse>
                        {(data) && (data?.total_postulations != 0)
                            ? <PostulationTable
                                postulations={data.postulations}
                                offerState={offerState}
                                onGetPostulations={getPostulations} />
                            : <Alert
                                title="Postulantes no encontrados"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se han encontrado postulantes
                            </Alert>
                        }
                        <Center>
                            <Pagination
                                total={totalPages}
                                onChange={setPage} />
                        </Center>
                    </Stack>
                </Skeleton>
            </CardSection>
        </Card>
    )
}