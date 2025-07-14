import {
    Badge,
    Box,
    Card,
    Divider,
    Group,
    Image,
    Text
} from "@mantine/core";
import {
    CalendarCheck
} from "@phosphor-icons/react";

import { endpoints } from "../../../endpoints";
import { Link } from "react-router";
import { AppPaths } from "../../../types";
import { parseDateToLocal } from "../../../utilities";

export interface PostulationItemProps {
    title: string;
    state: string;
    postulationDate: string;
    tradeName: string;
    companyLogo: string | null;
    offerId: number;
}

export const PostulationItem = ({ title, state, postulationDate, tradeName, companyLogo, offerId }: PostulationItemProps) => {
    return (
        <Link
            className="react-link"
            to={`${AppPaths.jobDetail}/${offerId}`}>
            <Card
                padding="lg"
                shadow="sm"
                withBorder>
                <Group>
                    {companyLogo &&
                        <Image
                            src={`${endpoints.staticLogos}/${companyLogo}`}
                            radius="md"
                            h={75}
                            w={75} />
                    }
                    <Box>
                        <Text
                            c="blue"
                            size="sm"
                            fw="bold">
                            {title}
                        </Text>
                        <Text
                            c="gray"
                            size="sm">
                            {tradeName}
                        </Text>
                        <Badge size="sm" >
                            {state}
                        </Badge>
                    </Box>
                </Group>
                <Divider
                    orientation="horizontal"
                    my="sm" />
                <Group gap="xs">
                    <CalendarCheck color="var(--mantine-blue-6)" />
                    <Text c="gray" size="sm" fw="bold">
                        Fecha Postulacion: {parseDateToLocal(postulationDate).toLocaleDateString("es-CL")}
                    </Text>
                </Group>
            </Card>
        </Link>
    )
}