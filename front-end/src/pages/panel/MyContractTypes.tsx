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
import { FileText, Info, Plus } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { ContractTypes } from "../../types";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { endpoints } from "../../endpoints";
import { ContractTypeForm } from "../../components/panel/my_contract_types/ContractTypeForm";
import { ContractTypeTable } from "../../components/panel/my_contract_types/ContractTypeTable";

export const MyContractTypes = () => {
    const { openModal } = useModal();
    const { data, isLoading, fetchData } = useFetch<ContractTypes>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: ""
    });
    const totalPages = data?.total_contracts ? Math.ceil(data.total_contracts / 5) : 1;

    const getContracts = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.contractTypes);
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
        getContracts();
    }

    useEffect(() => {
        getContracts();
    }, [activePage])

    return (
        <PanelLayout
            pageName="Mis Tipo Contrato"
            PageIcon={FileText}>
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
                                    <ContractTypeForm
                                        type="create"
                                        onGetContracts={getContracts} />,
                                    "Agregar Tipo Contrato"
                                )}>
                                Agregar Tipo Contrato
                            </Button>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda tipo contrato"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        {(data) && (data?.total_contracts != 0)
                            ? <ContractTypeTable
                                contractTypes={data.contract_types}
                                onGetContracts={getContracts} />
                            : <Alert
                                title="Tipo contrato no encontrado"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado tipo contrato
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