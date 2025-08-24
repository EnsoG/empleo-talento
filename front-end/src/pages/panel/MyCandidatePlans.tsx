import { useEffect, useState } from "react";
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
import { Info, Plus, User } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { AppPaths, CandidatePlans } from "../../types";
import { endpoints } from "../../endpoints";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { CandidatePlanTable } from "../../components/panel/my_candidate_plans/CandidatePlanTable";
import { Link } from "react-router";

export const MyCandidatePlans = () => {
    const { data, isLoading, fetchData } = useFetch<CandidatePlans>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: ""
    });
    const totalPages = data?.total_plans ? Math.ceil(data.total_plans / 5) : 1;

    const getPlans = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.candidatePlans);
        const params = new URLSearchParams({
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
        getPlans();
    }

    useEffect(() => {
        getPlans();
    }, [activePage])

    return (
        <PanelLayout
            pageName="Planes Candidatos"
            PageIcon={User}>
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
                                to={AppPaths.addCandidatePlan}>
                                <Button
                                    leftSection={<Plus />}>
                                    Agregar Plan
                                </Button>
                            </Link>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda plan"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        {(data) && (data?.total_plans != 0)
                            ? <CandidatePlanTable
                                candidatePlans={data.candidate_plans}
                                onGetPlans={getPlans} />
                            : <Alert
                                title="Plan no encontrado"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado plan
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