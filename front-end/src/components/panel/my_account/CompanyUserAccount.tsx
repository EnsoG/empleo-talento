import { useEffect } from "react";
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

import { useFetch } from "../../../hooks/useFetch";
import { CompanyUser } from "../../../types";
import { endpoints } from "../../../endpoints";
import { useForm, zodResolver } from "@mantine/form";
import { companyUserInfoSchema } from "../../../schemas/panelSchemas";

export const CompanyUserAccount = () => {
    const { data: companyUser, isLoading: companyUserLoading, fetchData: fetchCompanyUser } = useFetch<CompanyUser>();
    const { isLoading: updateLoading, fetchData: fetchUpdate } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        validate: zodResolver(companyUserInfoSchema)
    });

    const getCompanyUser = async () => await fetchCompanyUser(endpoints.companyUsers, {
        method: "GET",
        credentials: "include"
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Data And Do Request
        const data = companyUserInfoSchema.parse(values);
        await fetchUpdate(`${endpoints.companyUsers}/${companyUser?.user_id}`, {
            showNotifications: true,
            successMessage: "Actualizacion de datos personales exitosa",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Company User And Close Modal
        await getCompanyUser();
    }

    useEffect(() => {
        getCompanyUser();
    }, []);

    useEffect(() => {
        if (companyUser) {
            form.setValues({
                name: companyUser.name,
                paternal: companyUser.paternal,
                maternal: companyUser.maternal
            });
        }
    }, [companyUser]);

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <Text c="blue" size="md" fw="bold">Informacion Personal</Text>
            <Divider my="sm" />
            <Skeleton
                height="100%"
                visible={companyUserLoading}>
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
                        <TextInput
                            label="Numero Telefonico"
                            placeholder="Ingrese el numero telefonico"
                            maxLength={15}
                            key={form.key("phone")}
                            {...form.getInputProps("phone")}
                            withAsterisk />
                        <Button type="submit">Actualizar</Button>
                    </Stack>
                </form>
            </Skeleton>
        </Card>
    )
}