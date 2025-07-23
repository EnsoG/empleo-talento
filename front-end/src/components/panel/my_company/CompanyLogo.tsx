import { useEffect } from 'react';
import { MIME_TYPES } from '@mantine/dropzone';
import {
    ActionIcon,
    Avatar,
    Card,
    Center,
    Divider,
    Group,
    Skeleton,
    Text
} from '@mantine/core';
import { PencilSimple } from '@phosphor-icons/react';

import { useFetch } from '../../../hooks/useFetch';
import { useModal } from '../../../hooks/useModal';
import { Company } from '../../../types';
import { endpoints } from '../../../endpoints';
import { CustomDropzone } from '../../CustomDropzone';

export const CompanyLogo = () => {
    const { data, isLoading, fetchData } = useFetch<Company>();
    const { openModal, closeModal } = useModal();

    const getCompanyLogo = async () => await fetchData(endpoints.getUserCompany, {
        method: "GET",
        credentials: "include"
    });

    const updateLogo = async (files: File[]) => {
        // Create Form Data With Uploaded File
        const formData = new FormData();
        formData.append("logo", files[0]);
        // Do Request
        await fetchData(endpoints.updateCompanyLogo, {
            showNotifications: true,
            successMessage: "Logo de empresa actualizado con exito",
            method: "PUT",
            body: formData,
            credentials: "include"
        });
        // Close Modal And Get New Logo
        closeModal();
        await getCompanyLogo();
    }

    useEffect(() => {
        getCompanyLogo();
    }, []);

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <Group justify="space-between" align="center">
                <Text c="blue" size="md" fw="bold">Foto Empresa</Text>
                <ActionIcon
                    size="md"
                    variant="transparent"
                    onClick={() => openModal(
                        <CustomDropzone
                            title="Arrastra o selecciona el logo en esta zona"
                            subtitle="El formato permitido es '.jpg', '.png' y '.svg' con un peso maximo de 1 MB"
                            acceptedFiles={[MIME_TYPES.jpeg, MIME_TYPES.svg, MIME_TYPES.png]}
                            maxSize={1 * 1024 ** 2}
                            onSendFile={updateLogo} />,
                        "Subir Logo Empresa"
                    )}>
                    <PencilSimple height="70%" width="70%" />
                </ActionIcon>
            </Group>
            <Divider my="sm" />
            <Center h="100%">
                <Skeleton
                    width={50}
                    height={50}
                    visible={isLoading}
                    circle >
                    <Avatar
                        size="lg"
                        src={data?.logo && `${endpoints.staticLogos}/${data?.logo}`} />
                </Skeleton>
            </Center>
        </Card>
    )
}
