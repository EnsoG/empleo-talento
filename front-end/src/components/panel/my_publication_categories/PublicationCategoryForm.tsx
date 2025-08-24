import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack,
    TextInput
} from "@mantine/core";

import { PublicationCategory } from "../../../types";
import { publicationCategorySchema } from "../../../schemas/panelSchemas";
import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";

interface PublicationCategoryFormProps {
    type: "create" | "update";
    publicationCategory?: PublicationCategory;
    onGetCategories: () => Promise<void>;
}

export const PublicationCategoryForm = ({ type, publicationCategory, onGetCategories }: PublicationCategoryFormProps) => {
    const { closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: publicationCategory?.name ?? null
        },
        validate: zodResolver(publicationCategorySchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = publicationCategorySchema.parse(values);
        await fetchData(`${endpoints.publicationCategories}${(type == "create") ? "" : `/${publicationCategory?.category_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Categoria publicacion registrada exitosamente"
                : "Categoria publicacion registrada exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Publication Categories And Close Modal
        await onGetCategories();
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