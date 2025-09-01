import { useEffect, useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { useEditor } from "@tiptap/react";
import { RichTextEditor, Link } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { DatePickerInput } from "@mantine/dates";
import {
    Badge,
    Box,
    Button,
    Card,
    InputLabel,
    LoadingOverlay,
    ScrollArea,
    Select,
    Skeleton,
    Stack,
    Table,
    Text,
    Textarea,
    TextInput
} from "@mantine/core";
import { Info, ListBullets } from "@phosphor-icons/react";

import { useMetadata } from "../../../hooks/useMetadata";
import { useFetch } from "../../../hooks/useFetch";
import {
    City,
    ContractTypes,
    JobDays,
    JobSchedules,
    JobTypes,
    Offer,
    OfferFeaturedState,
    offerFeaturedStates,
    OfferState,
    PerformanceAreas,
    Shifts
} from "../../../types";
import { endpoints } from "../../../endpoints";
import { CLPFormatter, parseDateToLocal, removeDateTime } from "../../../utilities";
import { updateJobSchema } from "../../../schemas/panelSchemas";
import { CardSection } from "../../CardSection";

interface JobInfoProps {
    offer: Offer;
    onGetOffer: () => Promise<void>;
}

export const JobInfo = ({ offer, onGetOffer }: JobInfoProps) => {
    const { metadata } = useMetadata();
    const { data: cities, isLoading: citiesLoading, fetchData: fetchCities } = useFetch<City[]>();
    const { data: areas, isLoading: areasLoading, fetchData: fetchAreas } = useFetch<PerformanceAreas>();
    const { data: contract, isLoading: contractLoading, fetchData: fetchContracts } = useFetch<ContractTypes>();
    const { data: jobType, isLoading: jobTypeLoading, fetchData: fetchJobTypes } = useFetch<JobTypes>();
    const { data: shift, isLoading: shiftLoading, fetchData: fetchShifts } = useFetch<Shifts>();
    const { data: jobDay, isLoading: jobDayLoading, fetchData: fetchJobDays } = useFetch<JobDays>();
    const { data: schedule, isLoading: scheduleLoading, fetchData: fetchSchedules } = useFetch<JobSchedules>();
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
            type_id: String(offer.contract_type?.type_id),
            job_type_id: String(offer.job_type?.job_type_id),
            shift_id: String(offer.shift?.shift_id),
            day_id: String(offer.job_day?.day_id),
            schedule_id: String(offer.job_schedule?.schedule_id)
        },
        validate: zodResolver(updateJobSchema)
    });
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: (offer.requirements) ? offer.requirements : undefined,
        onUpdate: ({ editor }) => {
            form.setFieldValue("requirements", editor.getHTML());
        }
    });
    const getCities = async () => await fetchCities(`${endpoints.getCities}?region=${region}`, {
        method: "GET",
        credentials: "include"
    });

    const getAreas = async () => await fetchAreas(endpoints.performanceAreas, {
        method: "GET"
    });

    const getContracts = async () => await fetchContracts(endpoints.contractTypes, {
        method: "GET"
    });

    const getJobTypes = async () => await fetchJobTypes(endpoints.jobTypes, {
        method: "GET"
    });

    const getShifts = async () => await fetchShifts(endpoints.shifts, {
        method: "GET"
    });

    const getJobDays = async () => await fetchJobDays(endpoints.jobDays, {
        method: "GET"
    });

    const getSchedules = async () => await fetchSchedules(endpoints.jobSchedules, {
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
        getContracts();
        getJobTypes();
        getShifts();
        getSchedules();
        getJobDays();
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
                                 <Box>
                                    <InputLabel>
                                        Requisitos
                                    </InputLabel>
                                    <RichTextEditor editor={editor}>
                                        <RichTextEditor.Toolbar>
                                            <RichTextEditor.ControlsGroup>
                                                <RichTextEditor.Bold />
                                                <RichTextEditor.Italic />
                                                <RichTextEditor.Underline />
                                                <RichTextEditor.Strikethrough />
                                                <RichTextEditor.ClearFormatting />
                                                <RichTextEditor.Highlight />
                                                <RichTextEditor.Code />
                                            </RichTextEditor.ControlsGroup>
                                            <RichTextEditor.ControlsGroup>
                                                <RichTextEditor.H1 />
                                                <RichTextEditor.H2 />
                                                <RichTextEditor.H3 />
                                                <RichTextEditor.H4 />
                                            </RichTextEditor.ControlsGroup>
                                            <RichTextEditor.ControlsGroup>
                                                <RichTextEditor.Blockquote />
                                                <RichTextEditor.Hr />
                                                <RichTextEditor.BulletList />
                                                <RichTextEditor.OrderedList />
                                                <RichTextEditor.Subscript />
                                                <RichTextEditor.Superscript />
                                            </RichTextEditor.ControlsGroup>
                                            <RichTextEditor.ControlsGroup>
                                                <RichTextEditor.Link />
                                                <RichTextEditor.Unlink />
                                            </RichTextEditor.ControlsGroup>
                                            <RichTextEditor.ControlsGroup>
                                                <RichTextEditor.AlignLeft />
                                                <RichTextEditor.AlignCenter />
                                                <RichTextEditor.AlignJustify />
                                                <RichTextEditor.AlignRight />
                                            </RichTextEditor.ControlsGroup>
                                            <RichTextEditor.ControlsGroup>
                                                <RichTextEditor.Undo />
                                                <RichTextEditor.Redo />
                                            </RichTextEditor.ControlsGroup>
                                        </RichTextEditor.Toolbar>
                                        <RichTextEditor.Content />
                                    </RichTextEditor>
                                    {form.errors.requirements &&
                                        <Text size="sm" c="red">
                                            {form.errors.requirements}
                                        </Text>
                                    }
                                </Box>
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
                                            data={areas.performance_areas.map((a) => ({
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
                                <Skeleton visible={contractLoading}>
                                    {(contract) &&
                                        <Select
                                            label="Tipo Contrato"
                                            placeholder="Selecione el tipo de contrato"
                                            data={contract.contract_types?.map((c) => ({
                                                value: String(c.type_id),
                                                label: c.name
                                            }))}
                                            key={form.key("type_id")}
                                            {...form.getInputProps("type_id")}
                                            disabled={offer.state != OfferState.active}
                                            clearable />
                                    }
                                </Skeleton>
                                <Skeleton visible={jobTypeLoading}>
                                    {(jobType) &&
                                        <Select
                                            label="Jornada"
                                            placeholder="Selecione el tipo de jornada"
                                            data={jobType.job_types?.map((j) => ({
                                                value: String(j.job_type_id),
                                                label: j.name
                                            }))}
                                            key={form.key("job_type_id")}
                                            {...form.getInputProps("job_type_id")}
                                            disabled={offer.state != OfferState.active}
                                            clearable />
                                    }
                                </Skeleton>
                                <Skeleton visible={shiftLoading}>
                                    {(shift) &&
                                        <Select
                                            label="Turno"
                                            placeholder="Selecione el tipo de turno"
                                            data={shift.shifts?.map((s) => ({
                                                value: String(s.shift_id),
                                                label: s.name
                                            }))}
                                            key={form.key("shift_id")}
                                            {...form.getInputProps("shift_id")}
                                            disabled={offer.state != OfferState.active}
                                            clearable />
                                    }
                                </Skeleton>
                                <Skeleton visible={scheduleLoading}>
                                    {(schedule) &&
                                        <Select
                                            label="Horario"
                                            placeholder="Selecione el tipo de horario"
                                            data={schedule.job_schedules?.map((s) => ({
                                                value: String(s.schedule_id),
                                                label: s.name
                                            }))}
                                            key={form.key("schedule_id")}
                                            {...form.getInputProps("schedule_id")}
                                            disabled={offer.state != OfferState.active}
                                            clearable />
                                    }
                                </Skeleton>
                                <Skeleton visible={jobDayLoading}>
                                    {(jobDay) &&
                                        <Select
                                            label="Dia Laboral"
                                            placeholder="Selecione el dia laboral"
                                            data={jobDay.job_days?.map((d) => ({
                                                value: String(d.day_id),
                                                label: d.name
                                            }))}
                                            key={form.key("day_id")}
                                            {...form.getInputProps("day_id")}
                                            disabled={offer.state != OfferState.active}
                                            clearable />
                                    }
                                </Skeleton>
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