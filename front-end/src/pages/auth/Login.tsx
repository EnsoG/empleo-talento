import { useState } from "react";
import { Link } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
    TextInput,
    Stack,
    Button,
    Group,
    PasswordInput,
    Select,
    Box,
    LoadingOverlay,
    Divider
} from "@mantine/core";
import { FacebookLogo, GoogleLogo } from "@phosphor-icons/react";

import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import { useFacebookSDK } from "../../hooks/useFacebookSDK";
import { AppPaths, userRoles } from "../../types";
import { endpoints } from "../../endpoints";
import { loginSchema } from "../../schemas/authSchemas"
import { AuthLayout } from "../../layouts/AuthLayout";

type GoogleProfile = {
    sub: string;
    email: string;
    email_verified: boolean;
    family_name: string;
    given_name: string;
    name: string;
    picture: string;
}

type FacebookProfile = {
    id: string;
    email: string;
    name: string;
}

export const Login = () => {
    const { checkAuth } = useAuth();
    useFacebookSDK(import.meta.env.VITE_FACEBOOK_APP_ID);
    const { isLoading, fetchData } = useFetch();
    const [oAuthLoading, setOAuthLoading] = useState(false);
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            email: "",
            password: "",
            user_role: ""
        },
        validate: zodResolver(loginSchema)
    });

    const loginGoogle = useGoogleLogin({
        onSuccess: async (token) => {
            // Get Google Account Information
            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: {
                    Authorization: `Bearer ${token.access_token}`,
                },
            });
            const profile: GoogleProfile = await res.json();
            // Check If Email Is Verified
            if (!profile.email_verified) {
                setOAuthLoading(false);
                notifications.show({
                    color: "red",
                    title: "Ha Ocurrido Un Error",
                    message: "No se ha podido iniciar sesion con Google",
                    withBorder: true
                });
                return;
            }
            // Do Request
            await fetchData(endpoints.loginOAuth, {
                showNotifications: true,
                successMessage: "Inicio de sesion exitoso",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: profile.given_name,
                    paternal: profile.family_name,
                    email: profile.email
                }),
                credentials: "include"
            });
            setOAuthLoading(false);
            await checkAuth();
        },
        onError: () => {
            notifications.show({
                color: "red",
                title: "Ha Ocurrido Un Error",
                message: "No se ha podido iniciar sesion con Google",
                withBorder: true
            });
        },
        scope: "profile email"
    });

    const handleGoogle = async () => {
        setOAuthLoading(true);
        loginGoogle();
    }

    const handleFacebook = () => {
        setOAuthLoading(true);
        window.FB.login(
            (response: any) => {
                if (response.authResponse) {
                    const accessToken = response.authResponse.accessToken;
                    window.FB.api(
                        "/me",
                        { fields: "id,name,email", access_token: accessToken },
                        async (profile: FacebookProfile) => {
                            // Split First And Last Name
                            const username = profile.name.split(" ");
                            // Do Request
                            await fetchData(endpoints.loginOAuth, {
                                successTitle: "Bienvenido Nuevamente",
                                successMessage: "Inicio de sesion exitoso",
                                showNotifications: true,
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    name: username[0],
                                    paternal: username[1],
                                    email: profile.email
                                }),
                                credentials: "include"
                            });
                            setOAuthLoading(false);
                            await checkAuth();
                        }
                    );
                } else {
                    setOAuthLoading(false);
                    notifications.show({
                        color: "red",
                        title: "Ha Ocurrido Un Error",
                        message: "No se ha podido iniciar sesion con Facebook",
                        withBorder: true
                    });
                }
            },
            { scope: "public_profile,email" }
        );
    };

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values, Do Login And Check Auth
        const data = loginSchema.parse(values);
        await fetchData(endpoints.login, {
            showNotifications: true,
            successTitle: "Bienvenido Nuevamente",
            successMessage: "Inicio de sesion exitoso",
            successRedirect: AppPaths.home,
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
                <LoadingOverlay visible={isLoading || oAuthLoading} />
                <Stack>
                    <Button
                        variant="outline"
                        leftSection={<GoogleLogo />}
                        onClick={() => handleGoogle()}>
                        Iniciar con Google
                    </Button>
                    <Button
                        variant="outline"
                        leftSection={<FacebookLogo />}
                        onClick={handleFacebook}>
                        Iniciar con Facebook
                    </Button>
                </Stack>
                <Divider my="md" />
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
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
                        <Button
                            type="submit">
                            Iniciar Sesion
                        </Button>
                        <Group justify="space-evenly">
                            <Link
                                className="react-link-primary"
                                to={AppPaths.registerCandidate}>
                                ¿No Estas Registrado?
                            </Link>
                            <Link
                                className="react-link-primary"
                                to={AppPaths.forgetPassword}>
                                ¿Olvidaste Tu Contraseña?
                            </Link>
                        </Group>
                    </Stack>
                </form>
            </Box>
        </AuthLayout>
    )
}