import { useEffect, useState } from "react";
import {
    Box,
    Container,
    Grid,
    Stack,
    Pagination,
    Image,
    Center,
    Skeleton,
    Alert,
} from "@mantine/core";
import { Info } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { Publications as PublicationsType } from "../../types";
import { endpoints } from "../../endpoints";
import { PortalLayout } from "../../layouts/PortalLayout";
import { PortalBanner } from "../../components/portal/PortalBanner";
import { SearchBar } from "../../components/SearchBar";
import { FilterCollapse } from "../../components/FilterCollapse";
import { PublicationCard } from "../../components/portal/publications/PublicationCard";
import { PublicationFilters } from "../../components/PublicationFilters";
import portalDivider2 from "../../assets/svg/portal-divider-2.svg";

export const Publications = () => {
    const { data, isLoading, fetchData } = useFetch<PublicationsType>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: "",
        category: ""
    });
    const totalPages = data?.total_publications ? Math.ceil(data.total_publications / 5) : 1;

    const getPublications = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.publications);
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
        getPublications();
    }

    useEffect(() => {
        getPublications();
    }, [activePage]);

    return (
        <PortalLayout>
            <PortalBanner title="Publicaciones" />
            <Box
                className="portal-section"
                component="section">
                <Container size="xl">
                    <Grid>
                        <Grid.Col span={{ base: 12, lg: 3 }}>
                            <FilterCollapse>
                                <PublicationFilters
                                    filters={filters}
                                    onUpdateFilter={updateFilter} />
                            </FilterCollapse>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, lg: 9 }}>
                            <SearchBar
                                value={filters.search}
                                placeholder="Busqueda publicacion"
                                onChange={(v) => updateFilter("search", v)}
                                onSearch={handleSearch} />
                            <Skeleton
                                height="100%"
                                visible={isLoading}
                                mt="md">
                                <Stack>
                                    {(data?.publications.length !== 0)
                                        ? data?.publications.map((p) => (
                                            <PublicationCard
                                                key={p.publication_id}
                                                publication={p} />
                                        ))
                                        : <Alert
                                            title="Sin Publicaciones"
                                            variant="outline"
                                            bg="white"
                                            icon={<Info />}>
                                            No se han encontrado publicaciones
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
                </Container>
                <Image
                    className="portal-divider"
                    src={portalDivider2} />
            </Box>
        </PortalLayout>
    )
}