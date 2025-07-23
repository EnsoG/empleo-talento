import {
    Box,
    Card,
    Center,
    Container,
    Grid,
    Image,
    List,
    Table,
    Text,
    Title
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import {
    CheckCircle,
    Check
} from "@phosphor-icons/react";

import { PortalLayout } from "../../layouts/PortalLayout";
import { PortalBanner } from "../../components/portal/PortalBanner";
import { PricingPlan, PricingPlanProps } from "../../components/portal/PricingPlan";
import portalDivider2 from "../../assets/svg/portal-divider-2.svg"

const candidatePlans: PricingPlanProps[] = [
    {
        name: "Free",
        description: "Descripcion Ejemplo",
        price: 1000,
        discount: 0.5,
        features: [
            "Caracteristica 1",
            "Caracteristica 2",
            "Caracteristica 3",
        ]
    },
    {
        name: "Premium",
        description: "Descripcion Ejemplo",
        price: 2000,
        discount: 0.5,
        features: [
            "Caracteristica 1",
            "Caracteristica 2",
            "Caracteristica 3",
        ]
    }
];

const companyPlans: PricingPlanProps[] = [
    {
        name: "Avisos Ofertas Laborales",
        description: "Descripcion Ejemplo",
        price: 1000,
        discount: 0.5,
        features: [
            "Caracteristica 1",
            "Caracteristica 2",
            "Caracteristica 3",
        ]
    },
    {
        name: "Reclutamiento",
        description: "Descripcion Ejemplo",
        price: 2000,
        discount: 0.5,
        features: [
            "Caracteristica 1",
            "Caracteristica 2",
            "Caracteristica 3",
        ]
    },
    {
        name: "Seleccion",
        description: "Descripcion Ejemplo",
        price: 3000,
        discount: 0.5,
        features: [
            "Caracteristica 1",
            "Caracteristica 2",
            "Caracteristica 3",
        ]
    },
    {
        name: "Acreditacion",
        description: "Descripcion Ejemplo",
        price: 4000,
        discount: 0.5,
        features: [
            "Caracteristica 1",
            "Caracteristica 2",
            "Caracteristica 3",
        ]
    },
    {
        name: "Marketing",
        description: "Descripcion Ejemplo",
        price: 5000,
        discount: 0.5,
        features: [
            "Caracteristica 1",
            "Caracteristica 2",
            "Caracteristica 3",
        ]
    },
    {
        name: "Empleabilidad",
        description: "Descripcion Ejemplo",
        price: 6000,
        discount: 0.5,
        features: [
            "Caracteristica 1",
            "Caracteristica 2",
            "Caracteristica 3",
        ]
    }
];

const elements = [
    { example: true, example1: true, example2: true, feature: 'Caracteristica 1' },
    { example: true, example1: true, example2: true, feature: 'Caracteristica 2' },
    { example: false, example1: true, example2: true, feature: 'Caracteristica 3' },
    { example: false, example1: false, example2: true, feature: 'Caracteristica 4' },
    { example: false, example1: false, example2: true, feature: 'Caracteristica 5' },
];

const rows = elements.map((element) => (
    <Table.Tr key={element.feature}>
        <Table.Td>{element.feature}</Table.Td>
        <Table.Td ta="center">{element.example ? <Check fill="var(--mantine-green-6)" /> : "-"}</Table.Td>
        <Table.Td ta="center">{element.example1 ? <Check fill="var(--mantine-green-6)" /> : "-"}</Table.Td>
    </Table.Tr>
));

export const Services = () => {
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
                        mb="xl"
                        ta="center">
                        Estos son los planes que disponemos en <Text c="blue" component="span" fz={{ base: "lg", sm: "xl" }} fw="bold">Empleo Talento</Text> <br />para cada uno de nuestros clientes
                    </Text>
                    <Grid mb="xl">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Text
                                fz={{ base: "lg", sm: "xl" }}
                                c="blue"
                                fw="bold"
                                ta="center"
                                tt="uppercase"
                                mb="md">
                                Candidatos
                            </Text>
                            <Carousel withControls>
                                {
                                    candidatePlans.map((p, i) => (
                                        <Carousel.Slide key={i}>
                                            <Center>
                                                <PricingPlan
                                                    {...p} />
                                            </Center>
                                        </Carousel.Slide>
                                    ))
                                }
                            </Carousel>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Text
                                fz={{ base: "lg", sm: "xl" }}
                                c="blue"
                                fw="bold"
                                ta="center"
                                tt="uppercase"
                                mb="md">
                                Empresas
                            </Text>
                            <Carousel withControls>
                                {
                                    companyPlans.map((p, i) => (
                                        <Carousel.Slide key={i}>
                                            <Center>
                                                <PricingPlan
                                                    {...p} />
                                            </Center>
                                        </Carousel.Slide>
                                    ))
                                }
                            </Carousel>
                        </Grid.Col>
                    </Grid>
                    <Card
                        id="pricing-free-features"
                        bg="blue"
                        c="white"
                        radius="md"
                        shadow="sm"
                        padding="xl"
                        mx={{ base: 0, sm: "xl" }}
                        mb="xl">
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
                    <Title
                        order={2}
                        fz={{ base: "xl", sm: "h2" }}
                        c="blue"
                        ta="center"
                        fw="bold"
                        mb="sm">
                        Compara Nuestros Planes
                    </Title>
                    <Text
                        fw="bold"
                        fz={{ base: "lg", sm: "xl" }}
                        ta="center"
                        mb="xl">
                        Te presentamos una tabla comparativa con las diferencias <br />entre los planes de <Box c="blue" component="span" fz={{ base: "lg", sm: "xl" }}>candidatos</Box>
                    </Text>
                    <Table.ScrollContainer minWidth={500} type="scrollarea">
                        <Table
                            id="pricing-table"
                            horizontalSpacing="lg"
                            verticalSpacing="lg"
                            bg="white"
                            withRowBorders
                            withColumnBorders
                            withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Caracteristicas</Table.Th>
                                    <Table.Th>Free</Table.Th>
                                    <Table.Th>Premium</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {rows}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Container>
                <Image
                    className="portal-divider"
                    src={portalDivider2} />
            </Box>
        </PortalLayout >
    )
}