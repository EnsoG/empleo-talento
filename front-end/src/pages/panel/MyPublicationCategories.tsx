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
import { Info, Plus, Tag } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { PublicationCategories } from "../../types";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { endpoints } from "../../endpoints";
import { PublicationCategoryForm } from "../../components/panel/my_publication_categories/PublicationCategoryForm";
import { PublicationCategoryTable } from "../../components/panel/my_publication_categories/PublicationCategoryTable";

export const MyPublicationCategories = () => {
    const { openModal } = useModal();
    const { data, isLoading, fetchData } = useFetch<PublicationCategories>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: ""
    });
    const totalPages = data?.total_categories ? Math.ceil(data.total_categories / 5) : 1;

    const getCategories = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.publicationCategories);
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
        getCategories();
    }

    useEffect(() => {
        getCategories();
    }, [activePage])

    return (
        <PanelLayout
            pageName="Mis Categorias Publicacion"
            PageIcon={Tag}>
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
                                    <PublicationCategoryForm
                                        type="create"
                                        onGetCategories={getCategories} />,
                                    "Agregar Categoria Publicacion"
                                )}>
                                Agregar Categoria Publicacion
                            </Button>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda categoria publicacion"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        {(data) && (data?.total_categories != 0)
                            ? <PublicationCategoryTable
                                publicationCategories={data.publication_categories}
                                onGetCategories={getCategories} />
                            : <Alert
                                title="Categoria publicacion no encontrado"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado categoria publicacion
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