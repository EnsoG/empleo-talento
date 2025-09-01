import React, { useState, useEffect, useCallback } from 'react';
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


    Clock,
    ArrowClockwise,
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
    description: string;
    requirements: string;
}

interface ScrapingStatus {
    detail: string;
    status: string;
    active_jobs_count: number;
    last_scraping: string;
    system_health: string;
    scraper_info: {
        name: string;
        source: string;
        target_table: string;
    };
}

interface JobModalProps {
    job: CodelcoJob | null;
    opened: boolean;
    onClose: () => void;
}

const JobModal: React.FC<JobModalProps> = ({ job, opened, onClose }) => {
    // Función mejorada de formateo de fechas (tomada de CodelcoJobCard)
    const formatDate = (dateString: string) => {
        if (!dateString || dateString.trim() === '') {
            return 'Fecha no disponible';
        }
        
        try {
            // Si es una fecha en formato ISO
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
            
            // Si es una fecha en formato español (ej: "23 ago 2025")
            if (dateString.includes('ago') || dateString.includes('ene') || dateString.includes('feb')) {
                return dateString;
            }
            
            // Intentar parsear como fecha normal
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
            
            // Si no se puede parsear, devolver el string original
            return dateString;
        } catch {
            return dateString || 'Fecha no disponible';
        }
    };

    // Función mejorada de formateo de descripción (tomada de CodelcoJobCard)
    const formatDescription = (text: string, job?: CodelcoJob) => {
        // SIEMPRE intentar mostrar los requisitos primero
        let contentToSearch = '';
        
        // 1. Priorizar el campo requirements si existe
        if (job?.requirements && job.requirements.trim().length > 0) {
            contentToSearch = job.requirements;
        }
        // 2. Si no hay requirements, buscar en description
        else if (text && text.trim().length > 0) {
            contentToSearch = text;
        }
        
        if (contentToSearch) {
            // Buscar "Requisitos de Postulación:" específicamente
            const requisitosIndex = contentToSearch.indexOf('Requisitos de Postulación:');
            if (requisitosIndex !== -1) {
                // Extraer desde "Requisitos de Postulación:" hasta el final
                let requisitosSection = contentToSearch.substring(requisitosIndex);
                
                // Aplicar limpieza y formatear con saltos de línea
                requisitosSection = requisitosSection
                    .replace(/\\n/g, '\n')         // Convertir \n literal a salto de línea real
                    .replace(/\\\\n/g, '\n')       // También convertir \\n doble escape
                    .replace(/\\r/g, '')           // Eliminar \r literal
                    .replace(/\\t/g, '  ')         // Convertir \t literal a espacios
                    .replace(/\\a/g, '')           // Eliminar \a literal
                    .replace(/\\b/g, ' ')          // \b literal a espacio
                    .replace(/\\f/g, ' ')          // \f literal a espacio
                    .replace(/\\v/g, ' ')          // \v literal a espacio
                    .replace(/\r/g, '')            // Eliminar retornos de carro reales
                    .replace(/\t/g, '  ')          // Tabulaciones reales a espacios
                    .replace(/•\s*/g, ' • ')       // Asegurar espacios alrededor de viñetas
                    .replace(/\.([A-Z])/g, '. $1')
                    .replace(/([a-z])([A-Z])/g, '$1 $2')
                    .replace(/\s+/g, ' ')          // Normalizar espacios múltiples (pero mantener \n)
                    .replace(/ \n/g, '\n')         // Limpiar espacios antes de saltos de línea
                    .replace(/\n /g, '\n')         // Limpiar espacios después de saltos de línea
                    .trim();
                
                return requisitosSection;
            }
            
            // Si no encuentra "Requisitos de Postulación:", buscar otras variaciones
            const variations = [
                'Requisitos de Postulacion:',
                'Requisitos:',
                'Requirements:',
                'Requerimientos:'
            ];
            
            for (const variation of variations) {
                const index = contentToSearch.indexOf(variation);
                if (index !== -1) {
                    const extractedText = contentToSearch.substring(index);
                    return extractedText
                        .replace(/\\n/g, ' ')    // Reemplazar \n literal con espacios
                        .replace(/\\r/g, ' ')    // Reemplazar \r literal con espacios
                        .replace(/\\t/g, ' ')    // Reemplazar \t literal con espacios
                        .replace(/\n/g, ' ')     // Reemplazar saltos de línea reales
                        .replace(/\r/g, ' ')     // Reemplazar retornos de carro reales
                        .replace(/\t/g, ' ')     // Reemplazar tabulaciones reales
                        .replace(/•\s*/g, ' • ') // Asegurar espacios alrededor de viñetas
                        .replace(/\.([A-Z])/g, '. $1')
                        .replace(/([a-z])([A-Z])/g, '$1 $2')
                        .replace(/\s+/g, ' ')    // Normalizar espacios múltiples
                        .trim();
                }
            }
        }
        
        // Si no hay descripción útil, crear información basada en el título del trabajo
        if (job?.title) {
            const title = job.title.toLowerCase();
            const info = [];
            
            // Extraer información útil del título
            if (title.includes('ingeniero') || title.includes('ingeniera')) {
                info.push('• Perfil: Profesional en Ingeniería');
            }
            if (title.includes('operador') || title.includes('operadora')) {
                info.push('• Perfil: Operador/a de procesos industriales');
            }
            if (title.includes('supervisor') || title.includes('supervisora')) {
                info.push('• Perfil: Supervisión y liderazgo de equipos');
            }
            if (title.includes('especialista')) {
                info.push('• Perfil: Especialista técnico');
            }
            if (title.includes('jefe') || title.includes('jefa')) {
                info.push('• Perfil: Jefatura y gestión');
            }
            if (title.includes('analista')) {
                info.push('• Perfil: Análisis técnico y reportes');
            }
            if (title.includes('director') || title.includes('directora')) {
                info.push('• Perfil: Dirección ejecutiva');
            }
            
            // Agregar área específica si se detecta
            if (title.includes('mantención') || title.includes('mantenimiento')) {
                info.push('• Área: Mantención de equipos e instalaciones');
            }
            if (title.includes('fundición')) {
                info.push('• Área: Procesos de fundición');
            }
            if (title.includes('eléctrico') || title.includes('eléctrica')) {
                info.push('• Área: Sistemas eléctricos');
            }
            if (title.includes('subterránea') || title.includes('mina')) {
                info.push('• Área: Operaciones mineras');
            }
            if (title.includes('seguridad') || title.includes('prevención')) {
                info.push('• Área: Seguridad y prevención de riesgos');
            }
            if (title.includes('planificación')) {
                info.push('• Área: Planificación y gestión');
            }
            if (title.includes('hospital') || title.includes('enfermera')) {
                info.push('• Área: Servicios de salud');
            }
            
            // Información general de Codelco
            info.push('• Empresa: Corporación Nacional del Cobre (CODELCO)');
            info.push('• Sector: Minería del cobre');
            
            return info.join('\\n');
        }
        
        return 'Información detallada disponible en el sitio web de Codelco';
    };

    if (!job) return null;

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Title order={3}>Detalles del Empleo</Title>}
            size="lg"
            scrollAreaComponent={ScrollArea.Autosize}
        >
            <Stack gap="md">
                <div>
                    <Title order={4} c="blue" mb="xs">{job.title}</Title>
                    <Group gap="xs" mb="md">
                        <Badge color={job.is_active ? "blue" : "gray"}>
                            {job.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                        <Badge variant="outline" color="orange">
                            Codelco
                        </Badge>
                    </Group>
                </div>

                <Divider />

                {/* Información de ubicación mejorada */}
                <Group gap="md">
                    <Group gap="xs">
                        <MapPin size={16} color="#868e96" />
                        <Text size="sm">
                            {job.location}
                        </Text>
                    </Group>
                    <Group gap="xs">
                        <Buildings size={16} color="#868e96" />
                        <Text size="sm">Codelco</Text>
                    </Group>
                </Group>

                <div>
                    <Text fw={600} mb="xs">Descripción y Requisitos:</Text>
                    <Text size="sm" style={{ whiteSpace: 'pre-line' }}>
                        {formatDescription(job.description, job) || "Sin información disponible"}
                    </Text>
                </div>

                <Divider />

                <Group gap="md">
                    <Group gap="xs">
                        <Calendar size={16} color="#868e96" />
                        <div>
                            <Text size="xs" c="gray">Publicado</Text>
                            <Text size="sm">{formatDate(job.publication_date)}</Text>
                        </div>
                    </Group>
                    <div>
                        <Text size="xs" c="gray">Capturado</Text>
                        <Text size="sm">{formatDate(job.scraped_at)}</Text>
                    </div>
                    <div>
                        <Text size="xs" c="gray">ID Externo</Text>
                        <Text size="sm">{job.external_id}</Text>
                    </div>
                </Group>

                <Button
                    leftSection={<ArrowSquareOut size={16} />}
                    onClick={() => {
                        console.log('🔗 Modal: Abriendo URL:', job?.url);
                        console.log('🔗 Modal: Job completo:', job);
                        console.log('🔗 Modal: Tipo de URL:', typeof job?.url);
                        console.log('🔗 Modal: URL es válida?', job?.url && job.url.startsWith('http'));
                        if (job?.url && job.url.startsWith('http')) {
                            window.open(job.url, '_blank');
                        } else {
                            console.error('❌ Modal: URL inválida para abrir:', job?.url);
                        }
                    }}
                    fullWidth
                >
                    Ver en sitio de Codelco
                </Button>
            </Stack>
        </Modal>
    );
};

interface JobCardProps {
    job: CodelcoJob;
    onViewDetails: (job: CodelcoJob) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onViewDetails }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    // Función mejorada de formateo de fechas
    const formatDate = (dateString: string) => {
        if (!dateString || dateString.trim() === '') {
            return 'Fecha no disponible';
        }
        
        try {
            // Si es una fecha en formato ISO
            if (dateString.includes('T') || dateString.includes('-')) {
                const date = new Date(dateString);
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                }
            }
            
            // Si es una fecha en formato español (ej: "23 ago 2025")
            if (dateString.includes('ago') || dateString.includes('ene') || dateString.includes('feb')) {
                return dateString;
            }
            
            // Intentar parsear como fecha normal
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
            
            // Si no se puede parsear, devolver el string original
            return dateString;
        } catch {
            return dateString || 'Fecha no disponible';
        }
    };

    // Función mejorada de formateo de descripción
    const formatDescription = (text: string, job?: CodelcoJob) => {
        // SIEMPRE intentar mostrar los requisitos primero
        let contentToSearch = '';
        
        // 1. Priorizar el campo requirements si existe
        if (job?.requirements && job.requirements.trim().length > 0) {
            contentToSearch = job.requirements;
        }
        // 2. Si no hay requirements, buscar en description
        else if (text && text.trim().length > 0) {
            contentToSearch = text;
        }
        
        if (contentToSearch) {
            // Buscar "Requisitos de Postulación:" específicamente
            const requisitosIndex = contentToSearch.indexOf('Requisitos de Postulación:');
            if (requisitosIndex !== -1) {
                // Extraer desde "Requisitos de Postulación:" hasta el final
                let requisitosSection = contentToSearch.substring(requisitosIndex);
                
                // Para tarjetas, mostrar solo los primeros 150 caracteres de los requisitos
                if (requisitosSection.length > 150) {
                    requisitosSection = requisitosSection.substring(0, 150) + '...';
                }
                
                // Aplicar limpieza profunda y formatear
                requisitosSection = requisitosSection
                    .replace(/\\n/g, '')    // Eliminar \n literal completamente
                    .replace(/\n/g, ' ')           // \n como caracter real
                    .replace(/\\\\n/g, ' ')        // \\n escapado doble
                    .replace(/\\\n/g, ' ')         // \n con escape
                    .replace(/\\r/g, ' ')          // \r literal
                    .replace(/\r/g, ' ')           // \r real
                    .replace(/\\t/g, ' ')          // \t literal
                    .replace(/\t/g, ' ')           // \t real
                    .replace(/\\b/g, ' ')          // \b literal
                    .replace(/\\f/g, ' ')          // \f literal
                    .replace(/\\v/g, ' ')          // \v literal
                    .replace(/\s+/g, ' ')          // Normalizar espacios
                    .trim()
                    .replace(/•\s*/g, ' • ') // Asegurar espacios alrededor de viñetas
                    .replace(/\.([A-Z])/g, '. $1')
                    .replace(/([a-z])([A-Z])/g, '$1 $2');
                
                return requisitosSection;
            }
            
            // Si no encuentra "Requisitos de Postulación:", buscar otras variaciones
            const variations = [
                'Requisitos de Postulacion:',
                'Requisitos:',
                'Requirements:',
                'Requerimientos:'
            ];
            
            for (const variation of variations) {
                const index = contentToSearch.indexOf(variation);
                if (index !== -1) {
                    let extractedText = contentToSearch.substring(index);
                    if (extractedText.length > 150) {
                        extractedText = extractedText.substring(0, 150) + '...';
                    }
                    return extractedText
                        .replace(/\\n/g, ' ')    // Reemplazar \n literal con espacios
                        .replace(/\\r/g, ' ')    // Reemplazar \r literal con espacios
                        .replace(/\\t/g, ' ')    // Reemplazar \t literal con espacios
                        .replace(/\n/g, ' ')     // Reemplazar saltos de línea reales
                        .replace(/\r/g, ' ')     // Reemplazar retornos de carro reales
                        .replace(/\t/g, ' ')     // Reemplazar tabulaciones reales
                        .replace(/•\s*/g, ' • ') // Asegurar espacios alrededor de viñetas
                        .replace(/\.([A-Z])/g, '. $1')
                        .replace(/([a-z])([A-Z])/g, '$1 $2')
                        .replace(/\s+/g, ' ')    // Normalizar espacios múltiples
                        .trim();
                }
            }
        }
        
        // Si no hay descripción útil, crear información basada en el título del trabajo
        if (job?.title) {
            const title = job.title.toLowerCase();
            const info = [];
            
            // Extraer información útil del título (versión condensada para tarjetas)
            if (title.includes('ingeniero') || title.includes('ingeniera')) {
                info.push('Perfil: Profesional en Ingeniería');
            } else if (title.includes('operador') || title.includes('operadora')) {
                info.push('Perfil: Operador/a de procesos');
            } else if (title.includes('supervisor') || title.includes('supervisora')) {
                info.push('Perfil: Supervisión de equipos');
            } else if (title.includes('especialista')) {
                info.push('Perfil: Especialista técnico');
            } else if (title.includes('jefe') || title.includes('jefa')) {
                info.push('Perfil: Jefatura y gestión');
            } else if (title.includes('director') || title.includes('directora')) {
                info.push('Perfil: Dirección ejecutiva');
            } else {
                info.push('Posición en área operativa/técnica');
            }
            
            // Área específica (solo una para tarjetas)
            if (title.includes('mantención') || title.includes('mantenimiento')) {
                info.push('Área: Mantención');
            } else if (title.includes('fundición')) {
                info.push('Área: Fundición');
            } else if (title.includes('mina') || title.includes('subterránea')) {
                info.push('Área: Operaciones mineras');
            } else if (title.includes('seguridad') || title.includes('prevención')) {
                info.push('Área: Seguridad');
            } else if (title.includes('hospital') || title.includes('enfermera')) {
                info.push('Área: Servicios de salud');
            }
            
            return info.join(' • ');
        }
        
        return 'Información disponible en el sitio web de Codelco';
    };

    const handleOpenExternal = () => {
        console.log('🔗 JobCard: Abriendo URL:', job.url);
        console.log('🔗 JobCard: Job completo:', job);
        console.log('🔗 JobCard: Tipo de URL:', typeof job.url);
        console.log('🔗 JobCard: URL es válida?', job.url && job.url.startsWith('http'));
        if (job.url && job.url.startsWith('http')) {
            window.open(job.url, '_blank');
        } else {
            console.error('❌ URL inválida para abrir:', job.url);
        }
    };

    return (
        <Card
            className={`job-card ${job.is_active ? 'active' : 'inactive'}`}
            padding="lg"
            shadow="sm"
            withBorder
            style={{
                borderLeft: job.is_active ? '4px solid #228be6' : '4px solid #868e96',
                opacity: job.is_active ? 1 : 0.7,
                transition: 'all 0.2s ease'
            }}
        >
            <Flex justify="space-between" align="flex-start" mb="xs">
                <Box style={{ flex: 1 }}>
                    <Text
                        style={{ wordBreak: "break-word" }}
                        c="blue"
                        fw="bold"
                        lineClamp={2}
                        size="md"
                    >
                        {job.title}
                    </Text>
                </Box>
                <Group gap="xs" align="center">
                    <Badge
                        size="sm"
                        variant="light"
                        color={job.is_active ? "blue" : "gray"}
                    >
                        {job.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                    <Menu>
                        <Menu.Target>
                            <ActionIcon variant="subtle" color="gray">
                                <DotsThreeVertical size={16} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                leftSection={<Eye size={14} />}
                                onClick={() => onViewDetails(job)}
                            >
                                Ver detalles
                            </Menu.Item>
                            <Menu.Item
                                leftSection={<ArrowSquareOut size={14} />}
                                onClick={handleOpenExternal}
                            >
                                Abrir en Codelco
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Flex>

            {/* Ubicación simplificada */}
            <Group gap="xs" mb="xs">
                <MapPin size={14} color="#868e96" />
                <Text c="gray" size="sm">
                    {job.location}
                </Text>
            </Group>

            <Group gap="xs" mb="md">
                <Buildings size={14} color="#868e96" />
                <Text c="gray" size="sm" fw={500}>
                    Codelco
                </Text>
                <Badge size="xs" variant="outline" color="orange">
                    Externo
                </Badge>
            </Group>

            {/* Descripción mejorada con formateo */}
            <Text
                c="dark"
                size="sm"
                lineClamp={2}
                mb="md"
                style={{ minHeight: '2.4em' }}
            >
                {formatDescription(job.description, job) || "Sin descripción disponible"}
            </Text>

            <Flex
                gap="xs"
                direction={isMobile ? "column" : "row"}
                mb="xs"
            >
                <Button
                    size="xs"
                    rightSection={<ArrowRight size={14} />}
                    onClick={handleOpenExternal}
                    fullWidth={isMobile}
                >
                    Ver en Codelco
                </Button>
                <Button
                    size="xs"
                    variant="light"
                    rightSection={<Eye size={14} />}
                    onClick={() => onViewDetails(job)}
                    fullWidth={isMobile}
                >
                    Detalles
                </Button>
            </Flex>

            <Stack gap={4}>
                <Group gap="xs">
                    <Calendar size={12} color="#868e96" />
                    <Text c="gray" size="xs" fw="bold">
                        Publicado: {formatDate(job.publication_date)}
                    </Text>
                </Group>
                <Text c="gray" size="xs">
                    Capturado: {formatDate(job.scraped_at)}
                </Text>
                <Text c="gray" size="xs">
                    ID: {job.external_id}
                </Text>
            </Stack>
        </Card>
    );
};

export const AdminCodelcoPanelEnhanced: React.FC = () => {
    const [isExecuting, setIsExecuting] = useState(false);
    const [status, setStatus] = useState<ScrapingStatus | null>(null);
    const [jobs, setJobs] = useState<CodelcoJob[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedJob, setSelectedJob] = useState<CodelcoJob | null>(null);
    const [modalOpened, setModalOpened] = useState(false);

    const fetchStatus = useCallback(async () => {
        try {
            const response = await fetch('/v1/admin/codelco/scraping/status', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const statusData: ScrapingStatus = await response.json();
            setStatus(statusData);
            
        } catch (error) {
            console.error('Error obteniendo estado:', error);
            notifications.show({
                title: 'Error',
                message: 'Error al obtener el estado del scraping de Codelco',
                color: 'red'
            });
        }
    }, []);

    const fetchJobs = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/v1/admin/codelco/jobs?limit=20', {
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
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleExecuteScraping = async () => {
        setIsExecuting(true);
        
        try {
            const response = await fetch('/v1/scrapers/codelco/execute', {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const result = await response.json();
            
            // La búsqueda ya terminó cuando llega la respuesta
            setIsExecuting(false);
            
            // Actualizar la lista de empleos inmediatamente
            await fetchJobs();
            
            // Mostrar notificación con los resultados
            notifications.show({
                title: 'Búsqueda Completada',
                message: result.message,
                color: result.jobs_count > 0 ? 'green' : 'blue',
                icon: <Clock size={16} />
            });

        } catch (error) {
            console.error('Error ejecutando búsqueda:', error);
            setIsExecuting(false);
            notifications.show({
                title: 'Error',
                message: 'Error al ejecutar la búsqueda de Codelco',
                color: 'red'
            });
        }
    };

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

    const handleViewDetails = (job: CodelcoJob) => {
        setSelectedJob(job);
        setModalOpened(true);
    };

    useEffect(() => {
        fetchStatus();
        fetchJobs();
    }, [fetchStatus, fetchJobs]);

    return (
        <Stack gap="xl" style={{ position: 'relative' }}>
            {/* Panel de Control */}
            <Card shadow="sm" padding="lg" withBorder>
                <Group justify="space-between" mb="md">
                    <Group gap="xs">
                        <Robot size={24} color="#228be6" />
                        <Title order={3}>Control de Scraper Codelco</Title>
                    </Group>
                    <Group gap="xs">
                        <Button
                            leftSection={<ArrowClockwise size={16} />}
                            variant="light"
                            onClick={async () => {
                                console.log('🔄 Actualizando datos manualmente...');
                                try {
                                    await fetchStatus();
                                    await fetchJobs();
                                    notifications.show({
                                        title: 'Actualizado',
                                        message: 'Datos actualizados correctamente',
                                        color: 'blue'
                                    });
                                } catch (error) {
                                    console.error('Error actualizando:', error);
                                    notifications.show({
                                        title: 'Error',
                                        message: 'Error al actualizar datos',
                                        color: 'red'
                                    });
                                }
                            }}
                            disabled={isExecuting}
                        >
                            Actualizar
                        </Button>
                    </Group>
                </Group>

                {status && (
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="md">
                        <Card padding="md" bg="blue.0">
                            <Text size="lg" fw={700} c="blue">
                                {status.active_jobs_count}
                            </Text>
                            <Text size="sm" c="gray">
                                Empleos Activos
                            </Text>
                        </Card>
                        <Card padding="md" bg="green.0">
                            <Text size="lg" fw={700} c="green">
                                {status.status}
                            </Text>
                            <Text size="sm" c="gray">
                                Estado Sistema
                            </Text>
                        </Card>
                        <Card padding="md" bg="orange.0">
                            <Text size="lg" fw={700} c="orange">
                                {status.system_health}
                            </Text>
                            <Text size="sm" c="gray">
                                Salud Sistema
                            </Text>
                        </Card>
                        <Card padding="md" bg="gray.0">
                            <Text size="sm" fw={600} c="gray">
                                {status.last_scraping}
                            </Text>
                            <Text size="sm" c="gray">
                                Última Búsqueda
                            </Text>
                        </Card>
                    </SimpleGrid>
                )}

                <Group justify="center" gap="md">
                    <Button
                        leftSection={<Play size={16} />}
                        onClick={handleExecuteScraping}
                        loading={isExecuting}
                        disabled={isExecuting}
                    >
                        {isExecuting ? 'Buscando...' : 'Buscar Nuevos'}
                    </Button>
                    <Button
                        variant="light"
                        color="red"
                        onClick={handleDeactivateAllJobs}
                        disabled={isExecuting}
                    >
                        Desactivar Todos
                    </Button>
                </Group>
            </Card>

            {/* Lista de Empleos */}
            <div>
                <Group justify="space-between" mb="md">
                    <Title order={4}>Empleos Capturados ({jobs.length})</Title>
                    {isLoading && <Loader size="sm" />}
                </Group>

                {isLoading ? (
                    <Card padding="xl">
                        <Group justify="center">
                            <Loader size="lg" />
                            <Text>Cargando empleos...</Text>
                        </Group>
                    </Card>
                ) : jobs.length === 0 ? (
                    <Card padding="xl">
                        <Text ta="center" c="gray">
                            No hay empleos de Codelco disponibles
                        </Text>
                    </Card>
                ) : (
                    <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 3 }} spacing="md">
                        {jobs.map((job) => (
                            <JobCard
                                key={job.id}
                                job={job}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </SimpleGrid>
                )}
            </div>

            {/* Modal de detalles */}
            <JobModal
                job={selectedJob}
                opened={modalOpened}
                onClose={() => {
                    setModalOpened(false);
                    setSelectedJob(null);
                }}
            />
        </Stack>
    );
};

export default AdminCodelcoPanelEnhanced;
