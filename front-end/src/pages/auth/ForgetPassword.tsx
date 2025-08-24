import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    Center,
    LoadingOverlay,
    Select,
    Stack,
    Text,
    TextInput
} from "@mantine/core";

import { useFetch } from "../../hooks/useFetch";
import { AppPaths, userRoles } from "../../types";
import { forgetPasswordSchema } from "../../schemas/authSchemas";
import { AuthLayout } from "../../layouts/AuthLayout";
import { endpoints } from "../../endpoints";

export const ForgetPassword = () => {
    const navigate = useNavigate();
    const { isLoading, isSuccess, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            user_role: ""
        },
        validate: zodResolver(forgetPasswordSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = forgetPasswordSchema.parse(values);
        await fetchData(endpoints.forgetPassword, {
            showNotifications: true,
            successMessage: "Solicitud de cambio de contraseña exitosa, se envio un correo electronico con las instrucciones",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    }
    // If Request Successfuly Redirect
    useEffect(() => {
        if (isSuccess) navigate(AppPaths.login);
    }, [isSuccess]);

    return (
        <AuthLayout title="Restablecer Contraseña">
            <Text
                size="sm"
                mb="md">
                Ingrese el correo electronico con el cual esta registrado su cuenta, se le enviara un correo con las instrucciones respectivas
            </Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <LoadingOverlay visible={isLoading} />
                <Stack>
                    <TextInput
                        label="Correo Electronico"
                        placeholder="Ingrese su correo electronico"
                        key={form.key("email")}
                        {...form.getInputProps("email")}
                        withAsterisk />
                    <Select
                        label="Tipo Usuario"
                        placeholder="Ingrese su tipo de usuario"
                        data={userRoles.slice(0, 2).map((role) => ({
                            value: String(role.value),
                            label: role.name
                        }))}
                        key={form.key("user_role")}
                        {...form.getInputProps("user_role")}
                        withAsterisk />
                    <Button
                        type="submit">
                        Enviar
                    </Button>
                </Stack>
            </form>
            <Center mt="md">
                <Link
                    className="react-link-primary"
                    to={AppPaths.login}>
                    Volver
                </Link>
            </Center>
        </AuthLayout>
    )
}