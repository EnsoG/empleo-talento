import { Box, Group, List, Stack, Text } from "@mantine/core";
import {
    Envelope,
    WhatsappLogo,
    Clock
} from "@phosphor-icons/react";

export const ContactInfo = () => {
    return (
        <Stack>
            <Text
                fz={{ base: "lg", sm: "xl" }}
                fw="bold">
                No dudes en contactarnos para poder poder resolver cada una de tus dudas, puedes escribirnos o llamarnos !
            </Text>
            <Box>
                <Group
                    align="center"
                    gap="sm"
                    mb="xs">
                    <Envelope fill="var(--mantine-blue-6)" />
                    <Text size="md">Correos Electronicos</Text>
                </Group>
                <List
                    size="md"
                    spacing="xs"
                    pl="md"
                    center>
                    <List.Item>contacto@empleotalento.cl</List.Item>
                    <List.Item>candidatos@empleotalento.cl</List.Item>
                    <List.Item>empresas@empleotalento.cl</List.Item>
                </List>
            </Box>
            <Box>
                <Group
                    align="center"
                    gap="sm"
                    mb="xs">
                    <WhatsappLogo fill="var(--mantine-blue-6)" />
                    <Text size="md">Call Center</Text>
                </Group>
                <List
                    size="md"
                    spacing="xs"
                    pl="md"
                    center>
                    <List.Item>+569 XXXXXXXX</List.Item>
                </List>
            </Box>
            <Box>
                <Group
                    align="center"
                    gap="sm"
                    mb="xs">
                    <Clock fill="var(--mantine-blue-6)" />
                    <Text size="md">Horarios Atencion (Lunes a Viernes)</Text>
                </Group>
                <List
                    size="md"
                    spacing="xs"
                    pl="md"
                    center>
                    <List.Item>8:00 - 13:00</List.Item>
                    <List.Item>14:00 - 18:00</List.Item>
                </List>
            </Box>
        </Stack>
    )
}
