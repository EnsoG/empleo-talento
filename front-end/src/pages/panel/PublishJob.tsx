import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import {
    Button,
    Card,
    Group,
    LoadingOverlay,
    Skeleton,
    Stepper
} from "@mantine/core";
import { Plus } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { AppPaths, ContractTypes, GenericPositions, JobDays, JobSchedules, JobTypes, PerformanceAreas, Shifts } from "../../types";
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
    const { data: positions, isLoading: positionsLoading, fetchData: fetchPositions } = useFetch<GenericPositions>();
    const { data: areas, isLoading: areasLoading, fetchData: fetchAreas } = useFetch<PerformanceAreas>();
    const { data: schedules, isLoading: schedulesLoading, fetchData: fetchSchedules } = useFetch<JobSchedules>();
    const { data: jobType, isLoading: jobTypeLoading, fetchData: fetchJobType } = useFetch<JobTypes>();
    const { data: contractType, isLoading: contractLoading, fetchData: fetchContracts } = useFetch<ContractTypes>();
    const { data: shift, isLoading: shiftLoading, fetchData: fetchShifts } = useFetch<Shifts>();
    const { data: jobDay, isLoading: jobDayLoading, fetchData: fetchJobDays } = useFetch<JobDays>();
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
            publication_date: new Date(),
            closing_date: null,
            area_id: null,
            region: "",
            city_id: null,
            type_id: null,
            job_type_id: null,
            shift_id: null,
            day_id: null,
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

    const getPositions = async () => await fetchPositions(endpoints.genericPositions, {
        method: "GET"
    });

    const getAreas = async () => await fetchAreas(endpoints.performanceAreas, {
        method: "GET"
    });

    const getSchedules = async () => await fetchSchedules(endpoints.jobSchedules, {
        method: "GET"
    });

    const getJobTypes = async () => await fetchJobType(endpoints.jobTypes, {
        method: "GET"
    });

    const getContractTypes = async () => await fetchContracts(endpoints.contractTypes, {
        method: "GET"
    });

    const getShifts = async () => await fetchShifts(endpoints.shifts, {
        method: "GET"
    });

    const getJobDays = async () => await fetchJobDays(endpoints.jobDays, {
        method: "GET"
    });

    useEffect(() => {
        getPositions();
        getAreas();
        getSchedules();
        getJobTypes();
        getContractTypes();
        getShifts();
        getJobDays();
    }, []);

    return (
        <PanelLayout
            pageName="Publicar Empleo"
            PageIcon={Plus}>
            <Card
                p="lg"
                shadow="sm"
                withBorder>
                <Skeleton visible={
                    positionsLoading ||
                    areasLoading ||
                    schedulesLoading ||
                    jobTypeLoading ||
                    contractLoading ||
                    shiftLoading ||
                    jobDayLoading
                }>
                    <LoadingOverlay visible={isLoading} />
                    <Stepper
                        active={active}
                        mb="md">
                        <Stepper.Step label="Paso 1" description="Informacion">
                            <PublishJobFormOne
                                form={form}
                                positions={positions?.generic_positions ?? []}
                                performanceAreas={areas?.performance_areas ?? []}
                                jobSchedules={schedules?.job_schedules ?? []}
                                jobTypes={jobType?.job_types ?? []}
                                contractTypes={contractType?.contract_types ?? []}
                                shifts={shift?.shifts ?? []}
                                jobDays={jobDay?.job_days ?? []} />
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
                </Skeleton>
            </Card>
        </PanelLayout>
    )
}