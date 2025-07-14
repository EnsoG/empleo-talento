import { useEffect } from "react";
import {
    ActionIcon,
    Alert,
    Card,
    Divider,
    Group,
    ScrollArea,
    Skeleton,
    Stack,
    Text
} from "@mantine/core";
import { Info, Plus } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { endpoints } from "../../../endpoints";
import { CandidateLanguage } from "../../../types";
import { LanguageForm } from "./LanguageForm";
import { LanguageItem } from "./LanguageItem";

export const ProfileLanguage = () => {
    const { data: languages, isLoading: langLoading, fetchData: fetchLanguages } = useFetch<CandidateLanguage[]>();
    const { openModal } = useModal();

    const getLanguages = async () => await fetchLanguages(endpoints.candidateLanguages, {
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getLanguages();
    }, []);

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <Group justify="space-between" align="center">
                <Text c="blue" size="md" fw="bold">Idiomas</Text>
                <ActionIcon
                    size="md"
                    variant="transparent"
                    onClick={() => openModal(
                        <LanguageForm
                            type="create"
                            onGetLanguages={getLanguages} />,
                        "Agregar Idioma"
                    )}>
                    <Plus />
                </ActionIcon>
            </Group>
            <Divider my="sm" />
            <Skeleton
                height="100%"
                visible={langLoading}>
                <ScrollArea.Autosize
                    type="auto"
                    pr="md"
                    mah={250}>
                    <Stack>
                        {(languages?.length != 0)
                            ? languages?.map((l) => (
                                <LanguageItem
                                    key={l.candidate_language_id}
                                    language={l}
                                    onGetLanguages={getLanguages} />
                            ))
                            : <Alert
                                title="Sin idiomas registrados"
                                icon={<Info />}>
                                No se encuentran idiomas asociados a este perfil
                            </Alert>
                        }
                    </Stack>
                </ScrollArea.Autosize>
            </Skeleton>
        </Card >
    )
}
