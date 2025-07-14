import { useEffect, useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import {
    Badge,
    Button,
    Card,
    LoadingOverlay,
    ScrollArea,
    Select,
    Skeleton,
    Stack,
    Table,
    Textarea,
    TextInput
} from "@mantine/core";
import { Info, ListBullets } from "@phosphor-icons/react";

import { useMetadata } from "../../../hooks/useMetadata";
import { useFetch } from "../../../hooks/useFetch";
import { City, Offer, OfferFeaturedState, offerFeaturedStates, OfferState, PerformanceArea } from "../../../types";
import { CLPFormatter, parseDateToLocal, removeDateTime } from "../../../utilities";
import { updateJobSchema } from "../../../schemas/panelSchemas";
import { CardSection } from "../../CardSection";
import { endpoints } from "../../../endpoints";

interface JobInfoProps {
    offer: Offer;
    onGetOffer: () => Promise<void>;
}

export const JobInfo = ({ offer, onGetOffer }: JobInfoProps) => {
    const { metadata } = useMetadata();
    const { data: cities, isLoading: citiesLoading, fetchData: fetchCities } = useFetch<City[]>();
    const { data: areas, isLoading: areasLoading, fetchData: fetchAreas } = useFetch<PerformanceArea[]>();
    const { isLoading, fetchData } = useFetch();
    const [region, setRegion] = useState<string | null>(offer.city ? String(offer.city.region.number_region) : null);
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            title: offer.title,
            description: offer.description,
            requirements: offer.requirements,
            years_experience: offer.years_experience,
            location: offer.location,
            publication_date: parseDateToLocal(offer.publication_date),
            closing_date: offer.closing_date ? parseDateToLocal(offer.closing_date) : null,
            area_id: String(offer.performance_area?.area_id),
            city_id: String(offer.city?.city_id),
            type_id: String(offer.contract_type?.type_id)
        },
        validate: zodResolver(updateJobSchema)
    });

    const getCities = async () => await fetchCities(`${endpoints.getCities}?region=${region}`, {
        method: "GET",
        credentials: "include"
    });

    const getAreas = async () => await fetchAreas(endpoints.getPerformanceAreas, {
        method: "GET"
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Data And Delete Unecessary Field
        const data = updateJobSchema.parse(values);
        delete data.publication_date;
        const { closing_date, ...rest } = data;
        await fetchData(`${endpoints.jobOffers}/${offer.offer_id}`, {
            showNotifications: true,
            successMessage: "Actualizacion de oferta exitosa",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...rest,
                closing_date: (closing_date) ? removeDateTime(closing_date) : null
            }),
            credentials: "include"
        });
        await onGetOffer();
    }

    useEffect(() => {
        if (region != null) {
            getCities();
        }
    }, [region]);

    useEffect(() => {
        getAreas();
    }, []);

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <ScrollArea
                type="auto"
                h={450}
                pr="md">
                <LoadingOverlay visible={isLoading} />
                <Stack>
                    <CardSection
                        title="Informacion Oferta"
                        icon={Info}>
                        <Table
                            variant="vertical"
                            layout="fixed"
                            withTableBorder>
                            <Table.Tbody>
                                <Table.Tr>
                                    <Table.Th>Codigo</Table.Th>
                                    <Table.Td>{offer.code}</Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Th>Cargo</Table.Th>
                                    <Table.Td>{offer.position}</Table.Td>
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
                                    <Table.Th>Fecha Publicacion</Table.Th>
                                    <Table.Td>{parseDateToLocal(offer.publication_date).toLocaleDateString("es-CL")}</Table.Td>
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
                            </Table.Tbody>
                        </Table>
                    </CardSection>
                    <CardSection
                        title="Actualizar Informacion Oferta"
                        icon={ListBullets}>
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <Stack>
                                <TextInput
                                    label="Titulo"
                                    placeholder="Ingrese el titulo"
                                    maxLength={255}
                                    key={form.key("title")}
                                    {...form.getInputProps("title")}
                                    disabled={offer.state != OfferState.active}
                                    withAsterisk />
                                <Textarea
                                    label="Descripcion"
                                    placeholder="Ingrese la descripcion"
                                    key={form.key("description")}
                                    {...form.getInputProps("description")}
                                    disabled={offer.state != OfferState.active}
                                    rows={4} />
                                <Textarea
                                    label="Requisitos"
                                    placeholder="Ingrese los requisitos"
                                    key={form.key("requirements")}
                                    {...form.getInputProps("requirements")}
                                    disabled={offer.state != OfferState.active}
                                    rows={4} />
                                <TextInput
                                    label="Años Experiencia"
                                    placeholder="Ingrese los años de experiencia"
                                    maxLength={50}
                                    key={form.key("years_experience")}
                                    {...form.getInputProps("years_experience")}
                                    disabled={offer.state != OfferState.active} />
                                <TextInput
                                    label="Lugar"
                                    placeholder="Ingrese el lugar"
                                    maxLength={300}
                                    key={form.key("location")}
                                    {...form.getInputProps("location")}
                                    disabled={offer.state != OfferState.active} />
                                <DatePickerInput
                                    label="Fecha Cierre"
                                    placeholder="Seleccione la fecha de cierre"
                                    minDate={new Date()}
                                    key={form.key("closing_date")}
                                    {...form.getInputProps("closing_date")}
                                    disabled={offer.state != OfferState.active}
                                    withAsterisk />
                                <Select
                                    label="Region"
                                    placeholder="Seleccione una region"
                                    data={metadata.regions.map((r) => ({
                                        value: String(r.number_region),
                                        label: r.name
                                    }))}
                                    value={region}
                                    onChange={(value) => setRegion(value)}
                                    disabled={offer.state != OfferState.active}
                                    searchable
                                    clearable />
                                <Skeleton visible={citiesLoading}>
                                    {(cities) &&
                                        <Select
                                            label="Ciudad"
                                            placeholder="Selecione la ciudad"
                                            data={cities?.map((c) => ({
                                                value: String(c.city_id),
                                                label: c.name
                                            }))}
                                            disabled={!region || citiesLoading || offer.state != OfferState.active}
                                            key={form.key("city_id")}
                                            {...form.getInputProps("city_id")}
                                            searchable
                                            clearable />
                                    }
                                </Skeleton>
                                <Skeleton visible={areasLoading}>
                                    {(areas) &&
                                        <Select
                                            label="Area Desempeño"
                                            placeholder="Selecione el area de desempeño"
                                            data={areas?.map((a) => ({
                                                value: String(a.area_id),
                                                label: a.name
                                            }))}
                                            disabled={areasLoading || offer.state != OfferState.active}
                                            key={form.key("area_id")}
                                            {...form.getInputProps("area_id")}
                                            searchable
                                            clearable />
                                    }
                                </Skeleton>
                                <Select
                                    label="Tipo Contrato"
                                    placeholder="Selecione el tipo de contrato"
                                    data={metadata.contract_types?.map((c) => ({
                                        value: String(c.type_id),
                                        label: c.name
                                    }))}
                                    key={form.key("type_id")}
                                    {...form.getInputProps("type_id")}
                                    disabled={offer.state != OfferState.active}
                                    clearable />
                                <Button
                                    type="submit"
                                    disabled={offer.state != OfferState.active}>
                                    Actualizar
                                </Button>
                            </Stack>
                        </form>
                    </CardSection>
                </Stack>
            </ScrollArea>
        </Card>
    )
}