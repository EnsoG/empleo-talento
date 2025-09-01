import { useEffect } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    LoadingOverlay,
    Stack
} from "@mantine/core";

import { useFetch } from "../../../hooks/useFetch";
import { AppPaths, Question } from "../../../types";
import { jobQuestionsFormSchema } from "../../../schemas/portalSchemas";
import { endpoints } from "../../../endpoints";
import { QuestionInput } from "./QuestionTypeInput";


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
                {questions.map((q, i) => (
                    <QuestionInput
                        key={q.question_id}
                        question={q}
                        index={i}
                        form={form} />
                ))}
                <Button type="submit">Enviar Postulacion</Button>
            </Stack>
        </form>
    )
}