import { PropsWithChildren, useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
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
    const [openedSidebar, setOpenedSidebar] = useState(true);
    const isMobile = useMediaQuery("(max-width: 992px)");

    useEffect(() => {
        setOpenedSidebar(!isMobile);
    }, [isMobile]);

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
                    closeSidebar={() => setOpenedSidebar(false)} />
                <Box
                    id="admin-panel-content"
                    className={!openedSidebar ? "shrink" : ""}
                    h="100%">
                    <Header toggleSidebar={() => setOpenedSidebar(!openedSidebar)} />
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