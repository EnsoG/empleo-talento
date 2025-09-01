import { Link } from "react-router";
import {
    Badge,
    Card,
    Divider,
    Grid,
    Image,
    Stack,
    Text,
    Title
} from "@mantine/core";

import { AppPaths, Publication } from "../../../types";
import { endpoints } from "../../../endpoints";
import { parseDateToLocal } from "../../../utilities";

interface PublicationCardProps {
    publication: Publication;
}

export const PublicationCard = ({ publication }: PublicationCardProps) => {
    return (
        <Link
            className="react-link"
            to={`${AppPaths.portalPublicationDetail}/${publication.publication_id}`}>
            <Card
                padding="lg"
                shadow="sm"
                withBorder>
                <Grid>
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <Image
                            src={`${endpoints.staticPublicationImages}/${publication.image}`}
                            fit="contain"
                            mah={200} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        <Stack
                            gap="md">
                            <Title
                                size="md"
                                c="blue"
                                order={3}
                                lineClamp={1}>
                                {publication.title}
                            </Title>
                            <Divider />
                            <Text
                                size="sm"
                                c="gray"
                                fw="bold">
                                Fecha Publicacion: {parseDateToLocal(publication.creation_date).toLocaleDateString("es-CL")}
                            </Text>
                            <Badge>{publication.publication_category.name}</Badge>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Card>
        </Link>
    )
}