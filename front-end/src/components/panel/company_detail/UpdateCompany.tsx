import { useEffect } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { Button, LoadingOverlay, Select, Skeleton, Stack, Textarea, TextInput } from "@mantine/core";

import { useFetch } from "../../../hooks/useFetch";
import { Company, CompanySectors } from "../../../types";
import { updateCompanySchema } from "../../../schemas/panelSchemas";
import { endpoints } from "../../../endpoints";

interface UpdateCompanyProps {
    company: Pick<Company,
        "company_id" |
        "trade_name" |
        "description" |
        "email" |
        "phone" |
        "web" |
        "company_sector"
    >;
    onGetCompany: () => Promise<void>;
}

export const UpdateCompany = ({ company, onGetCompany }: UpdateCompanyProps) => {
    const { isLoading, fetchData } = useFetch();
    const { data: sectors, isLoading: sectorsLoading, fetchData: fetchSectors } = useFetch<CompanySectors>();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            trade_name: company.trade_name,
            description: company.description,
            email: company.email,
            phone: company.phone,
            web: company.web,
            sector_id: String(company.company_sector?.sector_id)
        },
        validate: zodResolver(updateCompanySchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values
        const data = updateCompanySchema.parse(values);
        // Do Request And Get Company Info
        await fetchData(`${endpoints.companies}/${company.company_id}`, {
            showNotifications: true,
            successMessage: "Actualizacion empresa exitosa",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        await onGetCompany();
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
                <TextInput
                    label="Nombre Fantasia"
                    placeholder="Ingrese el nombre fantasia"
                    maxLength={300}
                    key={form.key("trade_name")}
                    {...form.getInputProps("trade_name")}
                    withAsterisk />
                <Textarea
                    label="Descripcion"
                    placeholder="Ingrese la descripcion"
                    key={form.key("description")}
                    {...form.getInputProps("description")}
                    rows={4} />
                <TextInput
                    label="Correo Electronico"
                    placeholder="Ingrese el correo electronico"
                    key={form.key("email")}
                    {...form.getInputProps("email")}
                    maxLength={300}
                    withAsterisk />
                <TextInput
                    label="Numero Telefonico"
                    placeholder="Ingrese el numero telefonico"
                    description="Ejemplo: +56912345678"
                    key={form.key("phone")}
                    {...form.getInputProps("phone")}
                    maxLength={15}
                    withAsterisk />
                <TextInput
                    label="Pagina Web"
                    placeholder="Ingrese la pagina web"
                    key={form.key("web")}
                    {...form.getInputProps("web")}
                    maxLength={300} />
                <Skeleton visible={sectorsLoading}>
                    {(sectors) &&
                        <Select
                            label="Sector"
                            placeholder="Selecione el sector"
                            data={sectors.company_sectors?.map((s) => ({
                                value: String(s.sector_id),
                                label: s.name
                            }))}
                            key={form.key("sector_id")}
                            {...form.getInputProps("sector_id")}
                            searchable
                            clearable />
                    }
                </Skeleton>
                <Button type="submit">Actualizar</Button>
            </Stack>
        </form>
    )
}
