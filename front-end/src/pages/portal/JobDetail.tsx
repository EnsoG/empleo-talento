import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
    Box,
    Container,
    Image,
    Skeleton,
    Stack
} from "@mantine/core";

import { useFetch } from "../../hooks/useFetch";
import { AppPaths, Offer, OfferState } from "../../types";
import { endpoints } from "../../endpoints";
import { PortalLayout } from "../../layouts/PortalLayout";
import { PortalBanner } from "../../components/portal/PortalBanner";
import { JobCompanyInfo } from "../../components/portal/job_detail/JobCompanyInfo";
import { JobInfo } from "../../components/portal/job_detail/JobInfo";
import portalDivider2 from "../../assets/svg/portal-divider-2.svg";

export const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, fetchData } = useFetch<Offer>();

    const getOffer = async () => {
        // Set URL And Query Params
        const url = new URL(`${endpoints.jobOffers}/${id}`);
        const params = new URLSearchParams({
            company_info: "true",
            question_info: "true"
        });
        url.search = params.toString();
        // Do Request
        await fetchData(url.toString(), {
            errorRedirect: AppPaths.home,
            method: "GET"
        });
    }

    useEffect(() => {
        getOffer();
    }, []);

    useEffect(() => {
        if (data && data?.state != OfferState.active) navigate(AppPaths.jobBoard)
    }, [data]);

    return (
        <PortalLayout>
            <PortalBanner title="Detalle Empleo" />
            <Box
                className="portal-section"
                component="section">
                <Container size="xl">
                    <Skeleton
                        height="100%"
                        width="100%"
                        visible={isLoading}>
                        {data &&
                            <Stack>
                                <JobCompanyInfo
                                    offerTitle={data.title}
                                    company={data.company} />
                                <JobInfo
                                    offer={{
                                        offer_id: data.offer_id,
                                        code: data.code,
                                        position: data.position,
                                        description: data.description,
                                        requirements: data.requirements,
                                        years_experience: data.years_experience,
                                        salary: data.salary,
                                        location: data.location,
                                        publication_date: data.publication_date,
                                        closing_date: data.closing_date,
                                        state: data.state,
                                        featured: data.featured,
                                        performance_area: data.performance_area,
                                        city: data.city,
                                        contract_type: data.contract_type,
                                        job_type: data.job_type,
                                        job_schedule: data.job_schedule,
                                        shift: data.shift,
                                        job_day: data.job_day,
                                        job_questions: data.job_questions
                                    }}
                                    companyDescription={data.company?.description ?? null} />
                            </Stack>
                        }
                    </Skeleton>
                </Container>
                <Image
                    className="portal-divider"
                    src={portalDivider2} />
            </Box>
        </PortalLayout>
    )
}