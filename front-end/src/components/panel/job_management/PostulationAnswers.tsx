import { List, Text } from "@mantine/core";

import { JobAnswer } from "../../../types";

interface PostulationAnswersProps {
    answers: JobAnswer[];
}

export const PostulationAnswers = ({ answers }: PostulationAnswersProps) => {
    return (
        <List
            size="sm"
            spacing="sm"
            center>
            {answers.map((a) => (
                <List.Item key={a.answer_id}>
                    {a.job_question.question}
                    <Text
                        size="sm"
                        mt="sm">
                        Respuesta: {a.answer}
                    </Text>
                </List.Item>
            ))}
        </List>
    )
}