import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack,
    TextInput
} from "@mantine/core";

import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { CertificationType } from "../../../types";
import { endpoints } from "../../../endpoints";
import { certificationTypeSchema } from "../../../schemas/panelSchemas";

interface CertificationTypeFormProps {
    type: "create" | "update";
    certificationType?: CertificationType;
    onGetTypes: () => Promise<void>;
}

export const CertificationTypeForm = ({ type, certificationType, onGetTypes }: CertificationTypeFormProps) => {
    const { closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: certificationType?.name ?? null
        },
        validate: zodResolver(certificationTypeSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = certificationTypeSchema.parse(values);
        await fetchData(`${endpoints.certificationTypes}${(type == "create") ? "" : `/${certificationType?.certification_type_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Tipo certificacion registrado exitosamente"
                : "Tipo certificacion actualizado exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Certification Types And Close Modal
        await onGetTypes();
        closeModal();
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                <TextInput
                    label="Nombre"
                    placeholder="Ingrese el nombre"
                    maxLength={150}
                    key={form.key("name")}
                    {...form.getInputProps("name")}
                    withAsterisk />
                <Button type="submit">{(type == "create") ? "Agregar" : "Actualizar"}</Button>
            </Stack>
        </form>
    )
}