import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Select,
    Stack
} from "@mantine/core";

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { CompanyUser, companyUserStates } from "../../../types";
import { endpoints } from "../../../endpoints";
import { updateStaffStateSchema } from "../../../schemas/panelSchemas";

interface UpdateStaffStateFormProps {
    id: CompanyUser["user_id"];
    state: CompanyUser["state"];
    onGetStaff: () => Promise<void>;
}

export const UpdateStaffStateForm = ({ id, state, onGetStaff }: UpdateStaffStateFormProps) => {
    const { isLoading, fetchData } = useFetch();
    const { closeModal } = useModal();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            state: String(state)
        },
        validate: zodResolver(updateStaffStateSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Data And Do Request
        const data = updateStaffStateSchema.parse(values);
        await fetchData(`${endpoints.companyUsers}/${id}`, {
            showNotifications: true,
            successMessage: "Actualizacion de estado de usuario exitosa",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Staff And Close Modal
        await onGetStaff();
        closeModal();
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                <Select
                    label="Estado"
                    placeholder="Seleccione el estado"
                    data={companyUserStates.slice(1).map((s) => ({
                        value: String(s.value),
                        label: s.name
                    }))}
                    key={form.key("state")}
                    {...form.getInputProps("state")}
                    withAsterisk />
                <Button type="submit">Actualizar</Button>
            </Stack>
        </form>
    )
}
