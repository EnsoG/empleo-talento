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
import { CandidateSoftware, Softwares } from "../../../types";
import { endpoints } from "../../../endpoints";
import { CandidateSoftwareForm } from "./CandidateSoftwareForm";
import { SoftwareItem } from "./SoftwareItem";

export const ProfileSoftware = () => {
    const { data: candidateSoftwares, isLoading: candSoftLoading, fetchData: fetchCandSoft } = useFetch<CandidateSoftware[]>();
    const { data, isLoading: softLoading, fetchData: fetchSoftwares } = useFetch<Softwares>();
    const { openModal } = useModal();

    const getSoftwares = async () => await fetchSoftwares(endpoints.softwares, {
        method: "GET"
    });

    const getCandSoft = async () => await fetchCandSoft(endpoints.candidateSoftwares, {
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getCandSoft();
        getSoftwares();
    }, []);

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <Group justify="space-between" align="center">
                <Text c="blue" size="md" fw="bold">Softwares</Text>
                <ActionIcon
                    size="md"
                    variant="transparent"
                    onClick={() => {
                        if (data) openModal(<CandidateSoftwareForm
                            type="create"
                            softwares={data.softwares}
                            onGetSoftwares={getCandSoft} />,
                            "Agregar Software"
                        )
                    }}>
                    <Plus />
                </ActionIcon>
            </Group>
            <Divider my="sm" />
            <Skeleton
                height="100%"
                visible={candSoftLoading || softLoading}>
                <ScrollArea.Autosize
                    type="auto"
                    mah={250}>
                    <Stack pr="md">
                        {(candidateSoftwares?.length != 0)
                            ? candidateSoftwares?.map((s) => (
                                <SoftwareItem
                                    key={s.candidate_software_id}
                                    software={s}
                                    onGetSoftwares={getCandSoft} />
                            ))
                            : <Alert
                                title="Sin softwares registrados"
                                icon={<Info />}>
                                No se encuentran softwares asociados a este perfil
                            </Alert>
                        }
                    </Stack>
                </ScrollArea.Autosize>
            </Skeleton>
        </Card >
    )
}