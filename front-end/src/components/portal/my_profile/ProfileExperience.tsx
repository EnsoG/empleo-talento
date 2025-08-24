import { useEffect } from "react";
import {
    ActionIcon,
    Alert,
    Card,
    Divider,
    Group,
    ScrollArea,
    Skeleton,
    Text,
    Timeline
} from "@mantine/core";
import { Info, Plus } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { WorkExperience } from "../../../types";
import { endpoints } from "../../../endpoints";
import { ExperienceItem } from "./ExperienceItem";
import { ExperienceForm } from "./ExperienceForm";

export const ProfileExperience = () => {
    const { data: experiences, isLoading: expLoading, fetchData: fetchExp } = useFetch<WorkExperience[]>();
    const { openModal } = useModal();

    const getExperiences = async () => await fetchExp(endpoints.candidateWorkExperiences, {
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getExperiences();
    }, []);

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <Group justify="space-between" align="center">
                <Text c="blue" size="md" fw="bold">Experiencia Laboral</Text>
                <ActionIcon
                    size="md"
                    variant="transparent"
                    onClick={() => openModal(
                        <ExperienceForm
                            type="create"
                            onGetExperiences={getExperiences} />,
                        "Agregar Experiencia Laboral"
                    )}>
                    <Plus />
                </ActionIcon>
            </Group>
            <Divider my="sm" />
            <Skeleton
                height="100%"
                visible={expLoading}>
                <ScrollArea.Autosize
                    type="auto"
                    mah={250}>
                    {(experiences?.length != 0)
                        ? <Timeline
                            active={experiences ? experiences?.length : 0}
                            pr="md"
                            bulletSize={24}
                            lineWidth={2}>
                            {
                                experiences?.map((e) => (
                                    <Timeline.Item
                                        key={e.experience_id}>
                                        <ExperienceItem
                                            experience={e}
                                            onGetExperiences={getExperiences} />
                                    </Timeline.Item>
                                ))
                            }
                        </Timeline>
                        : <Alert
                            title="Sin experiencias laborales registradas"
                            icon={<Info />}>
                            No se encuentran experiencias laborales asociadas a este perfil
                        </Alert>
                    }
                </ScrollArea.Autosize>
            </Skeleton>
        </Card >
    )
}