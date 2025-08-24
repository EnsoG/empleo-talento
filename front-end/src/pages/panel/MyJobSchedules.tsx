import { useEffect, useState } from "react";
import { Clock, Info, Plus } from "@phosphor-icons/react";
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

import { useModal } from "../../hooks/useModal";
import { useFetch } from "../../hooks/useFetch";
import { JobSchedules } from "../../types";
import { endpoints } from "../../endpoints";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { JobScheduleTable } from "../../components/panel/my_job_schedules/JobScheduleTable";
import { JobScheduleForm } from "../../components/panel/my_job_schedules/JobScheduleForm";

export const MyJobSchedules = () => {
    const { openModal } = useModal();
    const { data, isLoading, fetchData } = useFetch<JobSchedules>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: ""
    });
    const totalPages = data?.total_schedules ? Math.ceil(data.total_schedules / 5) : 1;

    const getSchedules = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.jobSchedules);
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
        getSchedules();
    }

    useEffect(() => {
        getSchedules();
    }, [activePage])


    return (
        <PanelLayout
            pageName="Mis Horarios"
            PageIcon={Clock}>
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
                                    <JobScheduleForm
                                        type="create"
                                        onGetSchedules={getSchedules} />,
                                    "Agregar Horario"
                                )}>
                                Agregar Horario
                            </Button>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda horario"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        {(data) && (data?.total_schedules != 0)
                            ? <JobScheduleTable
                                schedules={data.job_schedules}
                                onGetSchedules={getSchedules} />
                            : <Alert
                                title="Horario no encontrado"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado horario
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