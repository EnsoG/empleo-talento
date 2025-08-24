import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
    Alert,
    Button,
    Card,
    Center,
    Group,
    Pagination,
    Skeleton,
    Stack
} from "@mantine/core";
import { Article, Info, Plus } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { AppPaths, Publications } from "../../types";
import { endpoints } from "../../endpoints";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { PublicationTable } from "../../components/panel/my_publications/PublicationTable";
import { FilterCollapse } from "../../components/FilterCollapse";
import { PublicationFilters } from "../../components/PublicationFilters";

export const MyPublications = () => {
    const { data, isLoading, fetchData } = useFetch<Publications>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: "",
        category: "",
        state: ""
    });
    const totalPages = data?.total_publications ? Math.ceil(data.total_publications / 5) : 1;

    const getPublications = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.publications);
        const params = new URLSearchParams({
            source: "panel",
            page: String(activePage),
            ...Object.fromEntries(
                Object.entries(filters).filter(
                    ([_, value]) => value !== null && value !== undefined && value !== ""
                )
            )
        });
        url.search = params.toString();
        // Do Request
        await fetchData(url.toString(), {
            method: "GET"
        });
    };

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
    }, [activePage])

    return (
        <PanelLayout
            pageName="Mis Publicaciones"
            PageIcon={Article}>
            <Card
                padding="lg"
                shadow="sm"
                withBorder>
                <Skeleton
                    height="100%"
                    visible={isLoading}>
                    <Stack>
                        <Group justify="end">
                            <Link
                                to={AppPaths.addPublication}>
                                <Button
                                    leftSection={<Plus />}>
                                    Agregar Publicacion
                                </Button>
                            </Link>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda publicacion"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        <FilterCollapse>
                            <PublicationFilters
                                filters={filters}
                                showStateFilter={true}
                                onUpdateFilter={updateFilter} />
                        </FilterCollapse>
                        {(data) && (data?.total_publications != 0)
                            ? <PublicationTable
                                publications={data.publications}
                                onGetPublications={getPublications} />
                            : <Alert
                                title="Publicacion no encontrada"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado publicacion
                            </Alert>
                        }
                        <Center>
                            <Pagination
                                total={totalPages}
                                onChange={setPage} />
                        </Center>
                    </Stack>
                </Skeleton>
            </Card>
        </PanelLayout>
    )
}