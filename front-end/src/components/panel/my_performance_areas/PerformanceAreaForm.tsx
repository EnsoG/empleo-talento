import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack,
    TextInput
} from "@mantine/core";

import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { PerformanceArea } from "../../../types";
import { performanceAreaSchema } from "../../../schemas/panelSchemas";
import { endpoints } from "../../../endpoints";

interface PerformanceAreaFormProps {
    type: "create" | "update";
    performanceArea?: PerformanceArea;
    onGetAreas: () => Promise<void>;
}

export const PerformanceAreaForm = ({ type, performanceArea, onGetAreas }: PerformanceAreaFormProps) => {
    const { closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: performanceArea?.name ?? null
        },
        validate: zodResolver(performanceAreaSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = performanceAreaSchema.parse(values);
        await fetchData(`${endpoints.performanceAreas}${(type == "create") ? "" : `/${performanceArea?.area_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Area desempeño registrada exitosamente"
                : "Area desmepeño actualizada exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Performance Areas And Close Modal
        await onGetAreas();
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