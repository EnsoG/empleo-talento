import { Link } from "react-router";
import {
    Container,
    Grid,
    Text,
    Group,
    ActionIcon,
    Stack,
    Divider
} from "@mantine/core";
import {
    FacebookLogo,
    InstagramLogo,
    LinkedinLogo,
    YoutubeLogo
} from "@phosphor-icons/react";

import { AppPaths } from "../../types";

export const Footer = () => {
    return (
        <footer id="portal-footer">
            <Container size="xl">
                <Grid gutter="xl">
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Text
                            fz={{ base: "md", md: "xl" }}
                            tt="uppercase"
                            fw="bold"
                            mb="md">
                            Empleo Talento
                        </Text>
                        <Text
                            fz={{ base: "md", md: "lg" }}
                            ta="justify"
                            mb="md">
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Maxime inventore nemo
                            accusamus ipsum adipisci! Odit rerum, numquam officiis suscipit iste doloremque
                            quis accusamus ducimus quia animi amet doloribus in dolorem.
                        </Text>
                        <Group
                            gap="xl"
                            justify="start"
                            align="center">
                            <ActionIcon
                                size="xl"
                                radius="xl">
                                <FacebookLogo
                                    width="70%"
                                    height="70%" />
                            </ActionIcon>
                            <ActionIcon
                                size="xl"
                                radius="xl">
                                <InstagramLogo
                                    width="70%"
                                    height="70%" />
                            </ActionIcon>
                            <ActionIcon
                                size="xl"
                                radius="xl">
                                <LinkedinLogo
                                    width="70%"
                                    height="70%" />
                            </ActionIcon>
                            <ActionIcon
                                size="xl"
                                radius="xl">
                                <YoutubeLogo
                                    width="70%"
                                    height="70%" />
                            </ActionIcon>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <Grid>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <Stack
                                    gap="lg"
                                    justify="flex-start"
                                    align="stretch">
                                    <Text
                                        fz={{ base: "md", md: "xl" }}
                                        tt="uppercase"
                                        fw="bold">
                                        Enlaces Relevantes
                                    </Text>
                                    <Text fz={{ base: "md", md: "lg" }}>
                                        <Link
                                            className="react-link-primary"
                                            to={AppPaths.termsPolicies}>
                                            Terminos y Condiciones
                                        </Link>
                                    </Text>
                                    <Text fz={{ base: "md", md: "lg" }}>
                                        <Link
                                            className="react-link-primary"
                                            to={AppPaths.termsPolicies}>
                                            Politicas de Privacidad
                                        </Link>
                                    </Text>
                                    <Text fz={{ base: "md", md: "lg" }}>
                                        <Link
                                            className="react-link-primary"
                                            to={AppPaths.services}>
                                            Servicios
                                        </Link>
                                    </Text>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <Stack
                                    gap="lg"
                                    justify="flex-start"
                                    align="stretch">
                                    <Text
                                        fz={{ base: "md", md: "xl" }}
                                        tt="uppercase"
                                        fw="bold">
                                        Accesos Directos
                                    </Text>
                                    <Text fz={{ base: "md", md: "lg" }}>
                                        <Link
                                            className="react-link-primary"
                                            to="">
                                            Acceso Administrativo
                                        </Link>
                                    </Text>
                                    <Text fz={{ base: "md", md: "lg" }}>
                                        <Link
                                            className="react-link-primary"
                                            to="">
                                            Acceso Corporativo
                                        </Link>
                                    </Text>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </Grid.Col>

                </Grid>
                <Divider my="md" color="white" />
                <Text
                    ta="center"
                    fz={{ base: "md", sm: "lg" }}>
                    Derechos Reservados ©2025 Empleo Talento
                </Text>
            </Container>
        </footer>
    )
}