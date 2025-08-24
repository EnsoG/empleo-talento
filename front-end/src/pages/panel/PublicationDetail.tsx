import { useParams } from "react-router";
import { useEffect } from "react";
import { Card, Skeleton } from "@mantine/core";
import { Article } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { AppPaths, Publication } from "../../types";
import { endpoints } from "../../endpoints";
import { PanelLayout } from "../../layouts/PanelLayout";
import { PublicationForm } from "../../components/panel/PublicationForm";

export const PublicationDetail = () => {
    const { id } = useParams();
    const { data, isLoading, fetchData } = useFetch<Publication>();

    const getPublication = async () => await fetchData(`${endpoints.publications}/${id}`, {
        errorRedirect: AppPaths.myPublications,
        method: "GET"
    });

    useEffect(() => {
        getPublication();
    }, []);

    return (
        <PanelLayout
            pageName="Detalle Publicacion"
            PageIcon={Article}>
            <Card
                padding="lg"
                shadow="sm"
                withBorder>
                <Skeleton
                    height="100%"
                    visible={isLoading}>
                    {(data) &&
                        <PublicationForm
                            type="update"
                            publication={data} />
                    }
                </Skeleton>
            </Card>
        </PanelLayout>
    )
}