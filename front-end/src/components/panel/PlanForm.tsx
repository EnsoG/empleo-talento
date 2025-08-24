import { useNavigate } from "react-router";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    FileInput,
    Group,
    Image,
    LoadingOverlay,
    NumberInput,
    Select,
    Stack,
    Textarea,
    TextInput
} from "@mantine/core";

import { useFetch } from "../../hooks/useFetch";
import { AppPaths, CandidatePlan, CompanyPlan, PlanState } from "../../types";
import { addPlanSchema, updatePlanSchema } from "../../schemas/panelSchemas";
import { endpoints } from "../../endpoints";
import { Eye } from "@phosphor-icons/react";
import { useModal } from "../../hooks/useModal";

interface PlanFormProps {
    type: "add" | "update";
    planType: "candidate" | "company";
    plan?: CandidatePlan | CompanyPlan;
}

const formConfig = {
    candidate: {
        endpoint: endpoints.candidatePlans,
        addSuccessMessage: "Plan de candidato registrado exitosamente",
        successRedirect: AppPaths.myCandidatePlans,
        updateSuccessMessage: "Plan de candidato actualizado exitosamente"
    },
    company: {
        endpoint: endpoints.companyPlans,
        addSuccessMessage: "Plan de empresa registrado exitosamente",
        successRedirect: AppPaths.myCompanyPlans,
        updateSuccessMessage: "Plan de empresa actualizado exitosamente"
    }
}

export const PlanForm = ({ type, planType, plan }: PlanFormProps) => {
    const config = formConfig[planType];
    const navigate = useNavigate();
    const { openModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: plan?.name,
            value: plan?.value,
            description: plan?.description,
            state: (type == "add") ? PlanState.inactive : plan?.state,
            photo: null
        },
        validate: zodResolver((type == "add") ? addPlanSchema : updatePlanSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Data And Create Form Data
        const schema = (type == "add") ? addPlanSchema : updatePlanSchema;
        const data = schema.parse(values);
        const formData = new FormData();
        formData.append("payload", JSON.stringify({
            name: data.name,
            value: data.value,
            description: data.description,
            state: data.state
        }));
        if (data.photo) formData.append("photo", data.photo);
        // Do Request And Redirect To Plans Page
        await fetchData(`${config.endpoint}${(type == "add") ? "" : `/${plan?.plan_id}`}`, {
            showNotifications: true,
            successMessage: (type == "add")
                ? config.addSuccessMessage
                : config.updateSuccessMessage,
            method: (type == "add") ? "POST" : "PUT",
            body: formData,
            credentials: "include"
        });
        navigate(config.successRedirect);
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
                <Group align="flex-end">
                    <FileInput
                        label={(type == "add") ? "Foto" : "Actualizar Foto"}
                        placeholder="Seleccione la foto"
                        accept="image/jpeg"
                        flex={1}
                        key={form.key("photo")}
                        {...form.getInputProps("photo")}
                        withAsterisk={type == "add"} />
                    {(type == "update") &&
                        <Button
                            leftSection={<Eye />}
                            onClick={() => openModal(
                                <Image
                                    src={`${endpoints.staticPlanPhotos}/${plan?.photo}`}
                                    radius="md" />,
                                "Foto Actual"
                            )}>
                            Ver Foto Actual
                        </Button>
                    }
                </Group>
                <Button type="submit">
                    {(type == "add") ? "Agregar" : "Actualizar"}
                </Button>
            </Stack>
        </form>
    )
}