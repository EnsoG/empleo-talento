import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack,
    TextInput
} from "@mantine/core";

import { useModal } from "../../../hooks/useModal";
import { CompanyUser } from "../../../types";
import { useFetch } from "../../../hooks/useFetch";
import { companyUserInfoSchema } from "../../../schemas/panelSchemas";
import { endpoints } from "../../../endpoints";

interface CompanyUserInfoFormProps {
    companyUser: Pick<CompanyUser,
        "user_id" |
        "name" |
        "paternal" |
        "maternal" |
        "phone"
    >;
    onGetCompanyUser: () => Promise<void>;
}

export const CompanyUserInfoForm = ({ companyUser, onGetCompanyUser }: CompanyUserInfoFormProps) => {
    const { closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: companyUser.name,
            paternal: companyUser.paternal,
            maternal: companyUser.maternal,
            phone: companyUser.phone
        },
        validate: zodResolver(companyUserInfoSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Data And Do Request
        const data = companyUserInfoSchema.parse(values);
        await fetchData(`${endpoints.companyUsers}/${companyUser.user_id}`, {
            showNotifications: true,
            successMessage: "Actualizacion de datos personales exitosa",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Company User And Close Modal
        await onGetCompanyUser();
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
                <TextInput
                    label="Apellido Paterno"
                    placeholder="Ingrese el apellido paterno"
                    maxLength={150}
                    key={form.key("paternal")}
                    {...form.getInputProps("paternal")}
                    withAsterisk />
                <TextInput
                    label="Apellido Materno"
                    placeholder="Ingrese el apellido materno"
                    maxLength={150}
                    key={form.key("maternal")}
                    {...form.getInputProps("maternal")} />
                <TextInput
                    label="Numero Telefonico"
                    placeholder="Ingrese el numero telefonico"
                    maxLength={15}
                    key={form.key("phone")}
                    {...form.getInputProps("phone")}
                    withAsterisk />
                <Button type="submit">Actualizar</Button>
            </Stack>
        </form>
    )
}