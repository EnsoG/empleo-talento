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
import { CandidateCertification } from "../../../types";
import { CertificationForm } from "./CertificationForm";
import { CertificationItem } from "./CertificationItem";

export const ProfileCertification = () => {
    const { data: candCertifications, isLoading: candCertLoading, fetchData: fetchCandCert } = useFetch<CandidateCertification[]>();
    const { openModal } = useModal();

    const getCandCertifications = async () => await fetchCandCert(endpoints.candidateCertifications, {
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getCandCertifications();
    }, []);

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <Group justify="space-between" align="center">
                <Text c="blue" size="md" fw="bold">Certificaciones</Text>
                <ActionIcon
                    size="md"
                    variant="transparent"
                    onClick={() => openModal(
                        <CertificationForm
                            type="create"
                            onGetCertifications={getCandCertifications} />,
                        "Agregar Certificado"
                    )
                    }>
                    <Plus />
                </ActionIcon>
            </Group>
            <Divider my="sm" />
            <Skeleton
                height="100%"
                visible={candCertLoading}>
                <ScrollArea.Autosize
                    type="auto"
                    mah={250}>
                    <Stack pr="md">
                        {(candCertifications?.length != 0)
                            ? candCertifications?.map((c) => (
                                <CertificationItem
                                    key={c.certification_id}
                                    certification={c}
                                    onGetCertifications={getCandCertifications} />
                            ))
                            : <Alert
                                title="Sin certificados registrados"
                                icon={<Info />}>
                                No se encuentran certificados asociados a este perfil
                            </Alert>
                        }
                    </Stack>
                </ScrollArea.Autosize>
            </Skeleton>
        </Card >
    )
}