import { useMediaQuery } from "@mantine/hooks";
import { Carousel } from "@mantine/carousel";
import {
    Box,
    Container,
    Image,
    List,
    SimpleGrid,
    Skeleton,
    Stack,
    Text,
    Title
} from "@mantine/core";
import {
    ArrowCircleUp,
    Handshake,
    MagnifyingGlass,
    UsersThree
} from "@phosphor-icons/react";

import { PortalLayout } from "../../layouts/PortalLayout";
import { PortalBanner } from "../../components/portal/PortalBanner";
import { FadeRight } from "../../components/motion/enter/FadeRight";
import { FadeLeft } from "../../components/motion/enter/FadeLeft";
import testImgSlider from "../../assets/img/test-slider.jpg";
import portalDivider2 from "../../assets/svg/portal-divider-2.svg";


export const AboutUs = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <PortalLayout>
            <PortalBanner title="Nosotros" />
            <Box
                id="about-us"
                className="portal-section"
                component="section">
                <Container size="xl">
                    <Title
                        order={2}
                        fz={{ base: "xl", sm: "h2" }}
                        c="blue"
                        ta="center"
                        fw="bold"
                        mb="sm">
                        Somos Empleo Talento
                    </Title>
                    <Text
                        fz={{ base: "lg", sm: "xl" }}
                        fw="bold"
                        ta="center"
                        mb="xl">
                        Te presentamos informacion relevante sobre <br /><Box c="var(--mantine-blue-6)" component="span">nosotros</Box> para que nos conozcas mejor
                    </Text>
                    <SimpleGrid
                        cols={{ base: 1, md: 2 }}
                        spacing="lg"
                        mb="xl">
                        <FadeLeft>
                            <Skeleton w="100%" h={500} radius="md" />
                        </FadeLeft>
                        <Stack>
                            <Title
                                order={2}
                                fz={{ base: "xl", sm: "h2" }}
                                c="blue"
                                fw="bold">
                                Nuestra mision
                            </Title>
                            <Text fz={{ base: "md", sm: "lg" }}>
                                Ser un Portal de Empleos enfocado en ofrecer ofertas laborales a candiatos y publicacion
                                de avisos a las empresas que necesiten contratar a profesionales logrando potenciar la fuerza laboral
                            </Text>
                            <Title
                                order={2}
                                fz={{ base: "xl", sm: "h2" }}
                                c="blue"
                                fw="bold">
                                Nuestra vision
                            </Title>
                            <Text fz={{ base: "md", sm: "lg" }}>
                                Ser el principal Portal de Empleos de Chile que entregue soluciones a candidatos
                                como a empresas que desean publicar sus avisos, potenciando ofertas laborales
                            </Text>
                        </Stack>
                    </SimpleGrid>
                    <Carousel
                        align="start"
                        height={isMobile ? "100%" : 500}
                        mb="xl"
                        withIndicators>
                        <Carousel.Slide >
                            <Image
                                src={testImgSlider}
                                fit="contain" />
                        </Carousel.Slide>
                        <Carousel.Slide>
                            <Image
                                src={testImgSlider}
                                fit="contain" />
                        </Carousel.Slide>
                        <Carousel.Slide>
                            <Image
                                src={testImgSlider}
                                fit="contain" />
                        </Carousel.Slide>
                    </Carousel>
                    <SimpleGrid
                        cols={{ base: 1, md: 2 }}
                        spacing="lg"
                        mb="xl">
                        <Stack>
                            <Title
                                order={2}
                                fz={{ base: "xl", sm: "h2" }}
                                c="blue"
                                fw="bold">
                                Nuestra valores
                            </Title>
                            <Text fz={{ base: "md", sm: "lg" }}>
                                Buscamos consolidarnos como una organización referente en nuestro sector, guiada por principios que inspiran cada una de nuestras acciones y decisiones.
                                Estos valores representan el compromiso que asumimos con nuestros clientes, colaboradores y la sociedad:
                            </Text>
                            <List
                                size="md"
                                spacing="sm"
                                center>
                                <List.Item icon={<MagnifyingGlass fill="var(--mantine-blue-6)" />}>
                                    Excelencia en la gestion de busqueda de empleo, selección y acreditacion
                                </List.Item>
                                <List.Item icon={<Handshake fill="var(--mantine-blue-6)" />}>
                                    Orientacion y servicio al cliente: Candidatos y Empresas
                                </List.Item>
                                <List.Item icon={<UsersThree fill="var(--mantine-blue-6)" />}>
                                    Compromiso social con la comunidad y con los proveedores
                                </List.Item>
                                <List.Item icon={<ArrowCircleUp fill="var(--mantine-blue-6)" />}>
                                    Mejora continua en los procesos de Selección y Acreditación
                                </List.Item>
                            </List>
                        </Stack>
                        <FadeRight>
                            <Skeleton w="100%" h={500} radius="md" />
                        </FadeRight>
                    </SimpleGrid>
                </Container>
                <Image
                    className="portal-divider"
                    src={portalDivider2} />
            </Box>
        </PortalLayout>
    )
}
