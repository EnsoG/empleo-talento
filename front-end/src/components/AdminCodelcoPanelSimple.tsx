import React, { useState, useEffect, useRef } from 'react';
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
    Divider,
    Modal,
    ScrollArea,
    Flex,
    Box,
    ActionIcon,
    Menu,
    Progress,
    Overlay,
    Center,
    RingProgress,
} from '@mantine/core';
import {
    Robot,
    Play,
    Eye,
    ArrowSquareOut,
    MapPin,
    Buildings,
    Calendar,
    DotsThreeVertical,
    ArrowRight,
    CheckCircle,
    XCircle,
    Clock,
} from '@phosphor-icons/react';
import { useMediaQuery } from "@mantine/hooks";

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
    description?: string;
    requirements?: string;
}

interface ScrapingStatus {
    total_jobs: number;
    active_jobs: number;
    last_scraping: string | null;
    status: string;
    is_running: boolean;
}

interface ProgressInfo {
    status: string;
    progress_percentage: number;
    current_step: string;
    total_jobs_found: number;
    jobs_processed: number;
    jobs_saved: number;
    is_running: boolean;
    is_completed: boolean;
    has_error: boolean;
    error_message?: string;
}

const AdminCodelcoPanelSimple: React.FC = () => {
    const [jobs, setJobs] = useState<CodelcoJob[]>([]);
    const [status, setStatus] = useState<ScrapingStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [isExecuting, setIsExecuting] = useState(false);
    const [selectedJob, setSelectedJob] = useState<CodelcoJob | null>(null);
    const [modalOpened, setModalOpened] = useState(false);
    const [showProgressOverlay, setShowProgressOverlay] = useState(false);
    const [progressInfo, setProgressInfo] = useState<ProgressInfo | null>(null);
    
    // Referencias para manejo de intervalos
    const progressIntervalRef = useRef<number | null>(null);
    const forceCloseTimeoutRef = useRef<number | null>(null);

    const isMobile = useMediaQuery("(max-width: 768px)");

    // Función para formatear fechas (simplificada)
    const formatDate = (dateString: string) => {
        try {
            if (!dateString) return 'Fecha no disponible';
            
            if (dateString.includes('T') || dateString.includes('-')) {
                const date = new Date(dateString);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }
            }
            
            return dateString;
        } catch {
            return dateString || 'Fecha no disponible';
        }
    };

    // Función para formatear descripción
    const formatDescription = (text: string) => {
        if (!text) return '';
        return text.replace(/\.([A-Z])/g, '. $1').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\s+/g, ' ').trim();
    };

    // Función para obtener el estado
    const fetchStatus = async () => {
        try {
            const response = await fetch('/v1/admin/codelco/scraping/status', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            setStatus(data.status);
        } catch (error) {
            console.error('Error obteniendo estado:', error);
            notifications.show({
                title: 'Error',
                message: 'Error al obtener el estado del scraping',
                color: 'red'
            });
        }
    };

    // Función para obtener empleos
    const fetchJobs = async () => {
        try {
            const response = await fetch('/v1/admin/codelco/jobs?limit=50', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            setJobs(data.jobs || []);
        } catch (error) {
            console.error('Error obteniendo empleos:', error);
            notifications.show({
                title: 'Error',
                message: 'Error al obtener empleos de Codelco',
                color: 'red'
            });
        }
    };

    // Función para obtener progreso
    const fetchProgress = async () => {
        try {
            console.log('🔄 Solicitando progreso...');
            const response = await fetch('/v1/admin/codelco/scraping/progress', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                console.log('❌ Error en response:', response.status);
                return;
            }

            const data = await response.json();
            console.log('📊 Datos recibidos:', data);
            
            const progressData: ProgressInfo = data.progress || data;
            setProgressInfo(progressData);

            // Si está completado o tiene error, cerrar overlay
            if (progressData.is_completed || progressData.has_error) {
                console.log('✅ Scraping terminado, cerrando overlay');
                
                // Limpiar interval
                if (progressIntervalRef.current) {
                    clearInterval(progressIntervalRef.current);
                    progressIntervalRef.current = null;
                }
                
                // Limpiar timeout de fuerza
                if (forceCloseTimeoutRef.current) {
                    clearTimeout(forceCloseTimeoutRef.current);
                    forceCloseTimeoutRef.current = null;
                }
                
                setIsExecuting(false);
                setShowProgressOverlay(false);
                
                // Mostrar notificación
                if (progressData.is_completed && !progressData.has_error) {
                    notifications.show({
                        title: 'Scraping Completado',
                        message: `Se procesaron ${progressData.jobs_processed} empleos exitosamente`,
                        color: 'green',
                        icon: <CheckCircle size={16} />
                    });
                } else if (progressData.has_error) {
                    notifications.show({
                        title: 'Scraping Falló',
                        message: progressData.error_message || 'Error durante el scraping',
                        color: 'red',
                        icon: <XCircle size={16} />
                    });
                }
                
                // Actualizar datos
                setTimeout(() => {
                    fetchStatus();
                    fetchJobs();
                }, 1000);
            }
            
        } catch (error) {
            console.error('❌ Error obteniendo progreso:', error);
        }
    };

    // Función para ejecutar scraping
    const handleExecuteScraping = async () => {
        setIsExecuting(true);
        setShowProgressOverlay(true);
        setProgressInfo(null);
        
        try {
            const response = await fetch('/v1/admin/codelco/scraping/execute', {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            notifications.show({
                title: 'Scraping Iniciado',
                message: 'Scraping de Codelco iniciado exitosamente!',
                color: 'blue',
                icon: <Clock size={16} />
            });

            // Iniciar polling del progreso
            progressIntervalRef.current = setInterval(fetchProgress, 2000);
            
            // Timeout de fuerza para cerrar en 2 minutos máximo
            forceCloseTimeoutRef.current = setTimeout(() => {
                console.log('⏰ Forzando cierre por timeout');
                
                if (progressIntervalRef.current) {
                    clearInterval(progressIntervalRef.current);
                    progressIntervalRef.current = null;
                }
                
                setIsExecuting(false);
                setShowProgressOverlay(false);
                
                notifications.show({
                    title: 'Timeout',
                    message: 'Se forzó el cierre del overlay por timeout',
                    color: 'orange'
                });
            }, 120000); // 2 minutos

            // Llamada inicial
            setTimeout(fetchProgress, 1000);

        } catch (error) {
            console.error('Error ejecutando scraping:', error);
            notifications.show({
                title: 'Error',
                message: 'Error al ejecutar el scraping de Codelco',
                color: 'red'
            });
            setIsExecuting(false);
            setShowProgressOverlay(false);
        }
    };

    // Función para cancelar scraping
    const handleCancelScraping = () => {
        console.log('🛑 Cancelando scraping');
        
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        
        if (forceCloseTimeoutRef.current) {
            clearTimeout(forceCloseTimeoutRef.current);
            forceCloseTimeoutRef.current = null;
        }
        
        setIsExecuting(false);
        setShowProgressOverlay(false);
        setProgressInfo(null);
        
        notifications.show({
            title: 'Scraping Cancelado',
            message: 'El scraping fue cancelado por el usuario',
            color: 'orange'
        });
    };

    // Función para desactivar empleos
    const handleDeactivateAllJobs = async () => {
        try {
            const response = await fetch('/v1/admin/codelco/jobs', {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const result = await response.json();
            notifications.show({
                title: 'Empleos Desactivados',
                message: `Se desactivaron ${result.deactivated_count} empleos de Codelco`,
                color: 'blue'
            });
            
            fetchStatus();
            fetchJobs();

        } catch (error) {
            console.error('Error desactivando empleos:', error);
            notifications.show({
                title: 'Error',
                message: 'Error al desactivar empleos de Codelco',
                color: 'red'
            });
        }
    };

    // Función para ver detalles
    const handleViewDetails = (job: CodelcoJob) => {
        setSelectedJob(job);
        setModalOpened(true);
    };

    // Cleanup al desmontar
    useEffect(() => {
        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
            if (forceCloseTimeoutRef.current) {
                clearTimeout(forceCloseTimeoutRef.current);
            }
        };
    }, []);

    // Cargar datos iniciales
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchStatus(), fetchJobs()]);
            setLoading(false);
        };
        loadData();
    }, []);

    // Calcular porcentaje de progreso
    const calculateProgress = () => {
        if (!progressInfo) return 0;
        return Math.round(Math.max(0, Math.min(100, progressInfo.progress_percentage || 0)));
    };

    if (loading) {
        return (
            <Center style={{ height: 400 }}>
                <Stack align="center" gap="md">
                    <Loader size="xl" />
                    <Text>Cargando panel de administración...</Text>
                </Stack>
            </Center>
        );
    }

    return (
        <Stack gap="xl" style={{ position: 'relative' }}>
            {/* Overlay de progreso */}
            {showProgressOverlay && (
                <Overlay
                    opacity={0.8}
                    color="#000"
                    zIndex={1000}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }}
                >
                    <Center style={{ height: '100vh' }}>
                        <Card shadow="xl" padding="xl" radius="md" style={{ minWidth: 400, maxWidth: 500 }}>
                            <Stack align="center" gap="lg">
                                <Group gap="md">
                                    <Robot size={32} color="#228be6" />
                                    <Title order={3}>Scraping en Progreso</Title>
                                </Group>

                                {progressInfo ? (
                                    <>
                                        <RingProgress
                                            size={120}
                                            thickness={8}
                                            sections={[{ value: calculateProgress(), color: 'blue' }]}
                                            label={
                                                <Center>
                                                    <Text size="lg" fw={700}>
                                                        {calculateProgress()}%
                                                    </Text>
                                                </Center>
                                            }
                                        />

                                        <Stack gap="xs" align="center">
                                            <Badge size="lg" variant="light" color="blue">
                                                {progressInfo.status}
                                            </Badge>
                                            <Text size="sm" ta="center" c="gray">
                                                {progressInfo.current_step}
                                            </Text>
                                            
                                            <SimpleGrid cols={2} spacing="md" mt="md">
                                                <div>
                                                    <Text size="xs" c="gray">Empleos procesados</Text>
                                                    <Text size="lg" fw={600}>
                                                        {progressInfo.jobs_processed}/{progressInfo.total_jobs_found}
                                                    </Text>
                                                </div>
                                                <div>
                                                    <Text size="xs" c="gray">Empleos guardados</Text>
                                                    <Text size="lg" fw={600}>
                                                        {progressInfo.jobs_saved}
                                                    </Text>
                                                </div>
                                            </SimpleGrid>
                                        </Stack>

                                        <Progress
                                            value={calculateProgress()}
                                            size="lg"
                                            radius="xl"
                                            style={{ width: '100%' }}
                                            animated
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Loader size="xl" />
                                        <Text>Iniciando scraping...</Text>
                                    </>
                                )}
                                
                                <Button
                                    variant="filled"
                                    color="red"
                                    onClick={handleCancelScraping}
                                    size="sm"
                                >
                                    Cancelar
                                </Button>
                            </Stack>
                        </Card>
                    </Center>
                </Overlay>
            )}

            {/* Header */}
            <Card shadow="sm" padding="lg" radius="md">
                <Group justify="space-between" mb="md">
                    <Group gap="md">
                        <Robot size={32} color="#228be6" />
                        <div>
                            <Title order={2}>Gestión de Empleos Codelco</Title>
                            <Text size="sm" c="dimmed">Panel de administración para empleos externos</Text>
                        </div>
                    </Group>
                </Group>

                {status && (
                    <SimpleGrid cols={isMobile ? 2 : 4} spacing="md" mb="lg">
                        <div>
                            <Text size="xs" c="gray">Total Empleos</Text>
                            <Text size="xl" fw={700}>{status.total_jobs}</Text>
                        </div>
                        <div>
                            <Text size="xs" c="gray">Empleos Activos</Text>
                            <Text size="xl" fw={700} c="green">{status.active_jobs}</Text>
                        </div>
                        <div>
                            <Text size="xs" c="gray">Estado</Text>
                            <Badge color={status.is_running ? "blue" : "gray"} variant="light">
                                {status.is_running ? "Ejecutándose" : "Inactivo"}
                            </Badge>
                        </div>
                        <div>
                            <Text size="xs" c="gray">Último Scraping</Text>
                            <Text size="sm">{status.last_scraping ? formatDate(status.last_scraping) : 'Nunca'}</Text>
                        </div>
                    </SimpleGrid>
                )}

                <Group gap="md">
                    <Button
                        leftSection={<Play size={16} />}
                        onClick={handleExecuteScraping}
                        loading={isExecuting}
                        disabled={isExecuting}
                    >
                        Ejecutar Scraping
                    </Button>
                    <Button
                        variant="outline"
                        color="red"
                        onClick={handleDeactivateAllJobs}
                        disabled={isExecuting}
                    >
                        Desactivar Todos
                    </Button>
                </Group>
            </Card>

            {/* Lista de empleos */}
            <Card shadow="sm" padding="lg" radius="md">
                <Group justify="space-between" mb="md">
                    <Title order={3}>Empleos Recientes ({jobs.length})</Title>
                </Group>

                {jobs.length === 0 ? (
                    <Center style={{ height: 200 }}>
                        <Stack align="center" gap="md">
                            <Buildings size={48} color="gray" />
                            <Text c="dimmed">No hay empleos disponibles</Text>
                        </Stack>
                    </Center>
                ) : (
                    <Stack gap="md">
                        {jobs.slice(0, 10).map((job) => (
                            <Card key={job.id} padding="md" radius="sm" withBorder>
                                <Group justify="space-between">
                                    <div style={{ flex: 1 }}>
                                        <Text fw={600} size="sm" lineClamp={2}>
                                            {job.title}
                                        </Text>
                                        <Group gap="xs" mt="xs">
                                            <MapPin size={14} color="gray" />
                                            <Text size="xs" c="dimmed">{job.location}</Text>
                                        </Group>
                                        <Group gap="xs" mt="xs">
                                            <Calendar size={14} color="gray" />
                                            <Text size="xs" c="dimmed">
                                                Publicado: {formatDate(job.publication_date)}
                                            </Text>
                                        </Group>
                                    </div>
                                    <Group gap="xs">
                                        <Badge color={job.is_active ? "green" : "red"} variant="light" size="sm">
                                            {job.is_active ? "Activo" : "Inactivo"}
                                        </Badge>
                                        <ActionIcon
                                            variant="light"
                                            size="sm"
                                            onClick={() => handleViewDetails(job)}
                                        >
                                            <Eye size={16} />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="light"
                                            size="sm"
                                            component="a"
                                            href={job.url}
                                            target="_blank"
                                        >
                                            <ArrowSquareOut size={16} />
                                        </ActionIcon>
                                    </Group>
                                </Group>
                            </Card>
                        ))}
                    </Stack>
                )}
            </Card>

            {/* Modal de detalles */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Detalles del Empleo"
                size="lg"
            >
                {selectedJob && (
                    <Stack gap="md">
                        <div>
                            <Text fw={600} size="lg">{selectedJob.title}</Text>
                            <Group gap="xs" mt="xs">
                                <MapPin size={16} color="gray" />
                                <Text size="sm" c="dimmed">{selectedJob.location}, {selectedJob.region}</Text>
                            </Group>
                        </div>

                        <Divider />

                        <SimpleGrid cols={2} spacing="md">
                            <div>
                                <Text size="sm" fw={500}>ID Externo</Text>
                                <Text size="sm" c="dimmed">{selectedJob.external_id}</Text>
                            </div>
                            <div>
                                <Text size="sm" fw={500}>Estado</Text>
                                <Badge color={selectedJob.is_active ? "green" : "red"} variant="light">
                                    {selectedJob.is_active ? "Activo" : "Inactivo"}
                                </Badge>
                            </div>
                            <div>
                                <Text size="sm" fw={500}>Fecha de Publicación</Text>
                                <Text size="sm" c="dimmed">{formatDate(selectedJob.publication_date)}</Text>
                            </div>
                            <div>
                                <Text size="sm" fw={500}>Fecha de Scraping</Text>
                                <Text size="sm" c="dimmed">{formatDate(selectedJob.scraped_at)}</Text>
                            </div>
                        </SimpleGrid>

                        {selectedJob.description && (
                            <>
                                <Divider />
                                <div>
                                    <Text size="sm" fw={500} mb="xs">Descripción</Text>
                                    <ScrollArea style={{ maxHeight: 200 }}>
                                        <Text size="sm" style={{ lineHeight: 1.6 }}>
                                            {formatDescription(selectedJob.description)}
                                        </Text>
                                    </ScrollArea>
                                </div>
                            </>
                        )}

                        <Group justify="flex-end">
                            <Button
                                variant="outline"
                                leftSection={<ArrowSquareOut size={16} />}
                                component="a"
                                href={selectedJob.url}
                                target="_blank"
                            >
                                Ver en Codelco
                            </Button>
                        </Group>
                    </Stack>
                )}
            </Modal>
        </Stack>
    );
};

export default AdminCodelcoPanelSimple;
