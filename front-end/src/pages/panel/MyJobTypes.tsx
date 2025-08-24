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
import { Info, Plus, Timer } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { JobTypes } from "../../types";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { endpoints } from "../../endpoints";
import { JobTypeForm } from "../../components/panel/my_job_types/JobTypeForm";
import { JobTypeTable } from "../../components/panel/my_job_types/JobTypeTable";

export const MyJobTypes = () => {
    const { openModal } = useModal();
    const { data, isLoading, fetchData } = useFetch<JobTypes>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: ""
    });
    const totalPages = data?.total_types ? Math.ceil(data.total_types / 5) : 1;

    const getJobTypes = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.jobTypes);
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
        getJobTypes();
    }

    useEffect(() => {
        getJobTypes();
    }, [activePage])

    return (
        <PanelLayout
            pageName="Mis Jornadas"
            PageIcon={Timer}>
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
                                    <JobTypeForm
                                        type="create"
                                        onGetJobTypes={getJobTypes} />,
                                    "Agregar Jornada"
                                )}>
                                Agregar Jornada
                            </Button>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda jornada"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        {(data) && (data?.total_types != 0)
                            ? <JobTypeTable
                                jobTypes={data.job_types}
                                onGetJobTypes={getJobTypes} />
                            : <Alert
                                title="Jornada no encontrada"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado jornada
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