import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    Checkbox,
    LoadingOverlay,
    Group,
    PasswordInput,
    ScrollArea,
    SimpleGrid,
    Stack,
    TextInput
} from "@mantine/core";

import { useFetch } from "../../hooks/useFetch";
import { AppPaths } from "../../types";
import { endpoints } from "../../endpoints";
import { registerCandidateSchema } from "../../schemas/authSchemas";
import { AuthLayout } from "../../layouts/AuthLayout";

export const RegisterCandidate = () => {
    const navigate = useNavigate();
    const { isLoading, isSuccess, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            paternal: "",
            maternal: "",
            email: "",
            run: "",
            password: "",
            confirm_password: "",
            terms_policies: false
        },
        validate: zodResolver(registerCandidateSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = registerCandidateSchema.parse(values);
        await fetchData(endpoints.registerCandidate, {
            showNotifications: true,
            successMessage: "Registro de usuario exitoso",
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
    }, [isSuccess,]);

    return (
        <AuthLayout title="Registro Candidato">
            <LoadingOverlay visible={isLoading} />
            <Group mb="md" justify="space-evenly">
                <Link
                    className="react-link-primary"
                    to={AppPaths.registerCompany}>
                    ¿Eres Empresa?
                </Link>
                <Link
                    className="react-link-primary"
                    to={AppPaths.login}>
                    ¿Estas Registrado?
                </Link>
            </Group>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <ScrollArea.Autosize
                    type="auto"
                    mah={400}>
                    <Stack pr="md">
                        <TextInput
                            label="Nombre"
                            placeholder="Ingrese su nombre"
                            maxLength={150}
                            key={form.key("name")}
                            {...form.getInputProps("name")}
                            withAsterisk />
                        <SimpleGrid cols={{ base: 1, md: 2 }}>
                            <TextInput
                                label="Apellido Paterno"
                                placeholder="Ingrese su apellido paterno"
                                maxLength={150}
                                key={form.key("paternal")}
                                {...form.getInputProps("paternal")}
                                withAsterisk />
                            <TextInput
                                label="Apellido Materno"
                                placeholder="Ingrese su apellido materno"
                                maxLength={150}
                                key={form.key("maternal")}
                                {...form.getInputProps("maternal")} />
                        </SimpleGrid>
                        <TextInput
                            label="RUT"
                            placeholder="Ingrese su rut"
                            description="Ejemplo: 11.111.111-1"
                            maxLength={13}
                            key={form.key("run")}
                            {...form.getInputProps("run")}
                            withAsterisk />
                        <TextInput
                            label="Correo Electronico"
                            placeholder="Ingrese su correo electronico"
                            maxLength={255}
                            key={form.key("email")}
                            {...form.getInputProps("email")}
                            withAsterisk />
                        <PasswordInput
                            label="Contraseña"
                            description="6 Caracteres minimo y alfanumerica (Letras y Numeros)"
                            placeholder="Ingrese su contraseña"
                            key={form.key("password")}
                            {...form.getInputProps("password")}
                            withAsterisk />
                        <PasswordInput
                            label="Confirmar Contraseña"
                            placeholder="Ingrese nuevamente su contraseña"
                            key={form.key("confirm_password")}
                            {...form.getInputProps("confirm_password")}
                            withAsterisk />
                    </Stack>
                </ScrollArea.Autosize>
                <Checkbox
                    mt="md"
                    label={
                        <>
                            He leido y aceptado los <Link className="react-link-primary" to={""}>terminos y condiciones</Link> como tambien las <Link className="react-link-primary" to={""}>politicas de privacidad</Link>
                        </>
                    }
                    key={form.key("terms_policies")}
                    {...form.getInputProps("terms_policies")} />
                <Button
                    mt="md"
                    type="submit"
                    fullWidth>
                    Crear Cuenta
                </Button>
            </form>
        </AuthLayout>
    )
}