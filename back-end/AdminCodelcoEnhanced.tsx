import React, { useState, useEffect, useRef, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import {
    Card,
    Text,
    Button,
    Group,
    Stack,
    Badge,
    Loader,
    SimpleGrid,
    Title,
    Progress,
    Center,
    Alert,
    Box,
    ThemeIcon
} from '@mantine/core';
import {
    Robot,
    Play,
    ArrowSquareOut,
    MapPin,
    Calendar,
    CheckCircle,
    Clock,
    X,
    ArrowClockwise
} from '@phosphor-icons/react';
import { endpoints } from '../endpoints';

interface ScrapingProgress {
    status: 'idle' | 'starting' | 'fetching_pages' | 'extracting_jobs' | 'saving_to_db' | 'completed' | 'error';
    progress_percentage: number;
    current_step: string;
    total_jobs_found: number;
    jobs_processed: number;
    jobs_saved: number;
    start_time: string | null;
    end_time: string | null;
    duration_seconds: number | null;
    error_message: string | null;
    json_file: string | null;
    is_running: boolean;
    is_completed: boolean;
    has_error: boolean;
}

interface CodelcoJob {
    id: number;
    external_id: string;
    title: string;
    location: string;
    region: string;
    publication_date: string;
    scraped_at: string;
    url: string;
    is_active: boolean;
    description: string;
    requirements: string;
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'idle':
            return <Clock size={16} color="#868e96" />;
        case 'starting':
        case 'fetching_pages':
        case 'extracting_jobs':
        case 'saving_to_db':
            return <Loader size={16} />;
        case 'completed':
            return <CheckCircle size={16} color="#51cf66" />;
        case 'error':
            return <X size={16} color="#ff6b6b" />;
        default:
            return <Clock size={16} color="#868e96" />;
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'idle':
            return 'gray';
        case 'starting':
        case 'fetching_pages':
        case 'extracting_jobs':
        case 'saving_to_db':
            return 'blue';
        case 'completed':
            return 'green';
        case 'error':
            return 'red';
        default:
            return 'gray';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'idle':
            return 'Inactivo';
        case 'starting':
            return 'Iniciando...';
        case 'fetching_pages':
            return 'Obteniendo páginas';
        case 'extracting_jobs':
            return 'Extrayendo empleos';
        case 'saving_to_db':
            return 'Guardando en BD';
        case 'completed':
            return 'Completado';
        case 'error':
            return 'Error';
        default:
            return 'Desconocido';
    }
};

interface LoadingOverlayProps {
    progress: ScrapingProgress;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ progress }) => {
    const formatDuration = (seconds: number | null) => {
        if (!seconds) return '0s';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    };

    return (
        <Card shadow="xl" padding="xl" radius="md" style={{ 
            position: 'fixed', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            zIndex: 1000,
            minWidth: '400px',
            maxWidth: '500px'
        }}>
            <Stack gap="lg" align="center">
                <ThemeIcon
                    size={60}
                    radius="xl"
                    color={progress.has_error ? 'red' : progress.is_completed ? 'green' : 'blue'}
                    variant="light"
                >
                    {getStatusIcon(progress.status)}
                </ThemeIcon>

                <Stack gap="xs" align="center">
                    <Title order={3}>Scraping de Codelco</Title>
                    <Badge color={getStatusColor(progress.status)} size="lg">
                        {getStatusText(progress.status)}
                    </Badge>
                </Stack>

                {!progress.has_error && (
                    <Box w="100%">
                        <Text size="sm" c="dimmed" mb="xs">
                            {progress.current_step || 'Preparando...'}
                        </Text>
                        <Progress
                            value={progress.progress_percentage}
                            size="lg"
                            radius="xl"
                            color={progress.is_completed ? 'green' : 'blue'}
                            animated={progress.is_running}
                        />
                        <Text size="xs" c="dimmed" mt="xs" ta="center">
                            {progress.progress_percentage.toFixed(1)}%
                        </Text>
                    </Box>
                )}

                {progress.has_error && (
                    <Alert color="red" title="Error en el scraping" style={{ width: '100%' }}>
                        {progress.error_message}
                    </Alert>
                )}

                {(progress.total_jobs_found > 0 || progress.is_completed) && (
                    <SimpleGrid cols={3} w="100%">
                        <Stack gap={0} align="center">
                            <Text size="xl" fw={700} c="blue">
                                {progress.total_jobs_found}
                            </Text>
                            <Text size="xs" c="dimmed">Encontrados</Text>
                        </Stack>
                        <Stack gap={0} align="center">
                            <Text size="xl" fw={700} c="orange">
                                {progress.jobs_processed}
                            </Text>
                            <Text size="xs" c="dimmed">Procesados</Text>
                        </Stack>
                        <Stack gap={0} align="center">
                            <Text size="xl" fw={700} c="green">
                                {progress.jobs_saved}
                            </Text>
                            <Text size="xs" c="dimmed">Guardados</Text>
                        </Stack>
                    </SimpleGrid>
                )}

                {progress.duration_seconds && (
                    <Text size="sm" c="dimmed">
                        Duración: {formatDuration(progress.duration_seconds)}
                    </Text>
                )}

                {progress.is_completed && (
                    <Alert color="green" title="¡Scraping completado!" style={{ width: '100%' }}>
                        Se procesaron {progress.total_jobs_found} empleos exitosamente.
                        {progress.json_file && (
                            <><br />Archivo generado: {progress.json_file}</>
                        )}
                    </Alert>
                )}
            </Stack>
        </Card>
    );
};

export const AdminCodelcoEnhanced: React.FC = () => {
    const [progress, setProgress] = useState<ScrapingProgress | null>(null);
    const [jobs, setJobs] = useState<CodelcoJob[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const fetchProgress = useCallback(async () => {
        try {
            const response = await fetch(endpoints.adminCodelcoProgress, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setProgress(data.progress);
                
                // Mostrar overlay si está ejecutándose o acaba de completar
                if (data.progress.is_running || (data.progress.is_completed && showOverlay)) {
                    setShowOverlay(true);
                }

                // Ocultar overlay si completó exitosamente después de 3 segundos
                if (data.progress.is_completed && !data.progress.has_error && showOverlay) {
                    setTimeout(() => {
                        setShowOverlay(false);
                        fetchJobs(); // Refrescar lista de empleos
                    }, 3000);
                }

                // Ocultar overlay si hay error después de 5 segundos
                if (data.progress.has_error && showOverlay) {
                    setTimeout(() => {
                        setShowOverlay(false);
                    }, 5000);
                }
            }
        } catch (error) {
            console.error('Error obteniendo progreso:', error);
        }
    }, [showOverlay]);

    const fetchJobs = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(endpoints.adminCodelcoJobs + '?limit=20', {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setJobs(data.jobs || []);
            }
        } catch (error) {
            console.error('Error obteniendo empleos:', error);
            notifications.show({
                title: 'Error',
                message: 'Error al obtener empleos de Codelco',
                color: 'red'
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleExecuteScraping = async () => {
        try {
            const response = await fetch(endpoints.adminCodelcoExecute, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                await response.json();
                
                notifications.show({
                    title: 'Scraping Iniciado',
                    message: 'Scraping de Codelco iniciado exitosamente!',
                    color: 'green'
                });

                setShowOverlay(true);
                // Iniciar polling del progreso
                startProgressPolling();

            } else if (response.status === 409) {
                await response.json();
                notifications.show({
                    title: 'Scraping en Progreso',
                    message: 'Ya hay un proceso de scraping ejecutándose',
                    color: 'yellow'
                });
                setShowOverlay(true);
                startProgressPolling();
            }
        } catch (error) {
            console.error('Error ejecutando scraping:', error);
            notifications.show({
                title: 'Error',
                message: 'Error al iniciar scraping de Codelco',
                color: 'red'
            });
        }
    };

    const startProgressPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        // Polling cada 2 segundos mientras esté ejecutándose
        intervalRef.current = window.setInterval(fetchProgress, 2000);
    };

    const stopProgressPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        fetchProgress();
        fetchJobs();

        // Cleanup al desmontar
        return () => {
            stopProgressPolling();
        };
    }, [fetchProgress, fetchJobs]);

    // Auto-detener polling cuando no esté ejecutándose
    useEffect(() => {
        if (progress && !progress.is_running) {
            stopProgressPolling();
        }
    }, [progress]);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString("es-CL", {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <Stack gap="lg">
            {/* Overlay de progreso */}
            {showOverlay && progress && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <LoadingOverlay progress={progress} />
                </div>
            )}

            {/* Panel de control */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                    <Group>
                        <ThemeIcon size={40} radius="md" variant="light" color="blue">
                            <Robot size={24} />
                        </ThemeIcon>
                        <div>
                            <Title order={3}>Scraper de Codelco</Title>
                            <Text size="sm" c="dimmed">
                                Panel de administración para scraping de empleos
                            </Text>
                        </div>
                    </Group>
                    <Group>
                        <Button
                            leftSection={<ArrowClockwise size={16} />}
                            variant="subtle"
                            onClick={() => {
                                fetchProgress();
                                fetchJobs();
                            }}
                        >
                            Actualizar
                        </Button>
                        <Button
                            leftSection={<Play size={16} />}
                            onClick={handleExecuteScraping}
                            disabled={progress?.is_running}
                            loading={progress?.is_running}
                        >
                            {progress?.is_running ? 'Ejecutando...' : 'Ejecutar Scraping'}
                        </Button>
                    </Group>
                </Group>

                {/* Estado actual */}
                {progress && (
                    <Box>
                        <Group gap="xs" mb="sm">
                            <Text size="sm" fw={500}>Estado:</Text>
                            <Badge 
                                color={getStatusColor(progress.status)}
                                leftSection={getStatusIcon(progress.status)}
                            >
                                {getStatusText(progress.status)}
                            </Badge>
                            {progress.current_step && (
                                <Text size="sm" c="dimmed">- {progress.current_step}</Text>
                            )}
                        </Group>

                        {progress.is_running && (
                            <Progress 
                                value={progress.progress_percentage} 
                                size="sm" 
                                radius="xl"
                                animated
                                mb="sm"
                            />
                        )}

                        {(progress.total_jobs_found > 0 || progress.is_completed) && (
                            <SimpleGrid cols={4} spacing="xs">
                                <div>
                                    <Text size="xs" c="dimmed">Encontrados</Text>
                                    <Text size="sm" fw={600}>{progress.total_jobs_found}</Text>
                                </div>
                                <div>
                                    <Text size="xs" c="dimmed">Procesados</Text>
                                    <Text size="sm" fw={600}>{progress.jobs_processed}</Text>
                                </div>
                                <div>
                                    <Text size="xs" c="dimmed">Guardados</Text>
                                    <Text size="sm" fw={600}>{progress.jobs_saved}</Text>
                                </div>
                                <div>
                                    <Text size="xs" c="dimmed">Duración</Text>
                                    <Text size="sm" fw={600}>
                                        {progress.duration_seconds ? 
                                            `${Math.floor(progress.duration_seconds)}s` : 
                                            '0s'
                                        }
                                    </Text>
                                </div>
                            </SimpleGrid>
                        )}
                    </Box>
                )}
            </Card>

            {/* Lista de empleos */}
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mb="lg">
                    <Title order={4}>Empleos de Codelco</Title>
                    <Badge color="blue" variant="light">
                        {jobs.length} empleos activos
                    </Badge>
                </Group>

                {isLoading ? (
                    <Center p="xl">
                        <Loader size="md" />
                    </Center>
                ) : jobs.length === 0 ? (
                    <Center p="xl">
                        <Stack align="center" gap="xs">
                            <Text size="lg" c="dimmed">No hay empleos disponibles</Text>
                            <Text size="sm" c="dimmed">
                                Ejecuta el scraping para obtener empleos de Codelco
                            </Text>
                        </Stack>
                    </Center>
                ) : (
                    <Stack gap="md">
                        {jobs.slice(0, 5).map((job) => (
                            <Card key={job.id} p="md" withBorder radius="sm">
                                <Group justify="space-between" align="flex-start">
                                    <div style={{ flex: 1 }}>
                                        <Text fw={600} lineClamp={2} mb={4}>
                                            {job.title}
                                        </Text>
                                        <Group gap="xs" mb="xs">
                                            <MapPin size={14} color="#868e96" />
                                            <Text size="sm" c="dimmed">
                                                {job.location} - {job.region}
                                            </Text>
                                        </Group>
                                        <Group gap="xs">
                                            <Calendar size={14} color="#868e96" />
                                            <Text size="xs" c="dimmed">
                                                Capturado: {formatDate(job.scraped_at)}
                                            </Text>
                                        </Group>
                                    </div>
                                    <Button
                                        size="xs"
                                        variant="subtle"
                                        leftSection={<ArrowSquareOut size={14} />}
                                        onClick={() => window.open(job.url, '_blank')}
                                    >
                                        Ver
                                    </Button>
                                </Group>
                            </Card>
                        ))}
                        
                        {jobs.length > 5 && (
                            <Text size="sm" c="dimmed" ta="center" mt="md">
                                ... y {jobs.length - 5} empleos más
                            </Text>
                        )}
                    </Stack>
                )}
            </Card>
        </Stack>
    );
};
