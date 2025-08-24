import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Select,
    Skeleton,
    Stack,
    TextInput
} from "@mantine/core";

import { GenericPosition, RolePositions } from "../../../types";
import { genericPositionSchema } from "../../../schemas/panelSchemas";
import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { useEffect } from "react";

interface GenericPositionFormProps {
    type: "create" | "update";
    genericPosition?: GenericPosition;
    onGetPositions: () => Promise<void>;
}

export const GenericPositionForm = ({ type, genericPosition, onGetPositions }: GenericPositionFormProps) => {
    const { closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const { data, isLoading: rolesLoading, fetchData: fetchRoles } = useFetch<RolePositions>();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: genericPosition?.name ?? "",
            role_id: genericPosition?.role_position ? String(genericPosition.role_position.role_id) : ""
        },
        validate: zodResolver(genericPositionSchema)
    });

    const getRoles = async () => await fetchRoles(endpoints.rolePositions, {
        method: "GET"
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = genericPositionSchema.parse(values);
        await fetchData(`${endpoints.genericPositions}${(type == "create") ? "" : `/${genericPosition?.position_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Cargo generico registrado exitosamente"
                : "Cargo generico actualizado exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Generic Positions And Close Modal
        await onGetPositions();
        closeModal();
    }

    useEffect(() => {
        getRoles();
    }, []);

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
                <Skeleton visible={rolesLoading}>
                    {(data) &&
                        <Select
                            label="Rol Cargo"
                            placeholder="Selecione el rol cargo"
                            data={data.role_positions.map((r) => ({
                                value: String(r.role_id),
                                label: r.name
                            }))}
                            key={form.key("role_id")}
                            {...form.getInputProps("role_id")}
                            allowDeselect={false}
                            searchable
                            withAsterisk />
                    }
                </Skeleton>
                <Button type="submit">{(type == "create") ? "Agregar" : "Actualizar"}</Button>
            </Stack>
        </form>
    )
}