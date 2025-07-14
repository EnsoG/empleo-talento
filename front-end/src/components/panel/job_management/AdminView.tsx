import { useForm, zodResolver } from "@mantine/form";
import {
    Badge,
    Button,
    Card,
    Grid,
    LoadingOverlay,
    ScrollArea,
    Select,
    Stack,
    Table
} from "@mantine/core";
import { Info, ListBullets } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch";
import { Offer, OfferFeaturedState, offerFeaturedStates, OfferState } from "../../../types";
import { endpoints } from "../../../endpoints";
import { CLPFormatter, parseDateToLocal } from "../../../utilities";
import { updateJobStateSchema } from "../../../schemas/panelSchemas";
import { CardSection } from "../../CardSection";

interface AdminViewProps {
    offer: Offer;
    onGetOffer: () => Promise<void>;
}

export const AdminView = ({ offer, onGetOffer }: AdminViewProps) => {
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            state: offer.state
        },
        validate: zodResolver(updateJobStateSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Do Request And Get Job Offer
        await fetchData(`${endpoints.jobOffers}/${offer.offer_id}`, {
            showNotifications: true,
            successMessage: "Estado de la ofeta actualizado exitosamente",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values),
            credentials: "include"
        });
        await onGetOffer();
    }

    return (
        <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
                <Card
                    padding="lg"
                    shadow="sm"
                    withBorder>
                    <CardSection
                        title="Informacion Oferta"
                        icon={Info}>
                        <ScrollArea
                            type="auto"
                            h={450}
                            pr="md">
                            <Table
                                variant="vertical"
                                layout="fixed"
                                withTableBorder>
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Th>Titulo</Table.Th>
                                        <Table.Td>{offer.title}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Codigo</Table.Th>
                                        <Table.Td>{offer.code}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Cargo</Table.Th>
                                        <Table.Td>{offer.position}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Descripcion</Table.Th>
                                        <Table.Td>{offer.description ?? "Sin especificar"}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Requisitos</Table.Th>
                                        <Table.Td>{offer.requirements ?? "Sin especificar"}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Años Experiencia</Table.Th>
                                        <Table.Td>{offer.years_experience ?? "Sin especificar"}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Salario</Table.Th>
                                        <Table.Td>
                                            {(offer.salary)
                                                ? CLPFormatter.format(offer.salary)
                                                : "Sin especificar"}
                                        </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Lugar</Table.Th>
                                        <Table.Td>{offer.location ?? "Sin especificar"}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Fecha Publicacion</Table.Th>
                                        <Table.Td>{parseDateToLocal(offer.publication_date).toLocaleDateString("es-CL")}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Fecha Cierre</Table.Th>
                                        <Table.Td>
                                            {(offer.closing_date)
                                                ? parseDateToLocal(offer.closing_date).toLocaleDateString("es-CL")
                                                : "Sin especificar"
                                            }
                                        </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Estado</Table.Th>
                                        <Table.Td>
                                            <Badge>{offer.state}</Badge>
                                        </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Tipo Oferta</Table.Th>
                                        <Table.Td>
                                            {offer.featured == OfferFeaturedState.standard
                                                ? offerFeaturedStates[0].name
                                                : offerFeaturedStates[1].name
                                            }
                                        </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Area Desempeño</Table.Th>
                                        <Table.Td>{offer.performance_area?.name ?? "Sin especificar"}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Ubicacion</Table.Th>
                                        <Table.Td>
                                            {offer.city
                                                ? `${offer.city.name} ${offer.city.region.name}`
                                                : "Sin especificar"
                                            }
                                        </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Jornada</Table.Th>
                                        <Table.Td>{offer.job_type?.name ?? "Sin especificar"}</Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        </ScrollArea>
                    </CardSection>
                </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
                <Card
                    padding="lg"
                    shadow="sm"
                    withBorder>
                    <CardSection
                        title="Actualizar Estado Oferta"
                        icon={ListBullets}>
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack>
                                <LoadingOverlay visible={isLoading} />
                                <Select
                                    label="Estado Oferta"
                                    placeholder="Seleccione el estado de la oferta"
                                    data={Object.values(OfferState)}
                                    key={form.key("state")}
                                    {...form.getInputProps("state")}
                                    withAsterisk />
                                <Button type="submit">Actualizar</Button>
                            </Stack>
                        </form>
                    </CardSection>
                </Card>
            </Grid.Col>
        </Grid>
    )
}