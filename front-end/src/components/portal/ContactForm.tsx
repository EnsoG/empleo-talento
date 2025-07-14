import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    Card,
    Divider,
    Stack,
    Text,
    Textarea,
    TextInput
} from "@mantine/core";

import { contactSchema } from "../../schemas/portalSchemas";

export const ContactForm = () => {
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            fullName: "",
            email: "",
            subject: "",
            message: ""
        },
        validate: zodResolver(contactSchema)
    });

    const handleSubmit = (values: typeof form.values) => {
        console.log("Formulario valido: ", values);
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
                <Stack>
                    <TextInput
                        label="Nombre Completo"
                        placeholder="Ingrese sus nombre completo"
                        maxLength={255}
                        key={form.key("fullName")}
                        {...form.getInputProps("fullName")}
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
