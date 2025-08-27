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
    onClose?: () => void;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ progress, onClose }) => {
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
                        <Text size="sm" c="dimmed" mb="xs" ta="center">
                            {progress.current_step || 'Preparando...'}
                        </Text>
                    </Box>
                )}

                {progress.has_error && (
                    <Alert color="red" title="Error en el scraping" style={{ width: '100%' }}>
                        {progress.error_message}
                    </Alert>
                )}

                {progress.is_completed && (
                    <Alert color="green" title="¡Scraping completado!" style={{ width: '100%' }}>
                        El scraping se ha completado exitosamente.
                        {progress.json_file && (
                            <><br />Archivo generado: {progress.json_file}</>
                        )}
                    </Alert>
                )}

                {/* Botones de acción */}
                <Group justify="center" w="100%">
                    {(progress.is_completed || progress.has_error) && onClose && (
                        <Button onClick={onClose} variant="light" color="gray">
                            Cerrar
                        </Button>
                    )}
                </Group>
            </Stack>
        </Card>
    );
};

export const AdminCodelcoPanelWithProgress: React.FC = () => {
    const [progress, setProgress] = useState<ScrapingProgress | null>(null);
    const [jobs, setJobs] = useState<CodelcoJob[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const overlayTimeoutRef = useRef<number | null>(null);

    const clearOverlayTimeout = useCallback(() => {
        if (overlayTimeoutRef.current) {
            clearTimeout(overlayTimeoutRef.current);
            overlayTimeoutRef.current = null;
        }
    }, []);

    const fetchJobs = useCallback(async () => {
        try {
            setIsLoading(true);
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

    const stopProgressPolling = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            console.log('🔄 Polling detenido');
        }
    }, []);

    const closeOverlay = useCallback(() => {
        console.log('❌ Cerrando overlay manualmente');
        setShowOverlay(false);
        clearOverlayTimeout();
        stopProgressPolling();
        fetchJobs(); // Refrescar empleos al cerrar
    }, [clearOverlayTimeout, stopProgressPolling, fetchJobs]);

    // Función para verificar si el scraping está realmente terminado
    const checkIfScrapingCompleted = useCallback((progressData: ScrapingProgress) => {
        return progressData.status === 'completed' || 
               progressData.is_completed || 
               (!progressData.is_running && progressData.jobs_saved > 0);
    }, []);

    const fetchProgress = useCallback(async () => {
        try {
            const response = await fetch(endpoints.adminCodelcoProgress, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                const progressData = data.progress;
                
                console.log('📊 Progreso recibido:', {
                    status: progressData.status,
                    is_running: progressData.is_running,
                    is_completed: progressData.is_completed,
                    has_error: progressData.has_error,
                    jobs_saved: progressData.jobs_saved
                });
                
                setProgress(progressData);
                
                // Verificar si el scraping está realmente completado
                const isCompleted = checkIfScrapingCompleted(progressData);
                
                // Lógica mejorada para el overlay
                if (progressData.is_running) {
                    // Si está corriendo, mostrar overlay
                    console.log('🏃 Scraping corriendo - mostrando overlay');
                    setShowOverlay(true);
                    clearOverlayTimeout();
                } else if (isCompleted) {
                    // Si está completado, cerrar overlay
                    console.log('✅ Scraping completado - cerrando overlay en 3 segundos');
                    stopProgressPolling();
                    
                    clearOverlayTimeout();
                    overlayTimeoutRef.current = window.setTimeout(() => {
                        console.log('⏰ Tiempo cumplido - cerrando overlay');
                        setShowOverlay(false);
                        fetchJobs();
                    }, 3000);
                } else if (progressData.has_error) {
                    // Si tiene error, cerrar overlay
                    console.log('❌ Error en scraping - cerrando overlay en 5 segundos');
                    stopProgressPolling();
                    
                    clearOverlayTimeout();
                    overlayTimeoutRef.current = window.setTimeout(() => {
                        console.log('⏰ Cerrando overlay por error');
                        setShowOverlay(false);
                        fetchJobs();
                    }, 5000);
                } else if (progressData.status === 'idle' && showOverlay) {
                    // Si está idle y ya tenemos un overlay, cerrarlo
                    console.log('💤 Estado idle - cerrando overlay');
                    stopProgressPolling();
                    setShowOverlay(false);
                    fetchJobs();
                }
            }
        } catch (error) {
            console.error('Error obteniendo progreso:', error);
        }
    }, [stopProgressPolling, clearOverlayTimeout, fetchJobs, checkIfScrapingCompleted, showOverlay]);

    const startProgressPolling = useCallback(() => {
        stopProgressPolling();
        console.log('🔄 Iniciando polling cada 1 segundo');
        
        fetchProgress();
        intervalRef.current = window.setInterval(() => {
            fetchProgress();
        }, 1000); // Cada 1 segundo para ser más agresivo
    }, [fetchProgress, stopProgressPolling]);

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
            } else {
                throw new Error(`HTTP ${response.status}`);
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

    const handleRefresh = useCallback(() => {
        console.log('🔄 Refrescando datos...');
        fetchProgress();
        fetchJobs();
    }, [fetchProgress, fetchJobs]);

    useEffect(() => {
        console.log('🚀 Componente montado');
        fetchProgress();
        fetchJobs();

        return () => {
            console.log('🧹 Cleanup del componente');
            stopProgressPolling();
            clearOverlayTimeout();
        };
    }, [fetchProgress, fetchJobs, stopProgressPolling, clearOverlayTimeout]);

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
                    <LoadingOverlay progress={progress} onClose={closeOverlay} />
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
                        {showOverlay && (
                            <Button
                                leftSection={<X size={16} />}
                                variant="outline"
                                color="red"
                                size="xs"
                                onClick={closeOverlay}
                            >
                                Cerrar Overlay
                            </Button>
                        )}
                        <Button
                            leftSection={<ArrowClockwise size={16} />}
                            variant="subtle"
                            onClick={handleRefresh}
                            disabled={progress?.is_running}
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
