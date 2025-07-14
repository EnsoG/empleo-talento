import { MIME_TYPES } from '@mantine/dropzone';
import {
    ActionIcon,
    Alert,
    Card,
    Divider,
    Group,
    Stack,
    Text
} from '@mantine/core';
import {
    Info,
    Upload
} from '@phosphor-icons/react';

import { useFetch } from '../../../hooks/useFetch';
import { useModal } from '../../../hooks/useModal';
import { endpoints } from '../../../endpoints';
import { CustomDropzone } from "../../CustomDropzone";

export const ProfileResume = () => {
    const { fetchData } = useFetch();
    const { closeModal, openModal } = useModal();

    const updateResume = async (files: File[]) => {
        // Create Form Data With Uploaded File
        const formData = new FormData();
        formData.append("resume", files[0]);
        // Do Request And Close Modal
        await fetchData(endpoints.updateCandidateResume, {
            showNotifications: true,
            successMessage: "CV actualizado con exito",
            method: "PUT",
            body: formData,
            credentials: "include"
        });
        closeModal();
    }

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <Stack gap="sm">
                <Group justify="space-between" align="center">
                    <Text c="blue" size="md" fw="bold">Curriculum</Text>
                    <ActionIcon
                        size="md"
                        variant="transparent"
                        onClick={() => openModal(
                            <CustomDropzone
                                title="Arrastra o selecciona tu CV en la zona indicada"
                                subtitle="El formato permitido es '.pdf /.docx' con un peso maximo de 5 MB"
                                acceptedFiles={[MIME_TYPES.pdf, MIME_TYPES.docx]}
                                maxSize={5 * 1024 ** 2}
                                onSendFile={updateResume} />,
                            "Subir CV"
                        )}>
                        <Upload height="70%" width="70%" />
                    </ActionIcon>
                </Group>
                <Divider />
                <Alert
                    title="Manten Tu CV Actualizado"
                    icon={<Info />}>
                    Es importante mantener tu CV actualizado para que las empresas puedan conocer mas de ti durante tus postulaciones
                </Alert>
            </Stack>
        </Card >
    )
}
