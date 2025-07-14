import { useEffect, useState } from "react";
import {
    Alert,
    Card,
    Center,
    Pagination,
    Skeleton,
    Stack
} from "@mantine/core";
import { Buildings, Info } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { CompanyPanel } from "../../types";
import { endpoints } from "../../endpoints";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { CompanyFilters } from "../../components/panel/my_companies/CompanyFilters";
import { CompanyTable } from "../../components/panel/my_companies/CompanyTable";
import { FilterCollapse } from "../../components/FilterCollapse";

type Companies = {
    total_companies: number;
    companies: CompanyPanel[];
}

export const MyCompanies = () => {
    const { data, isLoading, fetchData } = useFetch<Companies>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: "",
        state: ""
    });
    const totalPages = data?.total_companies ? Math.ceil(data.total_companies / 5) : 1;

    const getCompanies = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.companies);
        const params = new URLSearchParams({
            page: String(activePage),
            ...Object.fromEntries(
                Object.entries(filters).filter(
                    ([_, value]) => value !== null && value !== undefined && value !== ""
                )
            )
        });
        url.search = params.toString()
        // Do Request
        await fetchData(url.toString(), {
            method: "GET",
            credentials: "include"
        });
    }

    const updateFilter = (key: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value
        }));
    }

    const handleSearch = () => {
        setPage(1);
        getCompanies();
    }

    useEffect(() => {
        getCompanies();
    }, [activePage]);

    return (
        <PanelLayout
            pageName="Mis Empresas"
            PageIcon={Buildings}>
            <Card
                padding="lg"
                shadow="sm"
                withBorder>
                <Skeleton
                    height="100%"
                    visible={isLoading}>
                    <Stack>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda empresas"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        <FilterCollapse>
                            <CompanyFilters
                                filters={filters}
                                onUpdateFilter={updateFilter} />
                        </FilterCollapse>
                        {(data) && (data?.total_companies != 0)
                            ? <CompanyTable companies={data?.companies} />
                            : <Alert
                                title="Empresas no encontradas"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado empresas
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