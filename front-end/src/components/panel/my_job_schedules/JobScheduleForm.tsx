import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack,
    TextInput
} from "@mantine/core";

import { JobSchedule } from "../../../types";
import { scheduleSchema } from "../../../schemas/panelSchemas";
import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";

interface JobScheduleFormProps {
    type: "create" | "update";
    schedule?: JobSchedule;
    onGetSchedules: () => Promise<void>;
}

export const JobScheduleForm = ({ type, schedule, onGetSchedules }: JobScheduleFormProps) => {
    const { closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: schedule?.name ?? null
        },
        validate: zodResolver(scheduleSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = scheduleSchema.parse(values);
        await fetchData(`${endpoints.jobSchedules}${(type == "create") ? "" : `/${schedule?.schedule_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Horario registrado exitosamente"
                : "Horario actualizado exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Schedules And Close Modal
        await onGetSchedules();
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