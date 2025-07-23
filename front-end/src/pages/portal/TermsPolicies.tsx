import { useDisclosure } from "@mantine/hooks";
import {
    ActionIcon,
    Box,
    Card,
    Collapse,
    Container,
    Divider,
    Group,
    Image,
    List,
    Text,
    Title
} from "@mantine/core";

import { PortalLayout } from "../../layouts/PortalLayout";
import { PortalBanner } from "../../components/portal/PortalBanner";
import portalDivider2 from "../../assets/svg/portal-divider-2.svg";
import { Minus, Plus } from "@phosphor-icons/react";

export const TermsPolicies = () => {
    const [openedTerms, { toggle: toggleTerms }] = useDisclosure(false);
    const [openedPolicies, { toggle: togglePolicies }] = useDisclosure(false);
    console.log(openedTerms)
    return (
        <PortalLayout>
            <PortalBanner title="Terminos y Politicas" />
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
                        mb="sm">
                        Informacion Importante
                    </Title>
                    <Text
                        fz={{ base: "lg", sm: "xl" }}
                        fw="bold"
                        ta="center"
                        mb="xl">
                        En Empleo Talento disponemos de distintos <Box c="var(--mantine-blue-6)" component="span">terminos</Box> y <Box c="var(--mantine-blue-6)" component="span">politicas</Box> <br />para cada uno de nuestros servicios, a continuacion se presenta dicha informacion
                    </Text>
                    <Card
                        padding="lg"
                        shadow="sm"
                        mb="xl"
                        withBorder>
                        <Group justify="space-between">
                            <Text
                                size="lg"
                                fw="bold">
                                Terminos y Condiciones
                            </Text>
                            <ActionIcon
                                size="lg"
                                variant="transparent"
                                onClick={toggleTerms}>
                                {openedTerms
                                    ? <Minus fill="var(--mantine-blue-6)" width="70%" height="70%" />
                                    : <Plus fill="var(--mantine-blue-6)" width="70%" height="70%" />
                                }
                            </ActionIcon>
                        </Group>
                        <Collapse in={openedTerms}>
                            <Divider my="sm" />
                            <List
                                size="md"
                                type="ordered"
                                spacing="sm"
                                center>
                                <List.Item>Termino 1</List.Item>
                                <List.Item>Termino 2</List.Item>
                                <List.Item>Termino 2</List.Item>
                            </List>
                        </Collapse>
                    </Card>
                    <Card
                        padding="lg"
                        shadow="sm"
                        withBorder>
                        <Group justify="space-between">
                            <Text
                                size="lg"
                                fw="bold">
                                Politicas y Privacidad
                            </Text>
                            <ActionIcon
                                size="lg"
                                variant="transparent"
                                onClick={togglePolicies}>
                                {openedPolicies
                                    ? <Minus fill="var(--mantine-blue-6)" width="70%" height="70%" />
                                    : <Plus fill="var(--mantine-blue-6)" width="70%" height="70%" />
                                }
                            </ActionIcon>
                        </Group>
                        <Collapse in={openedPolicies}>
                            <Divider my="sm" />
                            <List
                                size="md"
                                type="ordered"
                                spacing="sm"
                                center>
                                <List.Item>Politica 1</List.Item>
                                <List.Item>Politica 2</List.Item>
                                <List.Item>Politica 2</List.Item>
                            </List>
                        </Collapse>
                    </Card>
                </Container>
                <Image
                    className="portal-divider"
                    src={portalDivider2} />
            </Box>
        </PortalLayout>
    )
}