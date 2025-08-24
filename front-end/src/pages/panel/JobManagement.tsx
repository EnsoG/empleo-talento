import { useEffect } from "react";
import { useParams } from "react-router";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    Card,
    Grid,
    LoadingOverlay,
    Select,
    Skeleton,
    Stack
} from "@mantine/core";
import { Briefcase, ListBullets } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../hooks/useAuth";
import { AppPaths, Offer, OfferState, UserRole } from "../../types";
import { endpoints } from "../../endpoints";
import { updateJobStateSchema } from "../../schemas/panelSchemas";
import { PanelLayout } from "../../layouts/PanelLayout";
import { JobInfo } from "../../components/panel/job_management/JobInfo";
import { JobPostulations } from "../../components/panel/job_management/JobPostulations";
import { FinishJob } from "../../components/panel/job_management/FinishJob";
import { CardSection } from "../../components/CardSection";

export const JobManagement = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { data, isLoading, fetchData } = useFetch<Offer>();
    const { isLoading: stateLoading, fetchData: fetchState } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        validate: zodResolver(updateJobStateSchema)
    });

    const getOffer = async () => await fetchData(`${endpoints.jobOffers}/${id}`, {
        errorRedirect: AppPaths.myJobs,
        method: "GET",
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Do Request And Get Job Offer
        await fetchState(`${endpoints.jobOffers}/${data?.offer_id}`, {
            showNotifications: true,
            successMessage: "Estado de la ofeta actualizado exitosamente",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values),
            credentials: "include"
        });
        await getOffer();
    }

    useEffect(() => {
        getOffer();
    }, []);

    useEffect(() => {
        if (data) {
            form.setValues({
                state: data.state
            });
        }
    }, [data]);

    return (
        <PanelLayout
            pageName="Gestion Oferta"
            PageIcon={Briefcase}>
            <Skeleton
                height="100%"
                visible={isLoading}>
                {(data) &&
                    <Grid>
                        <Grid.Col span={{ base: 12, md: 8 }} >
                            <Stack>
                                <JobInfo
                                    offer={data}
                                    onGetOffer={getOffer} />
                                <JobPostulations
                                    offerId={data.offer_id}
                                    offerState={data.state} />
                            </Stack>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4 }}>
                            {user?.user_role == UserRole.admin &&
                                <Card
                                    shadow="sm"
                                    padding="lg"
                                    mb="md"
                                    withBorder>
                                    <CardSection
                                        title="Actualizar Estado Oferta"
                                        icon={ListBullets}>
                                        <form onSubmit={form.onSubmit(handleSubmit)}>
                                            <Stack>
                                                <LoadingOverlay visible={stateLoading} />
                                                <Select
                                                    label="Estado Oferta"
                                                    placeholder="Seleccione el estado de la oferta"
                                                    data={Object.values(OfferState).slice(0, 2)}
                                                    key={form.key("state")}
                                                    {...form.getInputProps("state")}
                                                    allowDeselect={false}
                                                    withAsterisk />
                                                <Button type="submit">Actualizar</Button>
                                            </Stack>
                                        </form>
                                    </CardSection>
                                </Card>

                            }
                            {data.state == OfferState.active &&
                                <FinishJob offerId={data.offer_id} />
                            }
                        </Grid.Col>
                    </Grid>
                }
            </Skeleton>
        </PanelLayout>
    )
}