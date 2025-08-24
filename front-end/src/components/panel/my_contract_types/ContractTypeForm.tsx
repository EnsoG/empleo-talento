import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack,
    TextInput
} from "@mantine/core";

import { ContractType } from "../../../types";
import { contractTypeSchema } from "../../../schemas/panelSchemas";
import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";

interface ContractTypeFormProps {
    type: "create" | "update";
    contractType?: ContractType;
    onGetContracts: () => Promise<void>;
}

export const ContractTypeForm = ({ type, contractType, onGetContracts }: ContractTypeFormProps) => {
    const { closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: contractType?.name ?? ""
        },
        validate: zodResolver(contractTypeSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = contractTypeSchema.parse(values);
        await fetchData(`${endpoints.contractTypes}${(type == "create") ? "" : `/${contractType?.type_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Tipo contrato registrado exitosamente"
                : "Tipo contrato actualizado exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Contract Types And Close Modal
        await onGetContracts();
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