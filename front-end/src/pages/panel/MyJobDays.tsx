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
import { Calendar, Info, Plus } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { JobDays } from "../../types";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { endpoints } from "../../endpoints";
import { JobDayForm } from "../../components/panel/my_job_days/JobDayForm";
import { JobDayTable } from "../../components/panel/my_job_days/JobDayTable";

export const MyJobDays = () => {
    const { openModal } = useModal();
    const { data, isLoading, fetchData } = useFetch<JobDays>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: ""
    });
    const totalPages = data?.total_days ? Math.ceil(data.total_days / 5) : 1;

    const getDays = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.jobDays);
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
        getDays();
    }

    useEffect(() => {
        getDays();
    }, [activePage])

    return (
        <PanelLayout
            pageName="Mis Dias Laborales"
            PageIcon={Calendar}>
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
                                    <JobDayForm
                                        type="create"
                                        onGetDays={getDays} />,
                                    "Agregar Dia Laboral"
                                )}>
                                Agregar Dia Laboral
                            </Button>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda dia laboral"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        {(data) && (data?.total_days != 0)
                            ? <JobDayTable
                                jobDays={data.job_days}
                                onGetDays={getDays} />
                            : <Alert
                                title="Dia laboral no encontrado"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado dia laboral
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