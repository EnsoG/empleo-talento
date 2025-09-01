import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import {
    Box,
    Container,
    Grid,
    Stack,
    Pagination,
    Center,
    Skeleton,
    Alert,
} from "@mantine/core";
import { Info } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { Offers } from "../../types";
import { endpoints } from "../../endpoints";
import { PortalLayout } from "../../layouts/PortalLayout";
import { PortalBanner } from "../../components/portal/PortalBanner";
import { SearchBar } from "../../components/SearchBar";
import { FilterCollapse } from "../../components/FilterCollapse";
import { JobFilters } from "../../components/JobFilters";
import { JobCard } from "../../components/portal/JobCard";
import { CodelcoJobsSection } from "../../components/portal/CodelcoJobsSection";

export const JobBoard = () => {
    const [params] = useSearchParams();
    const { data: offers, isLoading: offersLoading, fetchData: fetchOffers } = useFetch<Offers>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: params.get("search") || "",
        region: params.get("region") || "",
        city: params.get("city") || "",
        contract: params.get("contract") || "",
        job_type: params.get("job_type") || ""
    });
    const totalPages = offers?.total_offers ? Math.ceil(offers.total_offers / 5) : 1;


    const getOffers = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.jobOffers);
        const params = new URLSearchParams({
            source: "portal",
            page: String(activePage),
            ...Object.fromEntries(
                Object.entries(filters).filter(
                    ([_, value]) => value !== null && value !== undefined && value !== ""
                )
            )
        });
        url.search = params.toString()
        // Do Request
        await fetchOffers(url.toString(), {
            method: "GET"
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
        getOffers();
    }

    useEffect(() => {
        getOffers();
    }, [activePage]);

    return (
        <PortalLayout>
            <PortalBanner title="Bolsa Empleo" />
            <Box
                className="portal-section"
                component="section">
                <Container size="xl">
                    <Grid>
                        <Grid.Col span={{ base: 12, lg: 3 }}>
                            <FilterCollapse>
                                <JobFilters
                                    filters={filters}
                                    onUpdateFilter={updateFilter} />
                            </FilterCollapse>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, lg: 9 }}>
                            <SearchBar
                                value={filters.search}
                                placeholder="Busqueda laboral"
                                onChange={(v) => updateFilter("search", v)}
                                onSearch={handleSearch} />
                            
                            <Skeleton
                                height="100%"
                                visible={offersLoading}
                                mt="md">
                                <Stack>
                                    {(offers?.offers.length !== 0)
                                        ? offers?.offers.map((o) => (
                                            <JobCard
                                                key={o.offer_id}
                                                offer={o} />
                                        ))
                                        : <Alert
                                            title="Sin Ofertas Laborales"
                                            variant="outline"
                                            bg="white"
                                            icon={<Info />}>
                                            No se han encontrado ofertas laborales
                                        </Alert>
                                    }
                                    <Center>
                                        <Pagination
                                            total={totalPages}
                                            onChange={setPage} />
                                    </Center>
                                </Stack>
                            </Skeleton>
                        </Grid.Col>
                    </Grid>
                    
                    {/* Sección de empleos de Codelco debajo del paginador */}
                    <CodelcoJobsSection />
                </Container>
            </Box>
        </PortalLayout>
    )
}