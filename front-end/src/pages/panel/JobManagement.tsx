import { useEffect } from "react";
import { useParams } from "react-router";
import { Skeleton } from "@mantine/core";
import { Briefcase } from "@phosphor-icons/react";

import { useAuth } from "../../hooks/useAuth";
import { useFetch } from "../../hooks/useFetch";
import { Offer, UserRole } from "../../types";
import { endpoints } from "../../endpoints";
import { PanelLayout } from "../../layouts/PanelLayout";
import { AdminView } from "../../components/panel/job_management/AdminView";
import { CompanyView } from "../../components/panel/job_management/CompanyView";

export const JobManagement = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const { data, isLoading, fetchData } = useFetch<Offer>();

    const getOffer = async () => await fetchData(`${endpoints.jobOffers}/${id}`, {
        method: "GET",
    });

    useEffect(() => {
        getOffer();
    }, []);

    return (
        <PanelLayout
            pageName="Gestion Oferta"
            PageIcon={Briefcase}>
            <Skeleton
                height="100%"
                visible={isLoading}>
                {(data) && (user?.user_role == UserRole.admin
                    ? <AdminView
                        offer={data}
                        onGetOffer={getOffer} />
                    : <CompanyView
                        offer={data}
                        onGetOffer={getOffer} />)
                }
            </Skeleton>
        </PanelLayout>
    )
}