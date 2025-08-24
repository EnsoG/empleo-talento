import { useEffect } from "react";
import {
    Box,
    Grid,
    Text,
    Button,
    Group,
    Alert,
    LoadingOverlay,
    Badge,
    ActionIcon,
    Tooltip
} from "@mantine/core";
import { ArrowClockwise, Info, Buildings } from "@phosphor-icons/react";

import { useCodelcoJobs } from "../../hooks/useCodelcoJobs";
import { CodelcoJobCard } from "./CodelcoJobCard";

export const CodelcoJobsSection = () => {
    const {
        codelcoJobs,
        isLoading,
        isRefreshing,
        getCodelcoJobs,
        runScraper
    } = useCodelcoJobs();

    useEffect(() => {
        getCodelcoJobs();
    }, [getCodelcoJobs]);

    return (
        <Box mb="xl">
            {/* Header */}
            <Group justify="space-between" mb="md">
                <Group>
                    <Buildings size={24} color="blue" />
                    <Text size="xl" fw={600}>
                        Empleos Codelco
                    </Text>
                    <Badge color="blue" variant="light">
                        Oficial
                    </Badge>
                </Group>
                
                <Group>
                    <Tooltip label="Actualizar empleos de Codelco">
                        <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={() => getCodelcoJobs()}
                            loading={isLoading}
                        >
                            <ArrowClockwise size={18} />
                        </ActionIcon>
                    </Tooltip>
                    
                    <Button
                        variant="light"
                        color="blue"
                        size="sm"
                        onClick={runScraper}
                        loading={isRefreshing}
                        leftSection={<ArrowClockwise size={16} />}
                    >
                        {isRefreshing ? "Actualizando..." : "Buscar nuevos"}
                    </Button>
                </Group>
            </Group>

            {/* Description */}
            <Text size="sm" c="dimmed" mb="md">
                Ofertas laborales extraídas directamente del sitio oficial de Codelco.
                Actualizado automáticamente desde https://empleos.codelco.cl
            </Text>

            {/* Loading State */}
            <Box pos="relative">
                <LoadingOverlay visible={isLoading} />
                
                {/* Jobs Grid */}
                {codelcoJobs?.jobs && codelcoJobs.jobs.length > 0 ? (
                    <>
                        <Text size="sm" c="dimmed" mb="md">
                            {codelcoJobs.count} empleos encontrados
                        </Text>
                        
                        <Grid>
                            {codelcoJobs.jobs.map((job) => (
                                <Grid.Col key={job.id} span={{ base: 12, sm: 6, lg: 4 }}>
                                    <CodelcoJobCard job={job} />
                                </Grid.Col>
                            ))}
                        </Grid>
                    </>
                ) : !isLoading ? (
                    <Alert
                        title="Sin empleos de Codelco"
                        variant="outline"
                        bg="white"
                        icon={<Info />}
                    >
                        No se han encontrado empleos de Codelco. 
                        Haz clic en "Buscar nuevos" para extraer las últimas ofertas.
                    </Alert>
                ) : null}
            </Box>
        </Box>
    );
};
