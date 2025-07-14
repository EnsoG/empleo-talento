import { MonthPickerInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack,
    Textarea,
    TextInput
} from "@mantine/core";

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { profileEducationSchema } from "../../../schemas/portalSchemas";
import { CandidateStudy } from "../../../types";
import { parseDateToLocal } from "../../../utilities";
import { endpoints } from "../../../endpoints";

export interface EducationFormProps {
    type: "create" | "update";
    study?: CandidateStudy;
    onGetStudies: () => Promise<void>;
}

export const EducationForm = ({ type, study, onGetStudies }: EducationFormProps) => {
    const { isLoading, fetchData } = useFetch();
    const { closeModal } = useModal();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            title: study?.title ?? "",
            institution: study?.institution ?? "",
            start_date: study?.start_date ? parseDateToLocal(study.start_date) : null,
            end_date: study?.end_date ? parseDateToLocal(study.end_date) : null
        },
        validate: zodResolver(profileEducationSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = profileEducationSchema.parse(values);
        await fetchData(`${endpoints.candidateStudies}${(type == "create") ? "" : `/${study?.study_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Estudio registrado exitosamente"
                : "Estudio actualizado exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Studies And Close Modal
        await onGetStudies();
        closeModal();
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                <TextInput
                    label="Titulo"
                    placeholder="Ingrese el titulo del estudio"
                    maxLength={255}
                    key={form.key("title")}
                    {...form.getInputProps("title")}
                    withAsterisk />
                <Textarea
                    label="Institucion"
                    placeholder="Ingrese la institucion asociada al estudio"
                    key={form.key("institution")}
                    {...form.getInputProps("institution")}
                    withAsterisk
                    autosize />
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