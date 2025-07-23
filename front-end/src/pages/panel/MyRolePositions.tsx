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
import { Info, Plus, UserGear } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { RolePositions } from "../../types";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { endpoints } from "../../endpoints";
import { RolePositionForm } from "../../components/panel/my_role_positions/RolePositionForm";
import { RolePositionTable } from "../../components/panel/my_role_positions/RolePositionTable";

export const MyRolePositions = () => {
    const { openModal } = useModal();
    const { data, isLoading, fetchData } = useFetch<RolePositions>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: ""
    });
    const totalPages = data?.total_roles ? Math.ceil(data.total_roles / 5) : 1;

    const getRoles = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.rolePositions);
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
        getRoles();
    }

    useEffect(() => {
        getRoles();
    }, [activePage])

    return (
        <PanelLayout
            pageName="Mis Roles Cargo"
            PageIcon={UserGear}>
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
                                    <RolePositionForm
                                        type="create"
                                        onGetRoles={getRoles} />,
                                    "Agregar Rol Cargo"
                                )}>
                                Agregar Rol Cargo
                            </Button>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda rol cargo"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        {(data) && (data?.total_roles != 0)
                            ? <RolePositionTable
                                rolePositions={data.role_positions}
                                onGetRoles={getRoles} />
                            : <Alert
                                title="Rol cargo no encontrado"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado rol cargo
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