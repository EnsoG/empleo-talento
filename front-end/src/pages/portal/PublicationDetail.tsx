import { useParams } from "react-router";
import { useEffect } from "react";
import {
    Badge,
    Box,
    Container,
    Divider,
    Grid,
    Image,
    Skeleton,
    Stack,
    Text,
    Title
} from "@mantine/core";

import { useFetch } from "../../hooks/useFetch";
import { endpoints } from "../../endpoints";
import { AppPaths, Publication } from "../../types";
import { PortalLayout } from "../../layouts/PortalLayout";
import { PortalBanner } from "../../components/portal/PortalBanner";
import portalDivider2 from "../../assets/svg/portal-divider-2.svg";
import { parseDateToLocal } from "../../utilities";

export const PublicationDetail = () => {
    const { id } = useParams();
    const { data, isLoading, fetchData } = useFetch<Publication>();

    const getPublication = async () => await fetchData(`${endpoints.publications}/${id}`, {
        errorRedirect: AppPaths.publications,
        method: "GET"
    });

    useEffect(() => {
        getPublication();
    }, []);

    return (
        <PortalLayout>
            <PortalBanner title="Detalle Publicacion" />
            <Box
                className="portal-section"
                component="section">
                <Container size="xl">
                    <Skeleton
                        height="100%"
                        visible={isLoading}>
                        <Title
                            c="blue"
                            order={3}>
                            {data?.title}
                        </Title>
                        <Divider my="md" />
                        <Grid>
                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Stack>
                                    <Image
                                        src={`${endpoints.staticPublicationImages}/${data?.image}`}
                                        fit="contain"
                                        mah={300} />
                                    <Text
                                        size="sm"
                                        fw="bold"
                                        c="gray">
                                        {data && parseDateToLocal(data.creation_date).toLocaleDateString("es-CL")}
                                    </Text>
                                    <Badge>{data?.publication_category.name}</Badge>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 8 }}>
                                <Text style={{ whiteSpace: 'pre-wrap', wordBreak: "break-word" }}>
                                    {data?.description}
                                </Text>
                            </Grid.Col>
                        </Grid>
                    </Skeleton>
                </Container>
                <Image
                    className="portal-divider"
                    src={portalDivider2} />
            </Box>
        </PortalLayout >
    )
}