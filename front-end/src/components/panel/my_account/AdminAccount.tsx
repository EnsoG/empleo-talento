import { useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    Card,
    Divider,
    LoadingOverlay,
    Skeleton,
    Stack,
    Text,
    TextInput
} from "@mantine/core";

import { useAuth } from "../../../hooks/useAuth";
import { useFetch } from "../../../hooks/useFetch";
import { Admin } from "../../../types";
import { endpoints } from "../../../endpoints";
import { adminInfoSchema } from "../../../schemas/panelSchemas";

export const AdminAccount = () => {
    const { user } = useAuth();
    const { data: admin, isLoading: adminLoading, fetchData: fetchAdmin } = useFetch<Admin>();
    const { isLoading: updateLoading, fetchData: updateAdmin } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        validate: zodResolver(adminInfoSchema)
    });

    const getAdmin = async () => await fetchAdmin(`${endpoints.adminUsers}/${user?.sub}`, {
        method: "GET",
        credentials: "include"
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = adminInfoSchema.parse(values);
        await updateAdmin(`${endpoints.adminUsers}/${admin?.admin_id}`, {
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
        await getAdmin();
    }

    useEffect(() => {
        getAdmin();
    }, []);

    useEffect(() => {
        if (admin) {
            form.setValues({
                name: admin.name,
                paternal: admin.paternal,
                maternal: admin.maternal
            });
        }
    }, [admin]);

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <Text c="blue" size="md" fw="bold">Informacion Personal</Text>
            <Divider my="sm" />
            <Skeleton
                height="100%"
                visible={adminLoading}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <LoadingOverlay visible={updateLoading} />
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
            </Skeleton>
        </Card>
    )
}