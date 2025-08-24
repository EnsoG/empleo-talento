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
import { Info, Plus, Users } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { CompanyUser } from "../../types";
import { endpoints } from "../../endpoints";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { CreateStaffForm } from "../../components/panel/my_staff/CreateStaffForm";
import { StaffTable } from "../../components/panel/my_staff/StaffTable";
import { FilterCollapse } from "../../components/FilterCollapse";
import { StaffFilters } from "../../components/panel/my_staff/StaffFilters";

type Staff = {
    total_staff: number;
    staff: CompanyUser[];
}

export const MyStaff = () => {
    const { data, isLoading, fetchData } = useFetch<Staff>();
    const { openModal } = useModal();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: "",
        position: "",
        state: ""
    });
    const totalPages = data?.total_staff ? Math.ceil(data.total_staff / 5) : 1;

    const getStaff = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.getStaff);
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
        getStaff();
    }

    useEffect(() => {
        getStaff();
    }, [activePage]);

    return (
        <PanelLayout
            pageName="Mi Personal"
            PageIcon={Users}>
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
                                    <CreateStaffForm
                                        onGetStaff={getStaff} />,
                                    "Agregar Personal"
                                )}>
                                Agregar Personal
                            </Button>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda personal"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        <FilterCollapse>
                            <StaffFilters
                                filters={filters}
                                onUpdateFilter={updateFilter} />
                        </FilterCollapse>
                        {(data) && (data?.total_staff != 0)
                            ? <StaffTable
                                staff={data.staff}
                                onGetStaff={getStaff} />
                            : <Alert
                                title="Personal no encontrado"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado personal
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