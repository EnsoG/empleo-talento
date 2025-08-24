import { useEffect } from "react";
import {
    ActionIcon,
    Alert,
    Divider,
    Group,
    Skeleton,
    Text
} from "@mantine/core";
import { Info, Pencil } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { Candidate } from "../../../types";
import { endpoints } from "../../../endpoints";
import { FeaturedEducationForm, FeaturedEducationFormType } from "./FeaturedEducationForm";

export const FeaturedEducation = () => {
    const { data, isLoading, fetchData } = useFetch<Candidate>();
    const { closeModal, openModal } = useModal();

    const getFeaturedStudy = async () => await fetchData(endpoints.candidates, {
        method: "GET",
        credentials: "include"
    });

    const updateFeaturedStudy = async (data: FeaturedEducationFormType) => {
        // Do Request, Get Featured Study And Close Modal
        await fetchData(endpoints.candidates, {
            showNotifications: true,
            successMessage: "Estudio destacado actualizado exitosamente",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        closeModal();
        await getFeaturedStudy();
    }

    useEffect(() => {
        getFeaturedStudy();
    }, [])

    return (
        <>
            <Group
                justify="space-between"
                align="center">
                <Text c="blue" size="md" fw="bold">Estudio destacado</Text>
                <ActionIcon
                    size="md"
                    variant="transparent"
                    onClick={() => openModal(
                        <FeaturedEducationForm
                            featuredStudy={data?.featured_study ?? ""}
                            onSubmit={updateFeaturedStudy} />,
                        "Actualizar Estudio Destacado"
                    )}>
                    <Pencil height="70%" width="70%" />
                </ActionIcon>
            </Group>
            <Divider my="sm" />
            <Skeleton
                height="100%"
                visible={isLoading}>
                {data?.featured_study
                    ? <Text
                        style={{ whiteSpace: 'pre-wrap', wordBreak: "break-word" }}
                        size="sm"
                        lineClamp={3}>
                        data.featured_study
                    </Text>
                    : <Alert
                        title="Sin estudio destacado"
                        icon={<Info />}>
                        No se ha encontrado ningun estudio destacado registrado
                    </Alert>
                }
            </Skeleton>
        </>
    )
}