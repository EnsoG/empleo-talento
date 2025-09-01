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
import { Info, Plus, Swap } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { Shifts } from "../../types";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";

import { endpoints } from "../../endpoints";

import { ShiftForm } from "../../components/panel/my_shifts/ShiftForm";
import { ShiftTable } from "../../components/panel/my_shifts/ShiftTable";

export const MyShifts = () => {
    const { openModal } = useModal();
    const { data, isLoading, fetchData } = useFetch<Shifts>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: ""
    });
    const totalPages = data?.total_shifts ? Math.ceil(data.total_shifts / 5) : 1;

    const getShifts = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.shifts);
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
        getShifts();
    }

    useEffect(() => {
        getShifts();
    }, [activePage])

    return (
        <PanelLayout
            pageName="Mis Turnos"
            PageIcon={Swap}>
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
                                    <ShiftForm
                                        type="create"
                                        onGetShifts={getShifts} />,
                                    "Agregar Turno"
                                )}>
                                Agregar Turno
                            </Button>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda turno"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        {(data) && (data?.total_shifts != 0)
                            ? <ShiftTable
                                shifts={data.shifts}
                                onGetShifts={getShifts} />
                            : <Alert
                                title="Turno no encontrado"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado turno
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
