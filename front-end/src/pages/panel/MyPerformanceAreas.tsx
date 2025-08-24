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
import { Info, Plus, Target } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { PerformanceAreas } from "../../types";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { endpoints } from "../../endpoints";
import { PerformanceAreaForm } from "../../components/panel/my_performance_areas/PerformanceAreaForm";
import { PerformanceAreaTable } from "../../components/panel/my_performance_areas/PerformanceAreaTable";

export const MyPerformanceAreas = () => {
    const { openModal } = useModal();
    const { data, isLoading, fetchData } = useFetch<PerformanceAreas>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: ""
    });
    const totalPages = data?.total_areas ? Math.ceil(data.total_areas / 5) : 1;

    const getAreas = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.performanceAreas);
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
        getAreas();
    }

    useEffect(() => {
        getAreas();
    }, [activePage])

    return (
        <PanelLayout
            pageName="Mis Areas Desempeño"
            PageIcon={Target}>
            <Card
                padding="lg"
                shadow="sm"
                withBorder>
                <Skeleton
                    height="100%"
                    visible={isLoading}>
                    <Stack>
                        <Group justify="end">
                            <Button
                                leftSection={<Plus />}
                                onClick={() => openModal(
                                    <PerformanceAreaForm
                                        type="create"
                                        onGetAreas={getAreas} />,
                                    "Agregar Area Desempeño"
                                )}>
                                Agregar Area Desempeño
                            </Button>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda area desempeño"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        {(data) && (data?.total_areas != 0)
                            ? <PerformanceAreaTable
                                performanceAreas={data.performance_areas}
                                onGetAreas={getAreas} />
                            : <Alert
                                title="Area desempeño no encontrado"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado area desempeño
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