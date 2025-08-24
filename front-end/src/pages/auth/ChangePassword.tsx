import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    PasswordInput,
    Stack,
    Text
} from "@mantine/core";

import { useFetch } from "../../hooks/useFetch";
import { AppPaths } from "../../types";
import { endpoints } from "../../endpoints";
import { changePasswordSchema } from "../../schemas/authSchemas";
import { AuthLayout } from "../../layouts/AuthLayout";

export const ChangePassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isLoading, isSuccess, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            password: "",
            confirm_password: ""
        },
        validate: zodResolver(changePasswordSchema)
    });
    const token = searchParams.get("token");

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = changePasswordSchema.parse(values);
        await fetchData(endpoints.changePassword, {
            showNotifications: true,
            successMessage: "Cambio de contraseña exitoso",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...data,
                token
            })
        });
    }
    // If Request Successfuly Redirect
    useEffect(() => {
        if (isSuccess) navigate(AppPaths.login)
    }, [isSuccess]);

    return (
        <AuthLayout title="Cambiar Contraseña">
            <Text
                size="sm"
                mb="md">
                Ingrese su nueva contraseña para actualizarla y asi volver a tener acceso a su cuenta en Empleo Talento
            </Text>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <LoadingOverlay visible={isLoading} />
                <Stack>
                    <PasswordInput
                        label="Contraseña"
                        placeholder="Ingrese su nueva contraseña"
                        description="6 Caracteres minimo y alfanumerica (Letras y Numeros)"
                        key={form.key("password")}
                        {...form.getInputProps("password")}
                        withAsterisk />
                    <PasswordInput
                        label="Confirmar Contraseña"
                        placeholder="Ingrese nuevamente su nueva contraseña"
                        key={form.key("confirm_password")}
                        {...form.getInputProps("confirm_password")}
                        withAsterisk />
                    <Button type="submit">Cambiar Contraseña</Button>
                </Stack>
            </form>
        </AuthLayout>
    )
}