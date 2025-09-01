import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    Text,
    Group,
    Stack,
    Badge,
    Loader,
    SimpleGrid,
    Title,
    Divider,
    Modal,
    Flex,
    Box,
    ActionIcon,
    Menu,
    Button,
} from '@mantine/core';
import {
    Eye,
    ArrowSquareOut,
    MapPin,
    Buildings,
    Calendar,
    DotsThreeVertical,
} from '@phosphor-icons/react';
import { useCodelcoJobs } from "../../hooks/useCodelcoJobs";
import { CodelcoJob } from "../../types";

interface JobModalProps {
    job: CodelcoJob | null;
    opened: boolean;
    onClose: () => void;
}

const JobModal: React.FC<JobModalProps> = ({ job, opened, onClose }) => {
    const formatDate = (dateString: string) => {
        if (!dateString || dateString.trim() === '') {
            return 'Fecha no disponible';
        }
        
        try {
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
            
            if (dateString.includes('ago') || dateString.includes('ene') || dateString.includes('feb')) {
                return dateString;
            }
            
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }
            
            return dateString;
        } catch {
            return dateString || 'Fecha no disponible';
        }
    };

    const cleanEscapeCharacters = (text: string): string => {
        return text
            .replace(/\\n/g, ' ')
            .replace(/\n/g, ' ')
            .replace(/\\\\n/g, ' ')
            .replace(/\\\n/g, ' ')
            .replace(/\\r/g, ' ')
            .replace(/\r/g, ' ')
            .replace(/\\t/g, ' ')
            .replace(/\t/g, ' ')
            .replace(/\\f/g, ' ')
            .replace(/\f/g, ' ')
            .replace(/\\v/g, ' ')
            .replace(/\v/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const formatDescription = (text: string, job?: CodelcoJob) => {
        let contentToSearch = '';
        
        if (job?.requirements && job.requirements.trim().length > 0) {
            contentToSearch = job.requirements;
        } else if (text && text.trim().length > 0) {
            contentToSearch = text;
        } else {
            return 'Información detallada disponible en el sitio web de Codelco';
        }

        const cleanedText = cleanEscapeCharacters(contentToSearch);
        
        if (cleanedText.length < 10) {
            return 'Información detallada disponible en el sitio web de Codelco';
        }

        return cleanedText;
    };

    if (!job) return null;

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Title order={3}>Detalles del Empleo</Title>}
            size="lg"
            centered
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
                        {formatDescription(job.description || '', job) || "Sin información disponible"}
                    </Text>
                </div>

                <Divider />

                <Group gap="md">
                    <Group gap="xs">
                        <Calendar size={16} color="#868e96" />
                        <div>
                            <Text size="xs" c="gray">Publicado</Text>
                            <Text size="sm">{formatDate(job.publication_date || job.created_at)}</Text>
                        </div>
                    </Group>
                    <div>
                        <Text size="xs" c="gray">Capturado</Text>
                        <Text size="sm">{formatDate(job.created_at)}</Text>
                    </div>
                    <div>
                        <Text size="xs" c="gray">ID Externo</Text>
                        <Text size="sm">{job.external_id}</Text>
                    </div>
                </Group>

                <Button
                    leftSection={<ArrowSquareOut size={16} />}
                    onClick={() => {
                        const url = job?.url || job?.external_url;
                        console.log('🔗 Modal: URL a usar:', url);
                        console.log('🔗 Modal: job.url:', job?.url);
                        console.log('🔗 Modal: job.external_url:', job?.external_url);
                        console.log('🔗 Modal: Job completo:', job);
                        if (url && url.startsWith('http')) {
                            window.open(url, '_blank');
                        } else {
                            console.error('❌ Modal: URL inválida para abrir:', url);
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
    //const isMobile = useMediaQuery("(max-width: 768px)");

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

    // Función mejorada de formateo de descripción para cards
    const getJobSummary = (job: CodelcoJob) => {
        // SIEMPRE intentar mostrar los requisitos primero
        let contentToSearch = '';
        
        // 1. Priorizar el campo requirements si existe
        if (job?.requirements && job.requirements.trim().length > 0) {
            contentToSearch = job.requirements;
        }
        // 2. Si no hay requirements, buscar en description
        else if (job?.description && job.description.trim().length > 0) {
            contentToSearch = job.description;
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
                    .replace(/\\n/g, ' ')          // Eliminar \n literal completamente
                    .replace(/\n/g, ' ')           // \n como caracter real
                    .replace(/\\\\n/g, ' ')        // \\n escapado doble
                    .replace(/\\\n/g, ' ')         // \n con escape
                    .replace(/\\r/g, ' ')          // \r literal
                    .replace(/\r/g, ' ')           // \r real
                    .replace(/\\t/g, ' ')          // \t literal
                    .replace(/\t/g, ' ')           // \t real
                    .replace(/\\f/g, ' ')          // \f literal
                    .replace(/\\v/g, ' ')          // \v literal
                    .replace(/\s+/g, ' ')          // Normalizar espacios
                    .trim()
                    .replace(/•\s*/g, ' • ')       // Asegurar espacios alrededor de viñetas
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
            } else if (title.includes('analista')) {
                info.push('Perfil: Análisis técnico');
            } else {
                info.push('Posición en área operativa/técnica');
            }
            
            // Agregar área específica si se detecta
            if (title.includes('mantención') || title.includes('mantenimiento')) {
                info.push('Área: Mantención');
            } else if (title.includes('fundición')) {
                info.push('Área: Fundición');
            } else if (title.includes('eléctrico') || title.includes('eléctrica')) {
                info.push('Área: Sistemas eléctricos');
            } else if (title.includes('mina') || title.includes('subterránea')) {
                info.push('Área: Operaciones mineras');
            } else if (title.includes('seguridad') || title.includes('prevención')) {
                info.push('Área: Seguridad');
            } else if (title.includes('planificación')) {
                info.push('Área: Planificación');
            } else if (title.includes('hospital') || title.includes('enfermera')) {
                info.push('Área: Servicios de salud');
            }
            
            return info.join(' • ');
        }
        
        return 'Información detallada disponible en el sitio web de Codelco';
    };

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder
            style={{
                borderLeft: job.is_active ? '4px solid #228be6' : '4px solid #868e96',
                opacity: job.is_active ? 1 : 0.7,
                transition: 'all 0.2s ease'
            }}
        >
            <Stack gap="sm">
                <Flex justify="space-between" align="flex-start">
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
                            {job.is_active ? "ACTIVO" : "INACTIVO"}
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
                                    onClick={() => {
                                        const url = job.url || job.external_url;
                                        console.log('🔗 Card Menu: URL a usar:', url);
                                        console.log('🔗 Card Menu: job.url:', job.url);
                                        console.log('🔗 Card Menu: job.external_url:', job.external_url);
                                        if (url && url.startsWith('http')) {
                                            window.open(url, '_blank');
                                        } else {
                                            console.error('❌ Card Menu: URL inválida:', url);
                                        }
                                    }}
                                >
                                    Ver en Codelco
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Flex>

                <Group gap="xs" mb="sm">
                    <MapPin size={14} />
                    <Text size="sm" c="dimmed" lineClamp={1}>
                        {job.location}
                    </Text>
                </Group>

                <Group gap="xs" mb="sm">
                    <Buildings size={14} />
                    <Text size="sm" c="dimmed">
                        Codelco <Badge size="xs" variant="outline">EXTERNO</Badge>
                    </Text>
                </Group>

                <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
                    {getJobSummary(job)}
                </Text>

                <Group justify="space-between" align="center" mb="md">
                    <Button
                        leftSection={<ArrowSquareOut size={16} />}
                        onClick={() => {
                            const url = job.url || job.external_url;
                            console.log('🔗 Card Button: URL a usar:', url);
                            console.log('🔗 Card Button: job.url:', job.url);
                            console.log('🔗 Card Button: job.external_url:', job.external_url);
                            if (url && url.startsWith('http')) {
                                window.open(url, '_blank');
                            } else {
                                console.error('❌ Card Button: URL inválida:', url);
                            }
                        }}
                        size="sm"
                    >
                        Ver en Codelco
                    </Button>
                    <Button
                        leftSection={<Eye size={16} />}
                        onClick={() => onViewDetails(job)}
                        size="sm"
                        variant="light"
                    >
                        Detalles
                    </Button>
                </Group>

                <Group justify="space-between" align="center">
                    <Group gap="xs">
                        <Calendar size={14} />
                        <div>
                            <Text size="xs" c="gray">Publicado: {formatDate(job.publication_date || job.created_at)}</Text>
                            <Text size="xs" c="gray">Capturado: {formatDate(job.created_at)}</Text>
                        </div>
                    </Group>
                    <Text size="xs" c="gray">ID: {job.external_id || job.id}</Text>
                </Group>
            </Stack>
        </Card>
    );
};

export const CodelcoJobsSection: React.FC = () => {
    const { codelcoJobs, isLoading, getCodelcoJobs } = useCodelcoJobs();
    const [selectedJob, setSelectedJob] = useState<CodelcoJob | null>(null);
    const [modalOpened, setModalOpened] = useState(false);

    useEffect(() => {
        getCodelcoJobs();
    }, [getCodelcoJobs]);

    const handleViewDetails = useCallback((job: CodelcoJob) => {
        setSelectedJob(job);
        setModalOpened(true);
    }, []);

    const jobs = codelcoJobs?.jobs || [];

    return (
        <Stack gap="lg" mt="xl">
            <div>
                <Group justify="space-between" mb="md">
                    <div>
                        <Title order={3}>Empleos Codelco ({jobs.length})</Title>
                        <Text size="sm" c="dimmed">
                            Ofertas laborales disponibles en Codelco
                        </Text>
                    </div>
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
                        <Text ta="center" c="gray" size="sm" mt="xs">
                            Los empleos aparecerán aquí cuando el administrador ejecute el scraping
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
