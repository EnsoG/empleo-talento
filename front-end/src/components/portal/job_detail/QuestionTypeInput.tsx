import { UseFormReturnType } from "@mantine/form";
import { TextInput, NumberInput, Select } from "@mantine/core";

import { Question, QuestionType } from "../../../types";

interface QuestionInputProps {
    question: Question;
    index: number;
    form: UseFormReturnType<any>;
}

export const QuestionInput = ({ question, index, form }: QuestionInputProps) => {
    switch (question.question_type) {
        case QuestionType.text:
            return (
                <TextInput
                    label={question.question}
                    placeholder="Escribe tu respuesta"
                    withAsterisk
                    maxLength={255}
                    key={form.key(`answers.${index}.answer`)}
                    {...form.getInputProps(`answers.${index}.answer`)}
                />
            );
        case QuestionType.numeric:
            return (
                <NumberInput
                    label={question.question}
                    placeholder="Ingrese su respuesta"
                    key={form.key(`answers.${index}.answer`)}
                    {...form.getInputProps(`answers.${index}.answer`, {
                        onChange: (value: string) => {
                            form.setFieldValue(`answers.${index}.answer`, value?.toString() || "");
                        }
                    })}
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    allowDecimal={false}
                    hideControls
                    withAsterisk />
            );
        case QuestionType.yesOrNo:
            return (
                <Select
                    label={question.question}
                    placeholder="Seleccione una respuesta"
                    data={["Si", "No"]}
                    key={form.key(`answers.${index}.answer`)}
                    {...form.getInputProps(`answers.${index}.answer`)}
                    withAsterisk />
            );
        default:
            return null;
    }
};