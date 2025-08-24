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
import { CandidateLanguage, Languages } from "../../../types";
import { LanguageForm } from "./LanguageForm";
import { LanguageItem } from "./LanguageItem";

export const ProfileLanguage = () => {
    const { data: candidateLanguages, isLoading: candLangLoading, fetchData: fetchCandLang } = useFetch<CandidateLanguage[]>();
    const { data, isLoading: langLoading, fetchData: fetchLanguages } = useFetch<Languages>();
    const { openModal } = useModal();

    const getCandLang = async () => await fetchCandLang(endpoints.candidateLanguages, {
        method: "GET",
        credentials: "include"
    });

    const getLanguages = async () => await fetchLanguages(endpoints.languages, {
        method: "GET"
    });

    useEffect(() => {
        getCandLang();
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
                    onClick={() => {
                        if (data) openModal(
                            <LanguageForm
                                type="create"
                                languages={data?.languages}
                                onGetLanguages={getCandLang} />,
                            "Agregar Idioma"
                        )
                    }}>
                    <Plus />
                </ActionIcon>
            </Group>
            <Divider my="sm" />
            <Skeleton
                height="100%"
                visible={candLangLoading || langLoading}>
                <ScrollArea.Autosize
                    type="auto"
                    mah={250}>
                    <Stack pr="md">
                        {(candidateLanguages?.length != 0)
                            ? candidateLanguages?.map((l) => (
                                <LanguageItem
                                    key={l.candidate_language_id}
                                    language={l}
                                    onGetLanguages={getCandLang} />
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