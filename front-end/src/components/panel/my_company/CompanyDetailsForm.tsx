import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Select,
    Stack,
    Textarea,
    TextInput
} from "@mantine/core";

import { useModal } from "../../../hooks/useModal";
import { Company, CompanySector } from "../../../types";
import { updateCompanySchema } from "../../../schemas/panelSchemas";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";
import { getModifiedFields } from "../../../utilities";

interface CompanyDetailsFormProps {
    companyId: Company["company_id"],
    companyData: Pick<Company,
        "trade_name" |
        "description" |
        "email" |
        "phone" |
        "web"> & Pick<CompanySector, "sector_id">;
    sectors: CompanySector[];
    onGetCompanyDetails: () => Promise<void>;
}

export const CompanyDetailsForm = ({ companyId, companyData, sectors, onGetCompanyDetails: getCompanyDetails }: CompanyDetailsFormProps) => {
    const { isLoading, fetchData } = useFetch();
    const { closeModal } = useModal();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            trade_name: companyData.trade_name,
            description: companyData.description,
            email: companyData.email,
            phone: companyData.phone,
            web: companyData.web,
            sector_id: String(companyData.sector_id)
        },
        validate: zodResolver(updateCompanySchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        const data = getModifiedFields(companyData, updateCompanySchema.parse(values));
        // If Data Does Not Change Dont Update Nothing
        if (Object.keys(data).length === 0) return;
        // Do Request, Close Modal And Get Company Details
        await fetchData(`${endpoints.companies}/${companyId}`, {
            showNotifications: true,
            successMessage: "Datos empresa actualizados con exito",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        closeModal();
        await getCompanyDetails();
    }

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
                <Select
                    label="Sector"
                    placeholder="Seleccione el sector"
                    data={sectors.map((s) => ({
                        value: String(s.sector_id),
                        label: s.name
                    }))}
                    key={form.key("sector_id")}
                    {...form.getInputProps("sector_id")}
                    clearable
                    searchable />
                <Button type="submit">Actualizar</Button>
            </Stack>
        </form>
    )
}
