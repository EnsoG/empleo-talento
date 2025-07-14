import { useEffect } from "react";
import { z } from "zod";
import { UseFormReturnType } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import {
    NumberInput,
    Select,
    Stack,
    Switch,
    Textarea,
    TextInput
} from "@mantine/core";

import { useMetadata } from "../../../hooks/useMetadata";
import { useFetch } from "../../../hooks/useFetch";
import {
    City,
    GenericPosition,
    jobDays,
    JobSchedules,
    jobTypes,
    PerformanceArea,
    shifts
} from "../../../types";
import { endpoints } from "../../../endpoints";
import { publishJobFullSchema } from "../../../schemas/panelSchemas";

interface PublishJobFormOneProps {
    form: UseFormReturnType<z.infer<typeof publishJobFullSchema>>;
    positions: GenericPosition[];
    areas: PerformanceArea[];
}

export const PublishJobFormOne = ({ form, positions, areas }: PublishJobFormOneProps) => {
    const { metadata } = useMetadata();
    const { data: cities, isLoading: citiesLoading, fetchData: fetchCities } = useFetch<City[]>();
    const { data: schedules, isLoading: schedulesLoading, fetchData: fetchSchedules } = useFetch<JobSchedules>();

    const getCities = async () => await fetchCities(`${endpoints.getCities}?region=${form.values.region}`, {
        method: "GET",
        credentials: "include"
    });

    const getSchedules = async () => await fetchSchedules(endpoints.jobSchedules, {
        method: "GET"
    });

    useEffect(() => {
        if (form.values.region != "" && form.values.region != null) getCities();
    }, [form.values.region]);

    useEffect(() => {
        getSchedules();
    }, []);

    return (
        <Stack>
            <TextInput
                label="Titulo"
                placeholder="Ingrese el titulo del empleo"
                maxLength={255}
                key={form.key("title")}
                {...form.getInputProps("title")}
                withAsterisk />
            <Switch
                label="Cargo generico"
                checked={form.values.has_generic_position}
                key={form.key("has_generic_position")}
                {...form.getInputProps("has_generic_position")}
                onChange={(e) => form.setFieldValue("has_generic_position", e.currentTarget.checked)} />
            {(form.values.has_generic_position) &&
                <Select
                    label="Cargo Generico"
                    placeholder="Seleccione el cargo generico"
                    data={positions?.map((p) => ({
                        value: String(p.position_id),
                        label: p.name
                    }))}
                    key={form.key("generic_position_id")}
                    {...form.getInputProps("generic_position_id")}
                    searchable
                    withAsterisk />
            }
            <TextInput
                label="Cargo"
                placeholder="Ingrese el cargo"
                key={form.key("position")}
                {...form.getInputProps("position")}
                withAsterisk />
            <Textarea
                label="Descripcion"
                placeholder="Ingrese la descripcion"
                key={form.key("description")}
                {...form.getInputProps("description")}
                rows={4} />
            <Textarea
                label="Requisitos"
                placeholder="Ingrese los requisitos"
                key={form.key("requirements")}
                {...form.getInputProps("requirements")}
                rows={4} />
            <TextInput
                label="Años Experiencia"
                placeholder="Ingrese los años de experiencia"
                key={form.key("years_experience")}
                {...form.getInputProps("years_experience")} />
            <NumberInput
                label="Salario Liquido"
                placeholder="Ingrese el salario"
                prefix="$"
                key={form.key("salary")}
                {...form.getInputProps("salary")}
                thousandSeparator={true}
                allowNegative={false}
                allowDecimal={false}
                hideControls />
            <TextInput
                label="Lugar"
                placeholder="Ingrese el lugar"
                key={form.key("location")}
                {...form.getInputProps("location")} />
            <DatePickerInput
                label="Fecha Publicacion"
                placeholder="Seleccione la fecha de publicacion"
                minDate={new Date()}
                key={form.key("publication_date")}
                {...form.getInputProps("publication_date")}
                withAsterisk />
            <DatePickerInput
                label="Fecha Cierre"
                placeholder="Seleccione la fecha de cierre"
                minDate={new Date()}
                key={form.key("closing_date")}
                {...form.getInputProps("closing_date")}
                clearable />
            <Select
                label="Area Desempeño"
                placeholder="Selecione el area de desempeño"
                data={areas?.map((a) => ({
                    value: String(a.area_id),
                    label: a.name
                }))}
                key={form.key("area_id")}
                {...form.getInputProps("area_id")}
                searchable
                clearable />
            <Select
                label="Region"
                placeholder="Selecione la region"
                data={metadata.regions?.map((r) => ({
                    value: String(r.number_region),
                    label: r.name
                }))}
                key={form.key("region")}
                {...form.getInputProps("region")}
                searchable
                clearable />
            <Select
                label="Ciudad"
                placeholder="Selecione la ciudad"
                data={cities?.map((c) => ({
                    value: String(c.city_id),
                    label: c.name
                }))}
                disabled={!form.values.region || citiesLoading}
                key={form.key("city_id")}
                {...form.getInputProps("city_id")}
                searchable
                clearable />
            <Select
                label="Tipo Contrato"
                placeholder="Selecione el tipo de contrato"
                data={metadata.contract_types?.map((c) => ({
                    value: String(c.type_id),
                    label: c.name
                }))}
                key={form.key("type_id")}
                {...form.getInputProps("type_id")}
                searchable
                clearable />
            <Select
                label="Tipo Jornada"
                placeholder="Selecione el tipo de jornada"
                data={jobTypes}
                key={form.key("job_type")}
                {...form.getInputProps("job_type")}
                searchable
                clearable />
            <Select
                label="Turno"
                placeholder="Selecione el turno"
                data={shifts}
                key={form.key("shift")}
                {...form.getInputProps("shift")}
                searchable
                clearable />
            <Select
                label="Dias Laborales"
                placeholder="Selecione los dias laborales"
                data={jobDays}
                key={form.key("job_day")}
                {...form.getInputProps("job_day")}
                searchable
                clearable />
            <Select
                label="Horario Jornada"
                placeholder="Selecione el horario de jornada"
                data={schedules?.job_schedules.map((s) => ({
                    value: String(s.schedule_id),
                    label: s.name
                }))}
                disabled={schedulesLoading}
                key={form.key("schedule_id")}
                {...form.getInputProps("schedule_id")}
                searchable
                clearable />
        </Stack>
    )
}