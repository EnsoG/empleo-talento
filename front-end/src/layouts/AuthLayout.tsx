import { PropsWithChildren } from "react";
import {
    Grid,
    Center,
    Card,
    Title,
    Image,
    Box,
    Container
} from "@mantine/core";

import authImg from "../assets/svg/auth-img.svg";
import authBg from "../assets/svg/auth-bg.svg";
import authBg2 from "../assets/svg/auth-bg-2.svg";
import authDivider from "../assets/svg/auth-divider.svg";

interface AuthLayoutProps extends PropsWithChildren {
    title: string;
}

export const AuthLayout = ({ children, title }: AuthLayoutProps) => {
    return (
        <Box
            id="auth-layout"
            h="100%">
            <Container
                fluid
                h="100%"
                p={0}>
                <Grid
                    gutter={0}
                    h="100%">
                    <Grid.Col span={{ base: 12, md: 6 }} >
                        <Center
                            p={{ base: "sm", sm: 0 }}
                            h="100%">
                            <Card
                                padding="lg"
                                shadow="sm"
                                radius="md"
                                withBorder>
                                <Title
                                    order={1}
                                    fz={{ base: "lg", md: "xl" }}
                                    ta="center"
                                    tt="uppercase"
                                    mb="md">
                                    {title}
                                </Title>
                                {children}
                            </Card>
                        </Center>
                        <Image
                            id="auth-divider"
                            src={authDivider}
                            fit="contain" />
                    </Grid.Col>
                    <Grid.Col
                        span={6}
                        visibleFrom="md">
                        <Center h="100%">
                            <Image
                                id="auth-img"
                                src={authImg}
                                fit="contain" />
                            <Image
                                src={authBg}
                                className="auth-background"
                                fit="contain" />
                            <Image
                                src={authBg2}
                                className="auth-background"
                                fit="contain" />
                        </Center>
                    </Grid.Col>
                </Grid>
            </Container>
        </Box>
    )
}