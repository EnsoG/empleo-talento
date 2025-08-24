import {
    Card,
    Text,
    Button,
    Group,
    Badge,
    Stack,
    ActionIcon,
    Tooltip,
    Box
} from "@mantine/core";
import { ArrowSquareOut, MapPin, Calendar, Buildings } from "@phosphor-icons/react";
import { CodelcoJob } from "../../types";

interface CodelcoJobCardProps {
    job: CodelcoJob;
}

export const CodelcoJobCard = ({ job }: CodelcoJobCardProps) => {
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

    const formatDescription = (text: string) => {
        if (!text) return '';
        
        // Agregar espacios después de puntos si no los hay
        return text
            .replace(/\.([A-Z])/g, '. $1')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const handleViewDetails = () => {
        window.open(job.external_url, '_blank');
    };

    return (
        <Card 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            withBorder
            style={{ height: '100%' }}
        >
            <Stack gap="sm" style={{ height: '100%' }}>
                {/* Header */}
                <Group justify="space-between" align="flex-start">
                    <Box style={{ flex: 1 }}>
                        <Text size="lg" fw={600} lineClamp={2}>
                            {job.title}
                        </Text>
                        <Badge 
                            color="blue" 
                            variant="light" 
                            size="sm"
                            leftSection={<Buildings size={14} />}
                        >
                            CODELCO
                        </Badge>
                    </Box>
                    <Tooltip label="Ver en sitio oficial">
                        <ActionIcon
                            variant="light"
                            color="blue"
                            onClick={handleViewDetails}
                        >
                            <ArrowSquareOut size={18} />
                        </ActionIcon>
                    </Tooltip>
                </Group>

                {/* Location and Date */}
                <Stack gap="xs">
                    <Group gap="xs">
                        <MapPin size={16} color="gray" />
                        <Text size="sm" c="dimmed">
                            {job.region}
                        </Text>
                        {job.postal_code && (
                            <Text size="sm" c="dimmed">
                                • {job.postal_code}
                            </Text>
                        )}
                    </Group>
                    
                    <Group gap="xs">
                        <Calendar size={16} color="gray" />
                        <Text size="sm" c="dimmed">
                            Fecha límite: {formatDate(job.publication_date)}
                        </Text>
                    </Group>
                </Stack>

                {/* Description */}
                {job.description && (
                    <Text size="sm" lineClamp={3} style={{ flex: 1 }}>
                        {formatDescription(job.description)}
                    </Text>
                )}

                {/* Footer */}
                <Group justify="space-between" mt="auto">
                    <Text size="xs" c="dimmed">
                        ID: {job.external_id}
                    </Text>
                    <Button
                        variant="light"
                        size="sm"
                        onClick={handleViewDetails}
                        rightSection={<ArrowSquareOut size={16} />}
                    >
                        Ver detalles
                    </Button>
                </Group>
            </Stack>
        </Card>
    );
};
