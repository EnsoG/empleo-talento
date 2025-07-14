import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack,
    TextInput
} from "@mantine/core";

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { Admin } from "../../../types";
import { endpoints } from "../../../endpoints";
import { adminInfoSchema } from "../../../schemas/panelSchemas";

interface AdminInfoFormProps {
    admin: Pick<Admin,
        "admin_id" |
        "name" |
        "paternal" |
        "maternal"
    >
    onGetAdmin: () => Promise<void>;
}

export const AdminInfoForm = ({ admin, onGetAdmin }: AdminInfoFormProps) => {
    const { isLoading, fetchData } = useFetch();
    const { closeModal } = useModal();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: admin.name,
            paternal: admin.paternal,
            maternal: admin.maternal
        },
        validate: zodResolver(adminInfoSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = adminInfoSchema.parse(values);
        await fetchData(`${endpoints.adminUsers}/${admin.admin_id}`, {
            showNotifications: true,
            successMessage: "Actualizacion de datos personales exitosa",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Admin And Close Modal
        await onGetAdmin();
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
                <TextInput
                    label="Apellido Paterno"
                    placeholder="Ingrese el apellido paterno"
                    maxLength={150}
                    key={form.key("paternal")}
                    {...form.getInputProps("paternal")}
                    withAsterisk />
                <TextInput
                    label="Apellido Materno"
                    placeholder="Ingrese el apellido materno"
                    maxLength={150}
                    key={form.key("maternal")}
                    {...form.getInputProps("maternal")} />
                <Button type="submit">Actualizar</Button>
            </Stack>
        </form>
    )
}