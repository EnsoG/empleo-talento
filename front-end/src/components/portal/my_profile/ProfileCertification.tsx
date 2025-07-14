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
    const { data: certifications, isLoading: certsLoading, fetchData: fetchCerts } = useFetch<CandidateCertification[]>();
    const { openModal } = useModal();

    const getCertifications = async () => await fetchCerts(endpoints.candidateCertifications, {
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getCertifications();
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
                            onGetCertifications={getCertifications} />,
                        "Agregar Certificado"
                    )}>
                    <Plus />
                </ActionIcon>
            </Group>
            <Divider my="sm" />
            <Skeleton
                height="100%"
                visible={certsLoading}>
                <ScrollArea.Autosize
                    type="auto"
                    pr="md"
                    mah={250}>
                    <Stack>
                        {(certifications?.length != 0)
                            ? certifications?.map((c) => (
                                <CertificationItem
                                    key={c.certification_id}
                                    certification={c}
                                    onGetCertifications={getCertifications} />
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