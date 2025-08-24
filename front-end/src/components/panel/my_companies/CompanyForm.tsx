import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    Divider,
    LoadingOverlay,
    PasswordInput,
    Select,
    Stack,
    TextInput
} from "@mantine/core";

import { CompanySectors } from "../../../types";
import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { createCompanySchema } from "../../../schemas/panelSchemas";
import { useEffect } from "react";

interface CompanyFormProps {
    onGetCompanies: () => Promise<void>;
}

export const CompanyForm = ({ onGetCompanies }: CompanyFormProps) => {
    const { closeModal } = useModal();
    const { data, isLoading: sectorsLoading, fetchData: fetchSectors } = useFetch<CompanySectors>();
    const { isLoading, fetchData } = useFetch();
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
            sector_id: ""
        },
        validate: zodResolver(createCompanySchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = createCompanySchema.parse(values);
        await fetchData(endpoints.registerCompany, {
            showNotifications: true,
            successMessage: "Empresa registrada exitosamente",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        // Get Softwares And Close Modal
        await onGetCompanies();
        closeModal();
    }

    const getSectors = async () => await fetchSectors(endpoints.companySectors, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    useEffect(() => {
        getSectors();
    }, []);

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
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
                    data={data?.company_sectors?.map((s) => ({
                        value: String(s.sector_id),
                        label: s.name
                    }))}
                    disabled={sectorsLoading}
                    key={form.key("sector_id")}
                    {...form.getInputProps("sector_id")}
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
                <Button type="submit">Agregar</Button>
            </Stack>
        </form>
    )
}