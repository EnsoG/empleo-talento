import { useNavigate } from "react-router";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    FileInput,
    LoadingOverlay,
    NumberInput,
    Select,
    Stack,
    Textarea,
    TextInput
} from "@mantine/core";

import { useFetch } from "../../hooks/useFetch";
import { AppPaths, CandidatePlan, PlanState } from "../../types";
import { planSchema } from "../../schemas/panelSchemas";
import { endpoints } from "../../endpoints";

interface CandidatePlanFormProps {
    type: "add" | "update";
    candidatePlan?: CandidatePlan;
}

export const CandidatePlanForm = ({ type, candidatePlan }: CandidatePlanFormProps) => {
    const navigate = useNavigate();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: candidatePlan?.name,
            value: candidatePlan?.value,
            description: candidatePlan?.description,
            state: (type == "add") ? PlanState.inactive : candidatePlan?.state,
            photo: null
        },
        validate: zodResolver(planSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Data And Create Form Data
        const data = planSchema.parse(values);
        const formData = new FormData();
        formData.append("payload", JSON.stringify({
            name: data.name,
            value: data.value,
            description: data.description,
            state: data.state
        }));
        if (data.photo) formData.append("photo", data.photo);
        // Do Request And Redirect To My Candidate Plans
        await fetchData(`${endpoints.candidatePlans}${(type == "add") ? "" : `/${candidatePlan?.plan_id}`}`, {
            showNotifications: true,
            successMessage: (type == "add")
                ? "Plan de candidato registrado exitosamente"
                : "Plan de candidato actualizado exitosamente",
            method: (type == "add") ? "POST" : "PUT",
            body: formData,
            credentials: "include"
        });
        navigate(AppPaths.myCandidatePlans);
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                <TextInput
                    label="Nombre"
                    placeholder="Ingrese el nombre"
                    maxLength={50}
                    key={form.key("name")}
                    {...form.getInputProps("name")}
                    withAsterisk />
                <NumberInput
                    label="Valor"
                    placeholder="Ingrese el valor"
                    prefix="$"
                    thousandSeparator={true}
                    allowNegative={false}
                    allowDecimal={false}
                    key={form.key("value")}
                    {...form.getInputProps("value")}
                    withAsterisk
                    hideControls />
                <Textarea
                    label="Descripcion"
                    placeholder="Ingrese la descripcion"
                    rows={4}
                    key={form.key("description")}
                    {...form.getInputProps("description")} />
                {(type == "update") &&
                    <Select
                        label="Estado"
                        placeholder="Seleccione el estado"
                        key={form.key("state")}
                        {...form.getInputProps("state")}
                        data={Object.values(PlanState)}
                        withAsterisk />
                }
                <FileInput
                    label="Foto"
                    placeholder="Seleccione la foto"
                    accept="image/jpeg"
                    key={form.key("photo")}
                    {...form.getInputProps("photo")}
                    clearable />
                <Button type="submit">
                    {(type == "add") ? "Agregar" : "Actualizar"}
                </Button>
            </Stack>
        </form>
    )
}