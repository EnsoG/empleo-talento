import { useForm, zodResolver } from "@mantine/form";
import { Button, LoadingOverlay, PasswordInput, Stack, TextInput } from "@mantine/core";

import { createStaffSchema } from "../../../schemas/panelSchemas";
import { useModal } from "../../../hooks/useModal";
import { useFetch } from "../../../hooks/useFetch";
import { endpoints } from "../../../endpoints";

interface CreateStaffFormProps {
    onGetStaff: () => Promise<void>;
}

export const CreateStaffForm = ({ onGetStaff }: CreateStaffFormProps) => {
    const { isLoading, fetchData } = useFetch();
    const { closeModal } = useModal();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            name: "",
            paternal: "",
            maternal: "",
            position: "",
            phone: "",
            email: "",
            password: "",
            confirm_password: ""
        },
        validate: zodResolver(createStaffSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Delete Unecessary Field And Transform Values
        const data = createStaffSchema.parse(values);
        delete data.confirm_password;
        // Do Request And Get Staff
        await fetchData(endpoints.companyUsers, {
            showNotifications: true,
            successMessage: "Registro de staff exitoso",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            credentials: "include"
        });
        await onGetStaff();
        closeModal();
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                <TextInput
                    label="Nombre"
                    placeholder="Ingrese el nombre del personal"
                    key={form.key("name")}
                    {...form.getInputProps("name")}
                    withAsterisk />
                <TextInput
                    label="Apellido Paterno"
                    placeholder="Ingrese el apellido paterno del personal"
                    key={form.key("paternal")}
                    {...form.getInputProps("paternal")}
                    withAsterisk />
                <TextInput
                    label="Apellido Materno"
                    placeholder="Ingrese el apellido materno del personal"
                    key={form.key("maternal")}
                    {...form.getInputProps("maternal")} />
                <TextInput
                    label="Cargo"
                    placeholder="Ingrese el cargo del personal"
                    key={form.key("position")}
                    {...form.getInputProps("position")}
                    withAsterisk />
                <TextInput
                    label="Numero Telefonico"
                    placeholder="Ingrese el numero telefonico del personal"
                    description="Ejemplo: +56912345678"
                    key={form.key("phone")}
                    {...form.getInputProps("phone")}
                    withAsterisk />
                <TextInput
                    label="Correo Electronico"
                    placeholder="Ingrese el correo electronico del personal"
                    key={form.key("email")}
                    {...form.getInputProps("email")}
                    withAsterisk />
                <PasswordInput
                    label="Contraseña"
                    placeholder="Ingrese la contraseña del personal"
                    description="6 Caracteres minimo y alfanumerica (Letras y Numeros)"
                    key={form.key("password")}
                    {...form.getInputProps("password")}
                    withAsterisk />
                <PasswordInput
                    label="Confirmar Contraseña"
                    placeholder="Ingrese nuevamente su contraseña"
                    key={form.key("confirm_password")}
                    {...form.getInputProps("confirm_password")}
                    withAsterisk />
                <Button type="submit">Agregar</Button>
            </Stack>
        </form>
    )
}