import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Select,
    Stack
} from "@mantine/core";

import { useMetadata } from "../../../hooks/useMetadata";
import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { endpoints } from "../../../endpoints";
import { createLanguageSchema, updateLanguageSchema } from "../../../schemas/portalSchemas";
import { CandidateLanguage, Language } from "../../../types";

interface LanguageFormProps {
    type: "create" | "update";
    languages?: Language[];
    candidateLanguage?: Pick<CandidateLanguage,
        "candidate_language_id" |
        "language_level"
    >;
    onGetLanguages: () => Promise<void>;
}

export const LanguageForm = ({ type, candidateLanguage, languages, onGetLanguages }: LanguageFormProps) => {
    const { metadata } = useMetadata();
    const { closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            language: "",
            level: candidateLanguage?.language_level.level_id ? String(candidateLanguage.language_level.level_id) : ""
        },
        validate: zodResolver((type == "create") ? createLanguageSchema : updateLanguageSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = (type == "create")
            ? createLanguageSchema.parse(values)
            : updateLanguageSchema.parse(values);
        await fetchData(`${endpoints.candidateLanguages}${(type == "create" ? "" : `/${candidateLanguage?.candidate_language_id}`)}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Idioma registrado exitosamente"
                : "Idioma actualizado exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Candidate Languages And Close Modal
        await onGetLanguages();
        closeModal();
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                {(type == "create") &&
                    <Select
                        label="Idioma"
                        placeholder="Seleccione el idioma"
                        data={languages?.map((l) => ({
                            value: String(l.language_id),
                            label: l.name
                        }))}
                        key={form.key("language")}
                        {...form.getInputProps("language")}
                        searchable
                        withAsterisk />
                }
                <Select
                    label="Nivel Conocimiento"
                    placeholder="Selecciona el nivel de conocimiento en relacion al idioma"
                    data={metadata.language_levels.map((l) => ({
                        value: String(l.level_id),
                        label: l.name
                    }))}
                    key={form.key("level")}
                    {...form.getInputProps("level")}
                    searchable
                    withAsterisk />
                <Button type="submit">{(type == "create") ? "Agregar" : "Actualizar"}</Button>
            </Stack>
        </form>
    )
}
