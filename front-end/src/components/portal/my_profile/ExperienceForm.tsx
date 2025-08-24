import { useForm, zodResolver } from "@mantine/form";
import { MonthPickerInput } from "@mantine/dates";
import {
    Button,
    LoadingOverlay,
    Stack,
    Textarea,
    TextInput
} from "@mantine/core";

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { WorkExperience } from "../../../types";
import { profileExperienceSchema } from "../../../schemas/portalSchemas";
import { parseDateToLocal } from "../../../utilities";
import { endpoints } from "../../../endpoints";

interface ExperienceFormProps {
    type: "create" | "update";
    experience?: WorkExperience;
    onGetExperiences: () => Promise<void>;
}

export const ExperienceForm = ({ type, experience, onGetExperiences }: ExperienceFormProps) => {
    const { isLoading, fetchData } = useFetch();
    const { closeModal } = useModal();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            position: experience?.position ?? "",
            description: experience?.description ?? "",
            company: experience?.company ?? "",
            start_date: experience?.start_date ? parseDateToLocal(experience.start_date) : null,
            end_date: experience?.end_date ? parseDateToLocal(experience.end_date) : null
        },
        validate: zodResolver(profileExperienceSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = profileExperienceSchema.parse(values);
        await fetchData(`${endpoints.candidateWorkExperiences}${(type == "create") ? "" : `/${experience?.experience_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Experiencia laboral registrada exitosamente"
                : "Experiencia laboral actualizada exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Work Experiences And Close Modal
        await onGetExperiences();
        closeModal();
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                <TextInput
                    label="Nombre Puesto"
                    placeholder="Ingrese el nombre del puesto"
                    maxLength={150}
                    key={form.key("position")}
                    {...form.getInputProps("position")}
                    withAsterisk />
                <Textarea
                    label="Descripcion"
                    placeholder="Ingrese una pequeña descripcion"
                    key={form.key("description")}
                    {...form.getInputProps("description")}
                    rows={4} />
                <TextInput
                    label="Empresa"
                    placeholder="Ingrese el nombre de la empresa"
                    maxLength={255}
                    key={form.key("company")}
                    {...form.getInputProps("company")} />
                <MonthPickerInput
                    label="Fecha de Inicio"
                    placeholder="Ingrese la fecha de inicio"
                    maxDate={new Date()}
                    key={form.key("start_date")}
                    {...form.getInputProps("start_date")}
                    withAsterisk />
                <MonthPickerInput
                    label="Fecha de Fin"
                    placeholder="Ingrese la fecha de fin"
                    maxDate={new Date()}
                    key={form.key("end_date")}
                    {...form.getInputProps("end_date")}
                    clearable />
                <Button type="submit">{(type == "create") ? "Agregar" : "Actualizar"}</Button>
            </Stack>
        </form>
    )
}