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
import { Info, OfficeChair, Plus } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { CompanySectors } from "../../types";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { endpoints } from "../../endpoints";
import { CompanySectorForm } from "../../components/panel/my_company_sectors/CompanySectorForm";
import { CompanySectorTable } from "../../components/panel/my_company_sectors/CompanySectorTable";

export const MyCompanySectors = () => {
    const { openModal } = useModal();
    const { data, isLoading, fetchData } = useFetch<CompanySectors>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: ""
    });
    const totalPages = data?.total_sectors ? Math.ceil(data.total_sectors / 5) : 1;

    const getSectors = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.companySectors);
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
        getSectors();
    }

    useEffect(() => {
        getSectors();
    }, [activePage])

    return (
        <PanelLayout
            pageName="Mis Sectores Empresariales"
            PageIcon={OfficeChair}>
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
                                    <CompanySectorForm
                                        type="create"
                                        onGetSectors={getSectors} />,
                                    "Agregar Sector Empresarial"
                                )}>
                                Agregar Sector Empresarial
                            </Button>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda idioma"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        {(data) && (data?.total_sectors != 0)
                            ? <CompanySectorTable
                                companySectors={data.company_sectors}
                                onGetSectors={getSectors} />
                            : <Alert
                                title="Sector empresarial no encontrado"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado sector empresarial
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