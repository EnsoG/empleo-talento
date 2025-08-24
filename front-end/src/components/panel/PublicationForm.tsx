import { useNavigate } from "react-router";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    FileInput,
    Group,
    Image,
    LoadingOverlay,
    Select,
    Skeleton,
    Stack,
    Textarea,
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
    const navigate = useNavigate();
    const { openModal } = useModal();
    const { isLoading, fetchData } = useFetch();
    const { data: categories, isLoading: categoriesLoading, fetchData: fetchCategories } = useFetch<PublicationCategories>();
    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            title: publication?.title,
            description: publication?.description,
            state: (type == "add") ? PublicationState.active : publication?.state,
            category_id: publication?.publication_category ? String(publication.publication_category.category_id) : "",
            image: null
        },
        validate: zodResolver((type == "add") ? addPublicationSchema : updatePublicationSchema)
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
            showNotifications: true,
            successMessage: (type == "add")
                ? "Publicacion registrada exitosamente"
                : "Publicacion actualizada exitosamente",
            method: (type == "add") ? "POST" : "PUT",
            body: formData,
            credentials: "include"
        });
        navigate(AppPaths.myPublications);
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
                <Textarea
                    label="Descripcion"
                    placeholder="Ingrese la descripcion"
                    rows={4}
                    key={form.key("description")}
                    {...form.getInputProps("description")} />
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
        </form>
    )
}