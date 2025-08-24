import {
    Box,
    Card,
    Center,
    Container,
    Grid,
    Image,
    List,
    Text
} from "@mantine/core";
import { CheckCircle } from "@phosphor-icons/react";

import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types";
import { PortalLayout } from "../../layouts/PortalLayout";
import { PortalBanner } from "../../components/portal/PortalBanner";
import { CandidateView } from "../../components/portal/services/CandidateView";
import { CompanyView } from "../../components/portal/services/CompanyView";
import portalDivider2 from "../../assets/svg/portal-divider-2.svg"

export const Services = () => {
    const { user } = useAuth();

    return (
        <PortalLayout>
            <PortalBanner title="Servicios" />
            <Box
                className="portal-section"
                component="section">
                <Container size="xl">
                    <Text
                        fz={{ base: "lg", sm: "xl" }}
                        fw="bold"
                        mb="md"
                        ta="center">
                        Estos son los planes que disponemos en <Text c="blue" component="span" fz={{ base: "lg", sm: "xl" }} fw="bold">Empleo Talento</Text> <br />para cada uno de nuestros clientes
                    </Text>
                    {(user?.user_role == UserRole.candidate)
                        ? <CandidateView />
                        : <CompanyView />
                    }
                    <Card
                        id="pricing-free-features"
                        bg="blue"
                        c="white"
                        radius="md"
                        shadow="sm"
                        padding="xl"
                        mx={{ base: 0, sm: "xl" }}>
                        <Grid
                            gutter="lg"
                            grow>
                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Center h="100%">
                                    <Text
                                        fz={{ base: "lg", sm: "h3" }}
                                        ta="center"
                                        fw="bold">
                                        Adicionalmente disfruta de todo esto 100% gratis en tu plan
                                    </Text>
                                </Center>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 4 }}>
                                <List
                                    spacing="lg"
                                    size="lg"
                                    icon={<CheckCircle />}
                                    center>
                                    <List.Item>Caracteritica 1</List.Item>
                                    <List.Item>Caracteritica 2</List.Item>
                                    <List.Item>Caracteritica 3</List.Item>
                                </List>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 4 }}>
                                <List
                                    spacing="lg"
                                    size="lg"
                                    icon={<CheckCircle />}
                                    center>
                                    <List.Item>Caracteritica 1</List.Item>
                                    <List.Item>Caracteritica 2</List.Item>
                                    <List.Item>Caracteritica 3</List.Item>
                                </List>
                            </Grid.Col>
                        </Grid>
                    </Card>
                </Container>
                <Image
                    className="portal-divider"
                    src={portalDivider2} />
            </Box>
        </PortalLayout >
    )
}