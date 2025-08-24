import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack,
    TextInput
} from "@mantine/core";

import { JobDay } from "../../../types";
import { jobDaySchema } from "../../../schemas/panelSchemas";
import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";

interface JobDayFormProps {
    type: "create" | "update";
    jobDay?: JobDay;
    onGetDays: () => Promise<void>;
}

export const JobDayForm = ({ type, jobDay, onGetDays }: JobDayFormProps) => {
    const { closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: jobDay?.name ?? null
        },
        validate: zodResolver(jobDaySchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = jobDaySchema.parse(values);
        await fetchData(`${endpoints.jobDays}${(type == "create") ? "" : `/${jobDay?.day_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Dia laboral registrado exitosamente"
                : "Dia laboral actualizado exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Job Days And Close Modal
        await onGetDays();
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