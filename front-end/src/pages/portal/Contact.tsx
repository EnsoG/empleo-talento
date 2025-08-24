import {
    Box,
    Container,
    Grid,
    Group,
    Image,
    Title
} from "@mantine/core";
import {
    Phone,
    Envelope,
    MapPin
} from "@phosphor-icons/react";

import { PortalLayout } from "../../layouts/PortalLayout";
import { PortalBanner } from "../../components/portal/PortalBanner";
import { IconCard } from "../../components/portal/IconCard";
import { ContactForm } from "../../components/portal/ContactForm";
import { ContactInfo } from "../../components/portal/ContactInfo";
import portalDivider2 from "../../assets/svg/portal-divider-2.svg";

export const Contact = () => {
    return (
        <PortalLayout>
            <PortalBanner title="Contacto" />
            <Box
                className="portal-section"
                component="section">
                <Container size="xl">
                    <Title
                        order={2}
                        fz={{ base: "xl", sm: "h2" }}
                        c="blue"
                        ta="center"
                        fw="bold"
                        mb="xl">
                        Ponte En Contacto Con Nosotros
                    </Title>
                    <Group
                        justify="space-evenly"
                        mb={64}>
                        <IconCard
                            name="Por Llamada"
                            icon={Phone} />
                        <IconCard
                            name="Por Correo"
                            icon={Envelope} />
                        <IconCard
                            name="Presencialmente"
                            icon={MapPin} />
                    </Group>
                    <Title
                        order={2}
                        fz={{ base: "xl", sm: "h2" }}
                        c="blue"
                        ta="center"
                        fw="bold"
                        mb="xl">
                        Tambien Puedes Hablarnos Directamente
                    </Title>
                    <Grid gutter="xl">
                        <Grid.Col span={{ base: 12, lg: 6 }}>
                            <ContactForm />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, lg: 6 }}>
                            <ContactInfo />
                        </Grid.Col>
                    </Grid>
                </Container>
                <Image
                    className="portal-divider"
                    src={portalDivider2} />
            </Box>
        </PortalLayout >
    )
}