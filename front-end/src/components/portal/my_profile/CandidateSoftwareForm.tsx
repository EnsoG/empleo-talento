import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Select,
    Stack
} from "@mantine/core";

import { createSoftwareSchema, updateSoftwareSchema } from "../../../schemas/portalSchemas";
import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { endpoints } from "../../../endpoints";
import { CandidateSoftware, Software } from "../../../types";
import { useMetadata } from "../../../hooks/useMetadata";

interface CandidateSoftwareFormProps {
    type: "create" | "update";
    softwares?: Software[];
    candidateSoftware?: Pick<CandidateSoftware,
        "candidate_software_id" |
        "knownledge_level"
    >;
    onGetSoftwares: () => Promise<void>;
}

export const CandidateSoftwareForm = ({ type, candidateSoftware, softwares, onGetSoftwares }: CandidateSoftwareFormProps) => {
    const { metadata } = useMetadata();
    const { isLoading, fetchData } = useFetch();
    const { closeModal } = useModal();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            software: "",
            level: candidateSoftware?.knownledge_level.level_id ? String(candidateSoftware?.knownledge_level.level_id) : null
        },
        validate: zodResolver((type == "create") ? createSoftwareSchema : updateSoftwareSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values And Do Request
        const data = (type == "create")
            ? createSoftwareSchema.parse(values)
            : updateSoftwareSchema.parse(values);
        await fetchData(`${endpoints.candidateSoftwares}${(type == "create") ? "" : `/${candidateSoftware?.candidate_software_id}`}`, {
            showNotifications: true,
            successMessage: (type == "create")
                ? "Software registrado exitosamente"
                : "Software actualizado exitosamente",
            method: (type == "create") ? "POST" : "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Candidate Softwares And Close Modal
        await onGetSoftwares();
        closeModal();
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                {(type == "create") &&
                    <Select
                        label="Software"
                        placeholder="Selecciona el software"
                        data={softwares?.map((s) => ({
                            value: String(s.software_id),
                            label: s.name
                        }))}
                        key={form.key("software")}
                        {...form.getInputProps("software")}
                        searchable
                        withAsterisk />
                }
                <Select
                    label="Nivel Conocimiento"
                    placeholder="Selecciona el nivel de conocimiento en relacion al software"
                    data={metadata.knownledge_levels.map((k) => ({
                        value: String(k.level_id),
                        label: k.name
                    }))}
                    key={form.key("level")}
                    {...form.getInputProps("level")}
                    searchable
                    withAsterisk />
                <Button type="submit">{(type == "create") ? "Agregar" : "Actualizar"}</Button>
            </Stack>
        </form>
    )
}