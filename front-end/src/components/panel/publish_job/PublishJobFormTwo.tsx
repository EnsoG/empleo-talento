import { z } from "zod";
import { UseFormReturnType } from "@mantine/form";
import {
    ActionIcon,
    Alert,
    Center,
    Fieldset,
    Group,
    Select,
    Stack,
    TextInput
} from "@mantine/core";
import {
    Info,
    Plus,
    Trash
} from "@phosphor-icons/react";

import { QuestionType, questionTypes } from "../../../types";
import { publishJobFullSchema } from "../../../schemas/panelSchemas";

interface PublishJobFormTwoProps {
    form: UseFormReturnType<z.infer<typeof publishJobFullSchema>>
}

export const PublishJobFormTwo = ({ form }: PublishJobFormTwoProps) => {
    const addQuestion = () => {
        if (form.values.questions) {
            form.setFieldValue("questions", [...form.values.questions, {
                question: "",
                question_type: QuestionType.yesOrNo
            }]);
        }
    }

    const removeQuestion = (index: number) => {
        if (form.values.questions) {
            form.setFieldValue("questions",
                form.values.questions.filter((_, i) => i !== index)
            );
        }
    }

    return (
        <Stack>
            {form?.values?.questions?.length === 0 &&
                <Alert
                    title="Preguntas Oferta Empleo"
                    variant="light"
                    color="blue"
                    icon={<Info />}>
                    En el caso de que no agregar preguntas a la oferta como tal el postulante solamente ingresara la informacion minima para aplicar a tu oferta, por lo que ten en cuenta esto al momento de dar click en "Publicar".
                </Alert>
            }
            {
                form?.values?.questions?.map((_, i) => (
                    <Fieldset
                        key={i}
                        legend={`Informacion Pregunta ${i + 1}`}>
                        <Stack>
                            <Group justify="end">
                                <ActionIcon
                                    variant="transparent"
                                    color="red"
                                    onClick={() => removeQuestion(i)}>
                                    <Trash />
                                </ActionIcon>
                            </Group>
                            <TextInput
                                label={`Pregunta ${i + 1}`}
                                placeholder="Ingrese su pregunta"
                                key={form.key(`questions.${i}.question`)}
                                {...form.getInputProps(`questions.${i}.question`)}
                                withAsterisk />
                            <Select
                                label="Tipo Pregunta"
                                placeholder="Seleccione tipo de pregunta"
                                data={questionTypes.map((t) => ({
                                    value: String(t.value),
                                    label: t.name
                                }))}
                                key={form.key(`questions.${i}.question_type`)}
                                {...form.getInputProps(`questions.${i}.question_type`)}
                                withAsterisk />
                        </Stack>
                    </Fieldset>
                ))
            }
            <Center>
                <ActionIcon
                    radius="xl"
                    size="md"
                    onClick={addQuestion}>
                    <Plus />
                </ActionIcon>
            </Center>
        </Stack>
    )
}