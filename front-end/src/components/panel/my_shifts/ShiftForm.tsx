import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack,
    TextInput
} from "@mantine/core";

import { Shift } from "../../../types";
import { shiftSchema } from "../../../schemas/panelSchemas";
import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";

interface ShiftFormProps {
    type: "create" | "update";
    shift?: Shift;
    onGetShifts: () => Promise<void>;
}

export const ShiftForm = ({ type, shift, onGetShifts }: ShiftFormProps) => {
    const { closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: shift?.name ?? null
        },
        validate: zodResolver(shiftSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = shiftSchema.parse(values);
        await fetchData(`${endpoints.shifts}${(type == "create") ? "" : `/${shift?.shift_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Turno registrado exitosamente"
                : "Turno actualizado exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Shifts And Close Modal
        await onGetShifts();
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