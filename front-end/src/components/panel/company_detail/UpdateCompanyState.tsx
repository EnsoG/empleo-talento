import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    Card,
    LoadingOverlay,
    Select,
    Stack
} from "@mantine/core";
import { Gauge } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch";
import { CompanyPanel, companyUserStates } from "../../../types";
import { endpoints } from "../../../endpoints";
import { updateCompanyStateSchema } from "../../../schemas/panelSchemas";
import { CardSection } from "../../CardSection";

interface UpdateCompanyStateProps {
    companyId: CompanyPanel["company_id"];
    state: CompanyPanel["state"];
    onGetCompany: () => Promise<void>;
}

export const UpdateCompanyState = ({ companyId, state, onGetCompany }: UpdateCompanyStateProps) => {
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            state: String(state)
        },
        validate: zodResolver(updateCompanyStateSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values
        const data = updateCompanyStateSchema.parse(values);
        // If State Has Not Change, Don't Do Request 
        if (data.state === state) return;
        // Do Request And Get Company Info
        await fetchData(`${endpoints.updateCompanyState}/${companyId}`, {
            showNotifications: true,
            successMessage: "Actualizacion de estado de empresa exitosa",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        await onGetCompany();
    }

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <CardSection
                title="Estado Empresa"
                icon={Gauge}>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <LoadingOverlay visible={isLoading} />
                    <Stack>
                        <Select
                            label="Estado"
                            placeholder="Seleccione un estado"
                            data={companyUserStates.map((s) => ({
                                value: String(s.value),
                                label: s.name
                            }))}
                            key={form.key("state")}
                            {...form.getInputProps("state")}
                            allowDeselect={false}
                            withAsterisk />
                        <Button type="submit">Actualizar Estado</Button>
                    </Stack>
                </form>
            </CardSection>
        </Card>
    )
}