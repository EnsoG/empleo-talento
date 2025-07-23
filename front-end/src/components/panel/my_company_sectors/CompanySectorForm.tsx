import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack,
    TextInput
} from "@mantine/core";

import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { CompanySector } from "../../../types";
import { endpoints } from "../../../endpoints";
import { companySectorSchema } from "../../../schemas/panelSchemas";

interface CompanySectorFormProps {
    type: "create" | "update";
    companySector?: CompanySector;
    onGetSectors: () => Promise<void>;
}

export const CompanySectorForm = ({ type, companySector, onGetSectors }: CompanySectorFormProps) => {
    const { closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: companySector?.name ?? null
        },
        validate: zodResolver(companySectorSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = companySectorSchema.parse(values);
        await fetchData(`${endpoints.companySectors}${(type == "create") ? "" : `/${companySector?.sector_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Sector empresarial registrado exitosamente"
                : "Sector empresarial actualizado exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Company Sectors And Close Modal
        await onGetSectors();
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