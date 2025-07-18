import { MonthPickerInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Select,
    Stack,
    TextInput
} from "@mantine/core";

import { useMetadata } from "../../../hooks/useMetadata";
import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { CandidateCertification } from "../../../types";
import { parseDateToLocal } from "../../../utilities";
import { profileCertificationSchema } from "../../../schemas/portalSchemas";
import { endpoints } from "../../../endpoints";

interface CertificationFormProps {
    type: "create" | "update";
    certification?: CandidateCertification;
    onGetCertifications: () => Promise<void>;
}

export const CertificationForm = ({ type, certification, onGetCertifications }: CertificationFormProps) => {
    const { metadata } = useMetadata();
    const { isLoading, fetchData } = useFetch();
    const { closeModal } = useModal();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: certification?.name ?? "",
            institution: certification?.institution ?? "",
            description: certification?.description ?? "",
            obtained_date: certification?.obtained_date ? parseDateToLocal(certification?.obtained_date) : null,
            expiration_date: certification?.expiration_date ? parseDateToLocal(certification?.expiration_date) : null,
            certification_type_id: certification?.certification_type.certification_type_id ? String(certification?.certification_type.certification_type_id) : ""
        },
        validate: zodResolver(profileCertificationSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = profileCertificationSchema.parse(values);
        await fetchData(`${endpoints.candidateCertifications}${(type == "create") ? "" : `/${certification?.certification_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Certificacion registrada exitosamente"
                : "Certificacion actualizada exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Candidate Certificacions And Close Modal
        await onGetCertifications();
        closeModal();
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                <TextInput
                    label="Nombre"
                    placeholder="Ingrese el nombre de la certificacion"
                    maxLength={255}
                    key={form.key("name")}
                    {...form.getInputProps("name")}
                    withAsterisk />
                <TextInput
                    label="Institucion"
                    placeholder="Ingrese el nombre de la institucion"
                    maxLength={255}
                    key={form.key("institution")}
                    {...form.getInputProps("institution")} />
                <TextInput
                    label="Descripcion"
                    placeholder="Ingrese una descripcion del certificado"
                    key={form.key("description")}
                    {...form.getInputProps("description")} />
                <MonthPickerInput
                    label="Fecha de Obtencion"
                    placeholder="Ingrese la fecha de obtencion"
                    maxDate={new Date()}
                    key={form.key("obtained_date")}
                    {...form.getInputProps("obtained_date")}
                    clearable />
                <MonthPickerInput
                    label="Fecha de Vencimiento"
                    placeholder="Ingrese la fecha de vencimiento"
                    maxDate={new Date()}
                    key={form.key("expiration_date")}
                    {...form.getInputProps("expiration_date")}
                    clearable />
                <Select
                    label="Tipo Certificacion"
                    placeholder="Seleccione el tipo de certificacion"
                    data={metadata.certification_types.map((c) => ({
                        value: String(c.certification_type_id),
                        label: c.name
                    }))}
                    key={form.key("certification_type_id")}
                    {...form.getInputProps("certification_type_id")}
                    withAsterisk />
                <Button type="submit">{(type == "create") ? "Agregar" : "Actualizar"}</Button>
            </Stack>
        </form>
    )
}
