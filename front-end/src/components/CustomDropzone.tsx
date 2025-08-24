import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import {
    Box,
    Group,
    Text
} from "@mantine/core";
import {
    Image,
    Upload,
    X
} from "@phosphor-icons/react";;

interface CustomDropzoneProps {
    title: string;
    subtitle: string;
    acceptedFiles: typeof MIME_TYPES[keyof typeof MIME_TYPES][];
    maxSize: number;
    onSendFile: (files: FileWithPath[]) => Promise<void>;
}

export const CustomDropzone = ({ title, subtitle, acceptedFiles, maxSize, onSendFile }: CustomDropzoneProps) => {
    return (
        <Dropzone
            className="custom-dropzone"
            accept={acceptedFiles}
            maxSize={maxSize}
            multiple={false}
            onDrop={(files) => onSendFile(files)}>
            <Dropzone.Accept>
                <Group
                    justify="center"
                    gap="xl"
                    mih={220}>
                    <Upload size={52} fill="var(--mantine-color-blue-6)" />
                    <Box>
                        <Text
                            size="lg"
                            mb="xs"
                            inline>
                            Deja el archivo en esta zona para adjuntarlo
                        </Text>
                        <Text size="sm" c="gray" inline>
                            Soltar el archivo en esta zona lo adjuntara automaticamente
                        </Text>
                    </Box>
                </Group>
            </Dropzone.Accept>
            <Dropzone.Reject>
                <Group
                    justify="center"
                    gap="xl"
                    mih={220}>
                    <X size={52} fill="var(--mantine-color-red-4)" />
                    <Box>
                        <Text
                            size="lg"
                            mb="xs"
                            inline>
                            Archivo no permitido
                        </Text>
                        <Text size="sm" c="gray" inline>
                            El archivo adjuntado no coincide con los tipo de formatos permitidos
                        </Text>
                    </Box>
                </Group>
            </Dropzone.Reject>
            <Dropzone.Idle>
                <Group
                    justify="center"
                    gap="xl"
                    mih={220}>
                    <Image size={52} fill="var(--mantine-color-gray-6)" />
                    <Box>
                        <Text
                            size="lg"
                            mb="xs"
                            inline>
                            {title}
                        </Text>
                        <Text size="sm" c="gray" inline>
                            {subtitle}
                        </Text>
                    </Box>
                </Group>
            </Dropzone.Idle>
        </Dropzone>
    )
}