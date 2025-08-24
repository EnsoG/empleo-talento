import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    Card,
    Divider,
    LoadingOverlay,
    Stack,
    Text,
    Textarea,
    TextInput
} from "@mantine/core";

import { useFetch } from "../../hooks/useFetch";
import { contactSchema } from "../../schemas/portalSchemas";
import { endpoints } from "../../endpoints";

export const ContactForm = () => {
    const { isLoading, fetchData } = useFetch();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            full_name: "",
            email: "",
            subject: "",
            message: ""
        },
        validate: zodResolver(contactSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values
        const data = contactSchema.parse(values);
        // Do Request And Reset Form
        await fetchData(endpoints.contactEmails, {
            showNotifications: true,
            successMessage: "Se ha eviado la consulta correctamente",
            errorMessage: "Ha ocurrido un error al enviar la consulta",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        form.reset();
    }

    return (
        <Card
            padding="xl"
            radius="lg"
            shadow="sm"
            withBorder>
            <Text
                c="blue"
                size="xl"
                ta="center"
                fw="bold">
                Formulario Contacto
            </Text>
            <Divider my="lg" />
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <LoadingOverlay visible={isLoading} />
                <Stack>
                    <TextInput
                        label="Nombre Completo"
                        placeholder="Ingrese sus nombre completo"
                        maxLength={150}
                        key={form.key("full_name")}
                        {...form.getInputProps("full_name")}
                        withAsterisk />
                    <TextInput
                        label="Correo Electronico"
                        placeholder="Ingrese su correo electronico"
                        maxLength={255}
                        key={form.key("email")}
                        {...form.getInputProps("email")}
                        withAsterisk />
                    <TextInput
                        label="Asunto"
                        placeholder="Ingrese el asunto"
                        key={form.key("subject")}
                        {...form.getInputProps("subject")}
                        maxLength={50}
                        withAsterisk />
                    <Textarea
                        label="Mensaje"
                        placeholder="Ingrese su mensaje"
                        key={form.key("message")}
                        {...form.getInputProps("message")}
                        rows={4}
                        maxLength={255}
                        withAsterisk />
                    <Button
                        type="submit">
                        Enviar
                    </Button>
                </Stack>
            </form>
        </Card>
    )
}
