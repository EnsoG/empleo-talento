import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { Button, LoadingOverlay, Select, Stack } from "@mantine/core";

import { Postulation, PostulationState } from "../../../types";
import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";

interface PostulationStateFormProps {
    postulationId: Postulation["postulation_id"];
    state: Postulation["state"];
    onGetPostulations: () => Promise<void>;
}

export const PostulationStateForm = ({ postulationId, state, onGetPostulations }: PostulationStateFormProps) => {
    const { isLoading, fetchData } = useFetch();
    const { closeModal } = useModal();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            state: state
        },
        validate: zodResolver(z.object({
            state: z.string().nonempty({ message: "Seleccionar el estado de la postulacion es obligatorio" })
        }))
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Do Request
        await fetchData(`${endpoints.postulations}/${postulationId}`, {
            showNotifications: true,
            successMessage: "Estado de postulante actualizado exitosamente",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values),
            credentials: "include"
        });
        // Get Postulations And Close Modal
        await onGetPostulations();
        closeModal();
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                <Select
                    label="Estado"
                    placeholder="Seleccione el estado"
                    data={Object.values(PostulationState)}
                    key={form.key("state")}
                    {...form.getInputProps("state")}
                    withAsterisk />
                <Button type="submit">Actualizar</Button>
            </Stack>
        </form>
    )
}