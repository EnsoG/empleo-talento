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
import { Info, Plus, Translate } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { Languages } from "../../types";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { endpoints } from "../../endpoints";
import { LanguageForm } from "../../components/panel/my_languages/LanguageForm";
import { LanguageTable } from "../../components/panel/my_languages/LanguageTable";

export const MyLanguages = () => {
    const { openModal } = useModal();
    const { data, isLoading, fetchData } = useFetch<Languages>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: ""
    });
    const totalPages = data?.total_languages ? Math.ceil(data.total_languages / 5) : 1;

    const getLanguages = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.languages);
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
        getLanguages();
    }

    useEffect(() => {
        getLanguages();
    }, [activePage])

    return (
        <PanelLayout
            pageName="Mis Idiomas"
            PageIcon={Translate}>
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
                                    <LanguageForm
                                        type="create"
                                        onGetLanguages={getLanguages} />,
                                    "Agregar Idioma"
                                )}>
                                Agregar Idioma
                            </Button>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda idioma"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        {(data) && (data?.total_languages != 0)
                            ? <LanguageTable
                                languages={data.languages}
                                onGetLanguages={getLanguages} />
                            : <Alert
                                title="Idioma no encontrado"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado idioma
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