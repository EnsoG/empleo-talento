import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    Checkbox,
    Divider,
    Group,
    PasswordInput,
    ScrollArea,
    LoadingOverlay,
    Select,
    SimpleGrid,
    Stack,
    TextInput
} from "@mantine/core";

import { useFetch } from "../../hooks/useFetch";
import { AppPaths, CompanySectors } from "../../types";
import { endpoints } from "../../endpoints";
import { registerCompanySchema } from "../../schemas/authSchemas";
import { AuthLayout } from "../../layouts/AuthLayout";

export const RegisterCompany = () => {
    const navigate = useNavigate()
    const { isLoading, isSuccess, fetchData } = useFetch();
    const { data, isLoading: sectorsLoading, fetchData: fetchSectors } = useFetch<CompanySectors>();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            paternal: "",
            maternal: "",
            phone: "",
            email: "",
            password: "",
            confirm_password: "",
            rut: "",
            legal_name: "",
            trade_name: "",
            company_phone: "",
            company_email: "",
            sector: "",
            terms_policies: false,
        },
        validate: zodResolver(registerCompanySchema)
    });

    const getSectors = async () => await fetchSectors(endpoints.companySectors, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = registerCompanySchema.parse(values);
        await fetchData(endpoints.registerCompany, {
            showNotifications: true,
            successMessage: "Registro de usuario exitoso",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
    }
    // Redirect If Login Is Successful
    useEffect(() => {
        if (isSuccess) navigate(AppPaths.login);
    }, [isSuccess]);

    useEffect(() => {
        getSectors();
    }, []);

    return (
        <AuthLayout title="Registro Empresa">
            <LoadingOverlay visible={isLoading} />
            <Group mb="md" justify="space-evenly">
                <Link
                    className="react-link-primary"
                    to={AppPaths.registerCandidate}>
                    ¿Eres Candidato?
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
                        <Divider label="Informacion Empresa" />
                        <TextInput
                            label="RUT"
                            placeholder="Ingrese el rut de su empresa"
                            description="Ejemplo: 11.111.111-1"
                            maxLength={13}
                            key={form.key("rut")}
                            {...form.getInputProps("rut")}
                            withAsterisk />
                        <TextInput
                            label="Razon Social"
                            placeholder="Ingrese la razon social"
                            maxLength={300}
                            key={form.key("legal_name")}
                            {...form.getInputProps("legal_name")}
                            withAsterisk />
                        <TextInput
                            label="Nombre Fantasia"
                            placeholder="Ingrese el nombre fantasia"
                            maxLength={300}
                            key={form.key("trade_name")}
                            {...form.getInputProps("trade_name")}
                            withAsterisk />
                        <TextInput
                            label="Numero Telefonico"
                            placeholder="Ingrese el numero telefonico de su empresa"
                            description="Ejemplo: +56912345678"
                            maxLength={15}
                            key={form.key("company_phone")}
                            {...form.getInputProps("company_phone")}
                            withAsterisk />
                        <TextInput
                            label="Correo Electronico"
                            placeholder="Ingrese el correo electronico de su empresa"
                            maxLength={300}
                            key={form.key("company_email")}
                            {...form.getInputProps("company_email")}
                            withAsterisk />
                        <Select
                            label="Sector"
                            placeholder="Ingrese su sector"
                            comboboxProps={{ withinPortal: false }}
                            data={data?.company_sectors?.map((s) => ({
                                value: String(s.sector_id),
                                label: s.name
                            }))}
                            disabled={sectorsLoading}
                            key={form.key("sector")}
                            {...form.getInputProps("sector")}
                            searchable
                            withAsterisk />
                        <Divider label="Informacion Representante" />
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
                            label="Numero Telefonico"
                            placeholder="Ingrese su numero telefonico personal"
                            description="Ejemplo: +56912345678"
                            maxLength={15}
                            key={form.key("phone")}
                            {...form.getInputProps("phone")}
                            withAsterisk />
                        <TextInput
                            label="Correo Electronico"
                            placeholder="Ingrese su correo electronico"
                            maxLength={300}
                            key={form.key("email")}
                            {...form.getInputProps("email")}
                            withAsterisk />
                        <PasswordInput
                            label="Contraseña"
                            placeholder="Ingrese su contraseña"
                            description="6 Caracteres minimo y alfanumerica (Letras y Numeros)"
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
