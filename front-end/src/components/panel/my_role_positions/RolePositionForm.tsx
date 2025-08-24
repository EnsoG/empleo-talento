import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack,
    TextInput
} from "@mantine/core";

import { RolePosition } from "../../../types";
import { languageSchema, rolePositionSchema } from "../../../schemas/panelSchemas";
import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";

interface RolePositionFormProps {
    type: "create" | "update";
    rolePosition?: RolePosition;
    onGetRoles: () => Promise<void>;
}

export const RolePositionForm = ({ type, rolePosition, onGetRoles }: RolePositionFormProps) => {
    const { closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: rolePosition?.name ?? null
        },
        validate: zodResolver(rolePositionSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = languageSchema.parse(values);
        await fetchData(`${endpoints.rolePositions}${(type == "create") ? "" : `/${rolePosition?.role_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Rol cargo registrado exitosamente"
                : "Rol cargo actualizado exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Role Positions And Close Modal
        await onGetRoles();
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