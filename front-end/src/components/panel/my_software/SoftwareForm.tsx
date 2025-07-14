import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack,
    TextInput
} from "@mantine/core";

import { Software } from "../../../types";
import { softwareSchema } from "../../../schemas/panelSchemas";
import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";

interface SoftwareFormProps {
    type: "create" | "update";
    software?: Software;
    onGetSoftwares: () => Promise<void>;
}

export const SoftwareForm = ({ type, software, onGetSoftwares }: SoftwareFormProps) => {
    const { closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: software?.name ?? null
        },
        validate: zodResolver(softwareSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = softwareSchema.parse(values);
        await fetchData(`${endpoints.softwares}${(type == "create") ? "" : `/${software?.software_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Software registrado exitosamente"
                : "Software actualizado exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Softwares And Close Modal
        await onGetSoftwares();
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