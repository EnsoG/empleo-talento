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
import { IdentificationCard, Info, Plus } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { GenericPositions } from "../../types";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { endpoints } from "../../endpoints";
import { GenericPositionForm } from "../../components/panel/my_generic_positions/GenericPositionForm";
import { GenericPositionTable } from "../../components/panel/my_generic_positions/GenericPositionTable";

export const MyGenericPositions = () => {
    const { openModal } = useModal();
    const { data, isLoading, fetchData } = useFetch<GenericPositions>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: ""
    });
    const totalPages = data?.total_positions ? Math.ceil(data.total_positions / 5) : 1;

    const getPositions = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.genericPositions);
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
        getPositions();
    }

    useEffect(() => {
        getPositions();
    }, [activePage])

    return (
        <PanelLayout
            pageName="Mis Cargos Genericos"
            PageIcon={IdentificationCard}>
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
                                    <GenericPositionForm
                                        type="create"
                                        onGetPositions={getPositions} />,
                                    "Agregar Cargo Generico"
                                )}>
                                Agregar Cargo Generico
                            </Button>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda cargo generico"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        {(data) && (data?.total_positions != 0)
                            ? <GenericPositionTable
                                genericPositions={data.generic_positions}
                                onGetPositions={getPositions} />
                            : <Alert
                                title="Cargo generico no encontrado"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado cargo generico
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