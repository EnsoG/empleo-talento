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
import { GridFour, Info, Plus } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { Softwares } from "../../types";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { SoftwareForm } from "../../components/panel/my_softwares/SoftwareForm";
import { endpoints } from "../../endpoints";
import { SoftwareTable } from "../../components/panel/my_softwares/SoftwareTable";

export const MySoftwares = () => {
    const { openModal } = useModal();
    const { data, isLoading, fetchData } = useFetch<Softwares>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: ""
    });
    const totalPages = data?.total_softwares ? Math.ceil(data.total_softwares / 5) : 1;

    const getSoftwares = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.softwares);
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
        getSoftwares();
    }

    useEffect(() => {
        getSoftwares();
    }, [activePage])

    return (
        <PanelLayout
            pageName="Mis Softwares"
            PageIcon={GridFour}>
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
                                    <SoftwareForm
                                        type="create"
                                        onGetSoftwares={getSoftwares} />,
                                    "Agregar Software"
                                )}>
                                Agregar Software
                            </Button>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda software"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        {(data) && (data?.total_softwares != 0)
                            ? <SoftwareTable
                                softwares={data.softwares}
                                onGetSoftwares={getSoftwares} />
                            : <Alert
                                title="Software no encontrado"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado software
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