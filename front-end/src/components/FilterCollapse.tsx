import { PropsWithChildren } from "react";
import {
    ActionIcon,
    Card,
    Collapse,
    Divider,
    Group,
    Stack,
    Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Funnel } from "@phosphor-icons/react";

interface FilterCollapseProps extends PropsWithChildren { }

export const FilterCollapse = ({ children }: FilterCollapseProps) => {
    const [opened, { toggle }] = useDisclosure();

    return (
        <Card
            padding="xs"
            shadow="none"
            withBorder>
            <Group
                justify="space-between"
                align="center">
                <Text
                    size="md"
                    fw="bold"
                    ta="center">
                    Filtros
                </Text>
                <ActionIcon
                    variant="transparent"
                    size="md"
                    onClick={toggle}>
                    <Funnel
                        weight="fill"
                        width="70%"
                        height="70%" />
                </ActionIcon>
            </Group>
            <Collapse in={opened}>
                <Divider my="sm" />
                <Stack>
                    {children}
                </Stack>
            </Collapse>
        </Card>
    )
}