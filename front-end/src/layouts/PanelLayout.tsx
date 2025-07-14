import { PropsWithChildren } from "react";
import { useDisclosure } from "@mantine/hooks";
import {
    Box,
    Breadcrumbs,
    Card,
    Container,
    Group,
    Stack,
    Text
} from "@mantine/core";
import { House, Icon } from "@phosphor-icons/react";

import { Sidebar } from "../components/panel/Sidebar";
import { Header } from "../components/panel/Header";

interface PanelLayoutProps extends PropsWithChildren {
    pageName: string;
    PageIcon: Icon;
}

export const PanelLayout = ({ pageName, PageIcon, children }: PanelLayoutProps) => {
    const [openedSidebar, { toggle: toggleSidebar, close: closeSidebar }] = useDisclosure(true);

    return (
        <Box
            id="admin-panel-layout"
            h="100%">
            <Container
                p={0}
                h="100%"
                fluid>
                <Sidebar
                    openedSidebar={openedSidebar}
                    closeSidebar={closeSidebar} />
                <Box
                    id="admin-panel-content"
                    className={!openedSidebar ? "shrink" : ""}
                    h="100%">
                    <Header toggleSidebar={toggleSidebar} />
                    <Container
                        size="xl"
                        pb="sm">
                        <Stack>
                            <Card
                                shadow="sm"
                                w={{ base: "100%", md: "max-content" }}
                                withBorder>
                                <Breadcrumbs separator="/" >
                                    <Group gap="xs">
                                        <House fill="var(--mantine-blue-6)" />
                                        <Text size="sm">Panel</Text>
                                    </Group>
                                    <Group gap="xs">
                                        <PageIcon fill="var(--mantine-blue-6)" />
                                        <Text size="sm">{pageName}</Text>
                                    </Group>
                                </Breadcrumbs>
                            </Card>
                            {children}
                        </Stack>
                    </Container>
                </Box>
            </Container>
        </Box>
    )
}