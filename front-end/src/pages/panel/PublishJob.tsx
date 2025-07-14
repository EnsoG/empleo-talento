import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    Card,
    Group,
    LoadingOverlay,
    Stepper
} from "@mantine/core";
import { Plus } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { AppPaths, GenericPosition, PerformanceArea } from "../../types";
import { endpoints } from "../../endpoints";
import { getTomorrowDate, removeDateTime } from "../../utilities";
import { publishJobFullSchema, publishJobOneSchema, publishJobTwoSchema } from "../../schemas/panelSchemas";
import { PanelLayout } from "../../layouts/PanelLayout";
import { PublishJobFormOne } from "../../components/panel/publish_job/PublishJobFormOne";
import { PublishJobFormTwo } from "../../components/panel/publish_job/PublishJobFormTwo";

type PublishJobFormType = z.infer<typeof publishJobFullSchema>;

export const PublishJob = () => {
    const navigate = useNavigate();
    const { isLoading, fetchData } = useFetch();
    const { data: positions, fetchData: fetchPositions } = useFetch<GenericPosition[]>();
    const { data: areas, fetchData: fetchAreas } = useFetch<PerformanceArea[]>();
    const [active, setActive] = useState<number>(0);
    const form = useForm<PublishJobFormType>({
        mode: "controlled",
        initialValues: {
            title: "",
            position: "",
            has_generic_position: false,
            generic_position_id: null,
            description: "",
            requirements: "",
            years_experience: "",
            salary: null,
            location: "",
            publication_date: getTomorrowDate(),
            closing_date: null,
            area_id: null,
            region: "",
            city_id: null,
            type_id: null,
            job_type: null,
            shift: null,
            job_day: null,
            schedule_id: null,
            questions: []
        },
        validate: zodResolver(active == 0 ? publishJobOneSchema : publishJobTwoSchema)
    });

    const nextStep = async () => {
        form.clearErrors();
        // Transform Values And Delete Unnecessary Field
        const data = publishJobFullSchema.safeParse(form.values);
        delete data.data?.has_generic_position;
        delete data.data?.region;
        // Check Form Errors
        if (!data.success) {
            const stepErrors = data.error.formErrors.fieldErrors;
            form.setErrors(stepErrors);
            return;
        }
        // Get Publication And Closing Date To Remove Time
        const { publication_date, closing_date, ...rest } = data.data;
        // After Complete Info, Create Job Offer And Redirect To MyJobs Page
        if (active == 1) {
            await fetchData(endpoints.jobOffers, {
                showNotifications: true,
                successMessage: "Oferta creada exitosamente",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    publication_date: removeDateTime(publication_date),
                    closing_date: closing_date ? removeDateTime(closing_date) : null,
                    ...rest
                }),
                credentials: "include"
            });
            navigate(AppPaths.myJobs);
            return;
        }

        setActive((current) => current + 1);
    }

    const prevStep = () => setActive((current) => current - 1);

    const getPositions = async () => await fetchPositions(endpoints.getGenericPositions, {
        method: "GET",
        credentials: "include"
    });

    const getAreas = async () => await fetchAreas(endpoints.getPerformanceAreas, {
        method: "GET",
        credentials: "include"
    });

    useEffect(() => {
        getPositions();
        getAreas();
    }, []);

    return (
        <PanelLayout
            pageName="Publicar Empleo"
            PageIcon={Plus}>
            <Card
                p="lg"
                shadow="sm"
                withBorder>
                <LoadingOverlay visible={isLoading} />
                <Stepper
                    active={active}
                    mb="md">
                    <Stepper.Step label="Paso 1" description="Informacion">
                        <PublishJobFormOne
                            form={form}
                            positions={positions ?? []}
                            areas={areas ?? []} />
                    </Stepper.Step>
                    <Stepper.Step label="Paso 2" description="Preguntas">
                        <PublishJobFormTwo form={form} />
                    </Stepper.Step>
                </Stepper>
                <Group justify="flex-end">
                    {active !== 0 &&
                        <Button onClick={prevStep}>
                            Volver
                        </Button>
                    }
                    {active < 2 &&
                        <Button onClick={nextStep}>
                            {active === 1 ? "Publicar" : "Siguiente"}
                        </Button>
                    }
                </Group>
            </Card>
        </PanelLayout>
    )
}