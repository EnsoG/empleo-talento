import { useForm, zodResolver } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import {
    Button,
    LoadingOverlay,
    Select,
    Stack,
    TextInput
} from "@mantine/core";

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import {
    Candidate,
    Gender,
    Nationality,
    // DriverLicense
} from "../../../types";
import { endpoints } from "../../../endpoints";
import { personalInfoSchema } from "../../../schemas/portalSchemas";
import { parseDateToLocal } from "../../../utilities";

interface PersonalInfoFormProps {
    candidate: Pick<Candidate,
        "name" |
        "paternal" |
        "maternal" |
        "run" |
        "birth_date" |
        "gender" |
        "nationality" |
        "phone" |
        "driver_license"
    >;
    onGetCandidate: () => Promise<void>;
}

export const PersonalInfoForm = ({ candidate, onGetCandidate: getCandidate }: PersonalInfoFormProps) => {
    const { isLoading, fetchData } = useFetch();
    const { closeModal } = useModal();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: candidate?.name,
            paternal: candidate?.paternal,
            maternal: candidate?.maternal,
            run: candidate?.run,
            birth_date: candidate?.birth_date ? parseDateToLocal(candidate?.birth_date) : null,
            phone: candidate?.phone,
            gender: candidate?.gender,
            nationality: candidate?.nationality,
            driver_license: candidate?.driver_license ? String(candidate.driver_license) : null
        },
        validate: zodResolver(personalInfoSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Data And Do Request
        const data = personalInfoSchema.parse(values);
        await fetchData(endpoints.candidates, {
            showNotifications: true,
            successMessage: "Informacion personal actualizada con exito",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        // Get Candidate And Close Modal
        await getCandidate()
        closeModal();
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                <TextInput
                    label="Nombre"
                    placeholder="Ingrese su nombre"
                    key={form.key("name")}
                    {...form.getInputProps("name")}
                    withAsterisk />
                <TextInput
                    label="Apellido Paterno"
                    placeholder="Ingrese su apellido paterno"
                    key={form.key("paternal")}
                    {...form.getInputProps("paternal")}
                    withAsterisk />
                <TextInput
                    label="Apellido Materno"
                    placeholder="Ingrese su apellido materno"
                    key={form.key("maternal")}
                    {...form.getInputProps("maternal")} />
                <TextInput
                    label="RUT"
                    placeholder="Ingrese su rut"
                    description="Ejemplo: 11.111.111-1"
                    maxLength={13}
                    key={form.key("run")}
                    {...form.getInputProps("run")} />
                <DatePickerInput
                    label="Fecha Nacimiento"
                    placeholder="Ingrese su fecha de nacimiento"
                    maxDate={new Date()}
                    key={form.key("birth_date")}
                    {...form.getInputProps("birth_date")}
                    clearable />
                <TextInput
                    label="Numero Telefonico"
                    placeholder="Ingrese su numero telefonico"
                    description="Ejemplo: +56912345678"
                    key={form.key("phone")}
                    {...form.getInputProps("phone")} />
                <Select
                    label="Genero"
                    placeholder="Seleccione su genero"
                    data={Object.values(Gender)}
                    comboboxProps={{ withinPortal: false }}
                    key={form.key("gender")}
                    {...form.getInputProps("gender")}
                    clearable />
                <Select
                    label="Nacionalidad"
                    placeholder="Seleccione su nacionaidad"
                    data={Object.values(Nationality)}
                    comboboxProps={{ withinPortal: false }}
                    key={form.key("nationality")}
                    {...form.getInputProps("nationality")}
                    searchable
                    clearable />
                <Select
                    label="Tipo Licencia"
                    placeholder="Seleccione su tipo licencia"
                    key={form.key("driver_license")}
                    {...form.getInputProps("driver_license")}
                    data={[].map((l: any, i: number) => ({
                        value: String(i),
                        label: l
                    }))}
                    comboboxProps={{ withinPortal: false }}
                    clearable
                    searchable />
                <Button type="submit">Actualizar</Button>
            </Stack>
        </form>
    )
}
