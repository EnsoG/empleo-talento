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
import { CandidateStudy } from "../../../types";
import { endpoints } from "../../../endpoints";
import { FeaturedEducation } from "./FeaturedEducation";
import { EducationItem } from "./EducationItem";
import { EducationForm } from "./EducationForm";

export const ProfileEducation = () => {
    const { data: studies, isLoading: studiesLoading, fetchData: fetchStudies } = useFetch<CandidateStudy[]>();
    const { openModal } = useModal();

    const getStudies = async () => await fetchStudies(endpoints.candidateStudies, {
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getStudies();
    }, []);

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <FeaturedEducation />
            <Group
                justify="space-between"
                align="center"
                mt="md">
                <Text c="blue" size="md" fw="bold">Experiencia Educacional</Text>
                <ActionIcon
                    size="md"
                    variant="transparent"
                    onClick={() => openModal(
                        <EducationForm
                            type="create"
                            onGetStudies={getStudies} />,
                        "Agregar Educacion"
                    )}>
                    <Plus height="70%" width="70%" />
                </ActionIcon>
            </Group>
            <Divider my="sm" />
            <Skeleton
                visible={studiesLoading}
                height="100%">
                <ScrollArea.Autosize
                    type="auto"
                    mah={250}>
                    {(studies?.length != 0)
                        ? <Timeline
                            active={studies ? studies?.length : 0}
                            pr="md"
                            bulletSize={24}
                            lineWidth={2}>
                            {
                                studies?.map((s) => (
                                    <Timeline.Item
                                        key={s.study_id}>
                                        <EducationItem
                                            study={s}
                                            onGetStudies={getStudies} />
                                    </Timeline.Item>
                                ))
                            }
                        </Timeline>
                        : <Alert
                            title="Sin estudios registrados"
                            icon={<Info />}>
                            No se encuentran estudios asociados a este perfil
                        </Alert>
                    }
                </ScrollArea.Autosize>
            </Skeleton>
        </Card>
    )
}