import { useEffect } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    NumberInput,
    Select,
    Stack
} from "@mantine/core";

import { useFetch } from "../../../hooks/useFetch";
import { AppPaths, Question, QuestionType } from "../../../types";
import { jobQuestionsFormSchema } from "../../../schemas/portalSchemas";
import { endpoints } from "../../../endpoints";

interface JobQuestionsFormProps {
    offerId: number;
    questions: Question[];
    onCloseModal: () => void;
}

type FormType = z.infer<typeof jobQuestionsFormSchema>;

export const JobQuestionsForm = ({ offerId, questions, onCloseModal: closeModal }: JobQuestionsFormProps) => {
    const navigate = useNavigate();
    const { isLoading, isSuccess, fetchData } = useFetch();
    const form = useForm<FormType>({
        mode: "uncontrolled",
        initialValues: {
            answers: []
        },
        validate: zodResolver(jobQuestionsFormSchema)
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Values
        const data = jobQuestionsFormSchema.parse(values);
        // Do Request And Close Modal
        await fetchData(endpoints.postulations, {
            showNotifications: true,
            successMessage: "Postulacion realizada exitosamente",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                offer_id: offerId,
                answers: data.answers
            }),
            credentials: "include"
        });
        closeModal();
    };
    // Redirect If Request Is Successful
    useEffect(() => {
        if (isSuccess) navigate(AppPaths.postulations);
    }, [isSuccess])
    // Set Inital Questions
    useEffect(() => {
        form.setValues({
            answers: questions.map((q) => ({
                question_id: q.question_id,
                answer: ""
            }))
        });
    }, [questions]);

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                {questions.map((q, i) => ((q.question_type == QuestionType.yesOrNo)
                    ? <Select
                        label={q.question}
                        placeholder="Seleccione una respuesta"
                        data={["Si", "No"]}
                        key={form.key(`answers.${i}.answer`)}
                        {...form.getInputProps(`answers.${i}.answer`)}
                        withAsterisk />
                    : <NumberInput
                        label={q.question}
                        placeholder="Ingrese su respuesta"
                        key={form.key(`answers.${i}.answer`)}
                        {...form.getInputProps(`answers.${i}.answer`, {
                            onChange: (value: string) => {
                                form.setFieldValue(`answers.${i}.answer`, value?.toString() || "");
                            }
                        })}
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={false}
                        allowDecimal={false}
                        hideControls
                        withAsterisk />
                ))}
                <Button type="submit">Enviar Postulacion</Button>
            </Stack>
        </form>
    )
}