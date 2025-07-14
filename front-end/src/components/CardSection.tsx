import {
    Divider,
    Group,
    Stack,
    Text
} from "@mantine/core";
import { Icon } from "@phosphor-icons/react";
import { PropsWithChildren } from "react";

interface CardSectionProps extends PropsWithChildren {
    title: string;
    icon: Icon
}

export const CardSection = ({ title, icon: SectionIcon, children }: CardSectionProps) => {
    return (
        <Stack gap="xs">
            <Group align="center" justify="space-between">
                <Text
                    c="blue"
                    fw="bold"
                    size="md">
                    {title}
                </Text>
                <SectionIcon color="var(--mantine-blue-6)" />
            </Group>
            <Divider />
            {children}
        </Stack>
    )
}
