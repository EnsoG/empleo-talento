import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
    Button,
    LoadingOverlay,
    Stack,
    Textarea
} from "@mantine/core";

import { profileFeaturedEducationSchema } from "../../../schemas/portalSchemas";

export type FeaturedEducationFormType = z.infer<typeof profileFeaturedEducationSchema>;

interface FeaturedEducationFormProps {
    featuredStudy: string;
    onSubmit: (values: FeaturedEducationFormType) => Promise<void>;
}

export const FeaturedEducationForm = ({ featuredStudy, onSubmit }: FeaturedEducationFormProps) => {
    const [isLoading, { toggle }] = useDisclosure(false);
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            featured_study: featuredStudy
        },
        validate: zodResolver(profileFeaturedEducationSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        const data = profileFeaturedEducationSchema.parse(values);
        toggle();
        await onSubmit(data);
        toggle();
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                <Textarea
                    label="Estudio Destacado"
                    placeholder="Ingrese su estudio destacado"
                    minRows={3}
                    key={form.key("featured_study")}
                    {...form.getInputProps("featured_study")}
                    maxLength={300}
                    autosize />
                <Button type="submit">Actualizar</Button>
            </Stack>
        </form>
    )
}