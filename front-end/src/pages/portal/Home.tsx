import { Link } from "react-router";
import { useMediaQuery } from "@mantine/hooks";
import {
    Box,
    Button,
    Container,
    Grid,
    Text,
    Title,
    Image,
    Center
} from "@mantine/core";
import { ArrowRight } from "@phosphor-icons/react";

import { AppPaths } from "../../types";
import { PortalLayout } from "../../layouts/PortalLayout";
import { FadeLeft } from "../../components/motion/enter/FadeLeft";
import { LatestOffers } from "../../components/portal/home/LatestOffers";
import { ContactInfo } from "../../components/portal/ContactInfo";
import { ContactForm } from "../../components/portal/ContactForm";
import { JobSearch } from "../../components/portal/home/JobSearch";
import portalHeroBannerImg from "../../assets/svg/portal-banner-img.svg";
import portalDivider from "../../assets/svg/portal-divider.svg";
import portalDivider2 from "../../assets/svg/portal-divider-2.svg";


export const Home = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <PortalLayout>
            {/* Hero Banner Section */}
            <Box
                id="home-banner"
                className="portal-section"
                component="section"
                mb="xl">
                <Container size="xl">
                    <Grid
                        gutter="xl"
                        pt={250}>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Title
                                order={1}
                                fz={{ base: "h2", sm: "h1" }}
                                ta={isMobile ? "center" : "start"}
                                c="dark"
                                mb="xl">
                                Busca Tu Trabajo <br /> Hazlo Con <span style={{ color: "#228be6" }}>Empleo Talento</span>
                            </Title>
                            <JobSearch />
                        </Grid.Col>
                        <Grid.Col
                            span={6}
                            visibleFrom="lg">
                            <Image
                                id="home-banner-img"
                                h="85%"
                                w="100%"
                                fit="contain"
                                src={portalHeroBannerImg} />
                        </Grid.Col>
                    </Grid>
                </Container>
                <Image
                    className="portal-divider"
                    src={portalDivider} />
            </Box>
            {/* Featured Jobs Section */}
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
                        mb="xs">
                        Empleos Destacados
                    </Title>
                    <Text
                        fz={{ base: "lg", sm: "xl" }}
                        fw="bold"
                        ta="center"
                        mb="xl">
                        Estas son algunos de los empleos destacados registrados <br /> en <Text c="var(--mantine-blue-6)" fz={{ base: "lg", sm: "xl" }} fw="bold" component="span">Empleo Talento</Text>
                    </Text>
                    <LatestOffers featured={true} />
                    <Center mt="md">
                        <Link to={AppPaths.jobBoard}>
                            <Button
                                size="md"
                                rightSection={<ArrowRight />}>
                                Descubir Mas
                            </Button>
                        </Link>
                    </Center>
                </Container>
                <Image
                    className="portal-divider"
                    src={portalDivider2} />
            </Box>
            {/* Last Jobs Section */}
            <Box
                id="home-last-jobs"
                className="portal-section"
                component="section"
                mb={64}>
                <Container size="xl">
                    <Title
                        order={2}
                        fz={{ base: "xl", sm: "h2" }}
                        c="white"
                        ta="center"
                        fw="bold"
                        mb="sm">
                        Ultimos Empleos
                    </Title>
                    <Text
                        fz={{ base: "lg", sm: "xl" }}
                        fw="bold"
                        ta="center"
                        mb="xl">
                        Estos son algunos de los ultimos empleos registrados en nuestro portal, <br />
                        no dudes en <Text c="var(--mantine-blue-6)" fz={{ base: "lg", sm: "xl" }} fw="bold" component="span">explorar mas</Text>
                    </Text>
                    <LatestOffers featured={false} />
                    <Center mt="md">
                        <Link to={AppPaths.jobBoard}>
                            <Button
                                size="md"
                                rightSection={<ArrowRight />}>
                                Descubir Mas
                            </Button>
                        </Link>
                    </Center>
                </Container>
                <Image
                    className="portal-divider"
                    src={portalDivider} />
            </Box>
            {/* Contact Section */}
            <Box
                id="home-contact"
                className="portal-section"
                component="section">
                <Container size="xl">
                    <Grid gutter="xl">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <FadeLeft>
                                <ContactForm />
                            </FadeLeft>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Title
                                order={2}
                                fz={{ base: "xl", sm: "h2" }}
                                c="blue"
                                fw="bold">
                                ¿Tienes Alguna Pregunta?
                            </Title>
                            <ContactInfo />
                        </Grid.Col>
                    </Grid>
                </Container>
                <Image
                    className="portal-divider"
                    src={portalDivider2} />
            </Box>
        </PortalLayout>
    )
}