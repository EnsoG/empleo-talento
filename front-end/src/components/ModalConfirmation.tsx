import { useState } from "react";
import {
    Button,
    MantineColor,
    Stack,
    Text
} from "@mantine/core";

interface ModalConfirmationProps {
    description: string;
    btnColor?: MantineColor;
    btnLabel?: string;
    onConfirm: () => Promise<void>;
}

export const ModalConfirmation = ({ description, btnColor, btnLabel, onConfirm }: ModalConfirmationProps) => {
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleConfirm = async () => {
        setConfirmLoading(true);
        await onConfirm();
        setConfirmLoading(false);
    }

    return (
        <Stack>
            <Text size="sm">{description}</Text>
            <Button
                color={btnColor}
                onClick={handleConfirm}
                loading={confirmLoading}
                loaderProps={{ type: "dots" }}>
                {btnLabel}
            </Button>
        </Stack>
    )
}