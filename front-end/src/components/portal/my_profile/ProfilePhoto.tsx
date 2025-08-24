import { useEffect } from "react";
import { MIME_TYPES } from "@mantine/dropzone";
import {
    ActionIcon,
    Avatar,
    Card,
    Center,
    Divider,
    Group,
    Skeleton,
    Text
} from "@mantine/core";
import { PencilSimple } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { Candidate } from "../../../types";
import { endpoints } from "../../../endpoints";
import { CustomDropzone } from "../../CustomDropzone";

export const ProfilePhoto = () => {
    const { data, isLoading: photoLoading, fetchData: fetchPhoto } = useFetch<Candidate>();
    const { fetchData } = useFetch();
    const { closeModal, openModal } = useModal();

    const getCandidatePhoto = async () => await fetchPhoto(endpoints.candidates, {
        method: "GET",
        credentials: "include"
    });

    const updatePhoto = async (files: File[]) => {
        // Create Form Data With Uploaded File
        const formData = new FormData();
        formData.append("photo", files[0]);
        // Do Request
        await fetchData(endpoints.updateCandidatePhoto, {
            showNotifications: true,
            successMessage: "Foto de perfil actualizada con exito",
            method: "PUT",
            body: formData,
            credentials: "include"
        });
        // Close Modal And Get New Photo
        closeModal();
        await getCandidatePhoto();
    }

    useEffect(() => {
        getCandidatePhoto();
    }, []);

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <Group justify="space-between" align="center">
                <Text c="blue" size="md" fw="bold">Foto Personal</Text>
                <ActionIcon
                    size="md"
                    variant="transparent"
                    onClick={() => openModal(
                        <CustomDropzone
                            title="Arrastra o selecciona la foto de perfil en esta zona"
                            subtitle="El formato permitido es '.jpg' con un peso maximo de 1 MB"
                            acceptedFiles={[MIME_TYPES.jpeg]}
                            maxSize={1 * 1024 ** 2}
                            onSendFile={updatePhoto} />,
                        "Subir Foto Perfil"
                    )}>
                    <PencilSimple height="70%" width="70%" />
                </ActionIcon>
            </Group>
            <Divider my="sm" />
            <Center h="100%">
                <Skeleton
                    width={50}
                    height={50}
                    visible={photoLoading}
                    circle >
                    <Avatar
                        size="lg"
                        src={data?.photo && `${endpoints.staticPhotos}/${data?.photo}`} />
                </Skeleton>
            </Center>
        </Card>
    )
}