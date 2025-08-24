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
import { Hourglass, Info, Plus } from "@phosphor-icons/react";

import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import { AppPaths, Offers, OfferState, UserRole } from "../../types";
import { endpoints } from "../../endpoints";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { FilterCollapse } from "../../components/FilterCollapse";
import { JobFilters } from "../../components/JobFilters";
import { JobTable } from "../../components/panel/my_jobs/JobTable";

export const MyPendingJobs = () => {
    const { user } = useAuth();
    const { data, isLoading, fetchData } = useFetch<Offers>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: "",
        company: "",
        region: "",
        city: "",
        contract: ""
    });
    const totalPages = data?.total_offers ? Math.ceil(data.total_offers / 5) : 1;

    const getOffers = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.jobOffers);
        const params = new URLSearchParams({
            source: "panel",
            state: OfferState.pending,
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
            pageName="Mis Ofertas Por Verificar"
            PageIcon={Hourglass}>
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