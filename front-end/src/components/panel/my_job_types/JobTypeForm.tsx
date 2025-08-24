import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack,
    TextInput
} from "@mantine/core";

import { JobType } from "../../../types";
import { jobTypeSchema } from "../../../schemas/panelSchemas";
import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";

interface JobTypeFormProps {
    type: "create" | "update";
    jobType?: JobType;
    onGetJobTypes: () => Promise<void>;
}

export const JobTypeForm = ({ type, jobType, onGetJobTypes }: JobTypeFormProps) => {
    const { closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: jobType?.name ?? ""
        },
        validate: zodResolver(jobTypeSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = jobTypeSchema.parse(values);
        await fetchData(`${endpoints.jobTypes}${(type == "create") ? "" : `/${jobType?.job_type_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Jornada registrada exitosamente"
                : "Jornada actualizada exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Job Types And Close Modal
        await onGetJobTypes();
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