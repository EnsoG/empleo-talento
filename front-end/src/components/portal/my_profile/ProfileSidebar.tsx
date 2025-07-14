import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router";
import {
    ActionIcon,
    Card,
    Collapse,
    Divider,
    Group,
    NavLink,
    Stack,
    Text
} from "@mantine/core";
import {
    Briefcase,
    FileText,
    List,
    UserList
} from "@phosphor-icons/react";

import { AppPaths } from "../../../types";

export const ProfileSidebar = () => {
    const [openedSidebar, { toggle: toggleSidebar }] = useDisclosure(true);
    const navigate = useNavigate();

    return (
        <Card
            id="my-profile-sidebar"
            padding="lg"
            shadow="sm"
            component="aside"
            withBorder>
            <Group
                justify="space-between"
                align="center">
                <Text
                    c="blue"
                    fw="bold">
                    Menu Navegacion
                </Text>
                <ActionIcon
                    size="md"
                    variant="transparent"
                    onClick={toggleSidebar}>
                    <List width="80%" height="80%" />
                </ActionIcon>
            </Group>
            <Collapse
                in={openedSidebar}
                mt="md">
                <Stack>
                    <Divider />
                    <NavLink label="Informacion Profesional"
                        leftSection={<Briefcase fill="var(--mantine-blue-6)" />}
                        onClick={() => navigate(AppPaths.profesionalInfo)} />
                    <NavLink
                        label="Informacion Personal"
                        leftSection={<UserList fill="var(--mantine-blue-6)" />}
                        onClick={() => navigate(AppPaths.personalInfo)} />
                    <NavLink
                        label="Postulaciones"
                        leftSection={<FileText fill="var(--mantine-blue-6)" />}
                        onClick={() => navigate(AppPaths.postulations)} />
                </Stack>
            </Collapse>
        </Card>
    )
}
