import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack,
    TextInput
} from "@mantine/core";

import { Language } from "../../../types";
import { languageSchema } from "../../../schemas/panelSchemas";
import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";

interface LanguageFormProps {
    type: "create" | "update";
    language?: Language;
    onGetLanguages: () => Promise<void>;
}

export const LanguageForm = ({ type, language, onGetLanguages }: LanguageFormProps) => {
    const { closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: language?.name ?? null
        },
        validate: zodResolver(languageSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = languageSchema.parse(values);
        await fetchData(`${endpoints.languages}${(type == "create") ? "" : `/${language?.language_id}`}`, {
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
        // Get Languages And Close Modal
        await onGetLanguages();
        closeModal();
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                <TextInput
                    label="Nombre"
                    placeholder="Ingrese el nombre"
                    maxLength={150}
                    key={form.key("name")}
                    {...form.getInputProps("name")}
                    withAsterisk />
                <Button type="submit">{(type == "create") ? "Agregar" : "Actualizar"}</Button>
            </Stack>
        </form>
    )
}