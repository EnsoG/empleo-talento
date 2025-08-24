import {
    Card,
    Center,
    Text
} from '@mantine/core';
import { Icon } from "@phosphor-icons/react";

interface IconCardProps {
    name: string;
    icon: Icon;
}

export const IconCard = ({ name, icon: PhosphorIcon }: IconCardProps) => {
    return (
        <Card
            className="icon-card"
            shadow="lg"
            padding="xl"
            radius="lg">
            <Center mb="sm">
                <div><PhosphorIcon fill="var(--mantine-white)" /></div>
            </Center>
            <Text
                c="white"
                fz={{ base: "md", md: "lg" }}
                ta="center">{name}</Text>
        </Card>
    )
}