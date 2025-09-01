import { useForm, zodResolver } from "@mantine/form";
import { useEditor } from "@tiptap/react";
import { RichTextEditor, Link } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import {
    Box,
    Button,
    FileInput,
    Group,
    Image,
    InputLabel,
    LoadingOverlay,
    Select,
    Skeleton,
    Stack,
    Text,
    TextInput
} from "@mantine/core";
import { Eye } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { useModal } from "../../hooks/useModal";
import { AppPaths, Publication, PublicationCategories, PublicationState } from "../../types";
import { addPublicationSchema, updatePublicationSchema } from "../../schemas/panelSchemas";
import { endpoints } from "../../endpoints";
import { useEffect } from "react";

interface PublicationFormProps {
    type: "add" | "update";
    publication?: Publication;
}

export const PublicationForm = ({ type, publication }: PublicationFormProps) => {
    const { openModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const { data: categories, isLoading: categoriesLoading, fetchData: fetchCategories } = useFetch<PublicationCategories>();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            title: publication?.title ?? "",
            description: publication?.description ?? "",
            state: (type == "add") ? PublicationState.active : publication?.state,
            category_id: publication?.publication_category ? String(publication.publication_category.category_id) : "",
            image: (type == "add") ? undefined : null
        },
        validate: zodResolver((type == "add") ? addPublicationSchema : updatePublicationSchema)
    });
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: (publication?.description) ? publication.description : undefined,
        onUpdate: ({ editor }) => {
            form.setFieldValue("description", editor.getHTML());
        }
    });

    const getCategories = async () => await fetchCategories(endpoints.publicationCategories, {
        method: "GET"
    });

    const handleSubmit = async (values: typeof form.values) => {
        // Transform Data And Create Form Data
        const schema = (type == "add") ? addPublicationSchema : updatePublicationSchema;
        const data = schema.parse(values);
        const formData = new FormData();
        formData.append("payload", JSON.stringify({
            title: data.title,
            description: data.description,
            state: data.state,
            category_id: data.category_id
        }));
        if (data.image) formData.append("image", data.image);
        // Do Request And Redirect To My Publications Page
        await fetchData(`${endpoints.publications}${(type == "add") ? "" : `/${publication?.publication_id}`}`, {
            successRedirect: AppPaths.myPublications,
            showNotifications: true,
            successMessage: (type == "add")
                ? "Publicacion registrada exitosamente"
                : "Publicacion actualizada exitosamente",
            method: (type == "add") ? "POST" : "PUT",
            body: formData,
            credentials: "include"
        });
    }

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={isLoading} />
            <Stack>
                <TextInput
                    label="Titulo"
                    placeholder="Ingrese el titulo"
                    maxLength={100}
                    key={form.key("title")}
                    {...form.getInputProps("title")}
                    withAsterisk />
                <Box>
                    <InputLabel required>
                        Descripcion
                    </InputLabel>
                    <RichTextEditor editor={editor}>
                        <RichTextEditor.Toolbar>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Bold />
                                <RichTextEditor.Italic />
                                <RichTextEditor.Underline />
                                <RichTextEditor.Strikethrough />
                                <RichTextEditor.ClearFormatting />
                                <RichTextEditor.Highlight />
                                <RichTextEditor.Code />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.H1 />
                                <RichTextEditor.H2 />
                                <RichTextEditor.H3 />
                                <RichTextEditor.H4 />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Blockquote />
                                <RichTextEditor.Hr />
                                <RichTextEditor.BulletList />
                                <RichTextEditor.OrderedList />
                                <RichTextEditor.Subscript />
                                <RichTextEditor.Superscript />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Link />
                                <RichTextEditor.Unlink />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.AlignLeft />
                                <RichTextEditor.AlignCenter />
                                <RichTextEditor.AlignJustify />
                                <RichTextEditor.AlignRight />
                            </RichTextEditor.ControlsGroup>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Undo />
                                <RichTextEditor.Redo />
                            </RichTextEditor.ControlsGroup>
                        </RichTextEditor.Toolbar>
                        <RichTextEditor.Content />
                    </RichTextEditor>
                    {form.errors.description &&
                        <Text size="sm" c="red">
                            {form.errors.description}
                        </Text>
                    }
                </Box>
                {(type == "update") &&
                    <Select
                        label="Estado"
                        placeholder="Seleccione el estado"
                        key={form.key("state")}
                        {...form.getInputProps("state")}
                        data={Object.values(PublicationState)}
                        withAsterisk />
                }
                <Skeleton
                    height="100%"
                    visible={categoriesLoading}>
                    {(categories) &&
                        <Select
                            label="Categoria Publicacion"
                            placeholder="Seleccione una categoria de publicacion"
                            data={categories.publication_categories.map((c) => ({
                                value: String(c.category_id),
                                label: c.name
                            }))}
                            key={form.key("category_id")}
                            {...form.getInputProps("category_id")}
                            searchable
                            withAsterisk />
                    }
                </Skeleton>
                <Group align="flex-end">
                    <FileInput
                        label={(type == "add") ? "Imagen" : "Actualizar Imagen"}
                        placeholder="Seleccione la imagen"
                        accept="image/jpeg"
                        flex={1}
                        key={form.key("image")}
                        {...form.getInputProps("image")}
                        withAsterisk={type == "add"} />
                    {(type == "update") &&
                        <Button
                            leftSection={<Eye />}
                            onClick={() => openModal(
                                <Image
                                    src={`${endpoints.staticPublicationImages}/${publication?.image}`}
                                    radius="md" />,
                                "Imagen Actual"
                            )}>
                            Ver Imagen Actual
                        </Button>
                    }
                </Group>
                <Button type="submit">
                    {(type == "add") ? "Agregar" : "Actualizar"}
                </Button>
            </Stack>
        </form >
    )
}