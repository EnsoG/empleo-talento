import { useForm, zodResolver } from "@mantine/form";
import {
    Box,
    Button,
    LoadingOverlay,
    PasswordInput,
    Stack,
    TextInput
} from "@mantine/core";

import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import { UserRole } from "../../types";
import { endpoints } from "../../endpoints";
import { loginSchema } from "../../schemas/authSchemas";
import { AuthLayout } from "../../layouts/AuthLayout"

export const AdminLogin = () => {
    const { checkAuth } = useAuth();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            password: "",
            user_role: String(UserRole.admin)
        },
        validate: zodResolver(loginSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values, Do Login And Check Auth
        const data = loginSchema.parse(values);
        await fetchData(endpoints.login, {
            showNotifications: true,
            successMessage: "Inicio de sesion exitoso",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        await checkAuth();
    }

    return (
        <AuthLayout title="Iniciar Sesion">
            <Box pos="relative">
                <LoadingOverlay visible={isLoading} />
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            label="Correo Electronico"
                            placeholder="Ingrese su correo electronico"
                            key={form.key("email")}
                            {...form.getInputProps("email")}
                            withAsterisk />
                        <PasswordInput
                            label="Contraseña"
                            placeholder="Ingrese su contraseña"
                            key={form.key("password")}
                            {...form.getInputProps("password")}
                            withAsterisk />
                        <Button type="submit">Iniciar Sesion</Button>
                    </Stack>
                </form>
            </Box>
        </AuthLayout>
    )
}