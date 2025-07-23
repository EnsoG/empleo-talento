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
import { Certificate, Info, Plus } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { CertificationTypes } from "../../types";
import { PanelLayout } from "../../layouts/PanelLayout";
import { SearchBar } from "../../components/SearchBar";
import { endpoints } from "../../endpoints";
import { CertificationTypeForm } from "../../components/panel/my_certification_types/CertificationTypeForm";
import { CertificationTypeTable } from "../../components/panel/my_certification_types/CertificationTypeTable";

export const MyCertificationTypes = () => {
    const { openModal } = useModal();
    const { data, isLoading, fetchData } = useFetch<CertificationTypes>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: ""
    });
    const totalPages = data?.total_types ? Math.ceil(data.total_types / 5) : 1;

    const getCertificationsTypes = async () => {
        // Set URL And Query Params
        const url = new URL(endpoints.certificationTypes);
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
        getCertificationsTypes();
    }

    useEffect(() => {
        getCertificationsTypes();
    }, [activePage])

    return (
        <PanelLayout
            pageName="Mis Tipos Certificationes"
            PageIcon={Certificate}>
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
                                    <CertificationTypeForm
                                        type="create"
                                        onGetTypes={getCertificationsTypes} />,
                                    "Agregar Tipo Certificacion"
                                )}>
                                Agregar Tipo Certificacion
                            </Button>
                        </Group>
                        <SearchBar
                            value={filters.search}
                            placeholder="Busqueda tipo certificacion"
                            onChange={(v) => updateFilter("search", v)}
                            onSearch={handleSearch} />
                        {(data) && (data?.total_types != 0)
                            ? <CertificationTypeTable
                                certificationTypes={data.certification_types}
                                onGetTypes={getCertificationsTypes} />
                            : <Alert
                                title="Tipo certificacion no encontrado"
                                variant="outline"
                                bg="white"
                                icon={<Info />}>
                                No se ha encontrado tipo certificacion
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