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
import { Info, Plus, Tag } from "@phosphor-icons/react";

import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import { AppPaths, Offers, UserRole } from "../../types";
import { endpoints } from "../../endpoints";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { FilterCollapse } from "../../components/FilterCollapse";
import { JobFilters } from "../../components/JobFilters";
import { JobTable } from "../../components/panel/my_jobs/JobTable";

export const MyJobs = () => {
    const { user } = useAuth();
    const { data, isLoading, fetchData } = useFetch<Offers>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: "",
        company: "",
        region: "",
        city: "",
        contract: "",
        state: ""
    });
    const totalPages = data?.total_offers ? Math.ceil(data.total_offers / 5) : 1;

    const getOffers = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.jobOffers);
        const params = new URLSearchParams({
            source: "panel",
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
        getOffers();
    }

    useEffect(() => {
        getOffers();
    }, [activePage]);

    return (
        <PanelLayout
            pageName="Mis Ofertas"
            PageIcon={Tag}>
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
                                className="react-link"
                                to={AppPaths.publishJob}>
                                <Button
                                    leftSection={<Plus />}>
                                    Publicar Oferta
                                </Button>
                            </Link>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda ofertas"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        <FilterCollapse>
                            <JobFilters
                                filters={filters}
                                showCompanyFilter={(user?.user_role == UserRole.admin) ? true : false}
                                showJobStateFilter={true}
                                onUpdateFilter={updateFilter} />
                        </FilterCollapse>
                        {(data) && (data?.total_offers != 0)
                            ? <JobTable offers={data.offers} />
                            : <Alert
                                title="Ofertas no encontradas"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se han encontrado ofertas
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