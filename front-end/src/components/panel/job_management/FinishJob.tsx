import { useNavigate } from "react-router";
import {
    Button,
    Card,
    LoadingOverlay,
    Text
} from "@mantine/core";
import { XCircle } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import { AppPaths, Offer, OfferState } from "../../../types";
import { endpoints } from "../../../endpoints";
import { CardSection } from "../../CardSection";
import { ModalConfirmation } from "../../ModalConfirmation";

interface FinishJobProps {
    offerId: Offer["offer_id"];
}

export const FinishJob = ({ offerId }: FinishJobProps) => {
    const navigate = useNavigate();
    const { openModal, closeModal } = useModal();
    const { isLoading, fetchData } = useFetch();

    const finishJob = async () => {
        // Do Request
        await fetchData(`${endpoints.finishJobOffer}/${offerId}`, {
            showNotifications: true,
            successMessage: "Oferta finalizada exitosamente",
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ state: OfferState.finished }),
            credentials: "include"
        });
        // Close Modal And Redirect
        closeModal();
        navigate(AppPaths.myJobs);
    }

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <LoadingOverlay visible={isLoading} />
            <CardSection
                title="Finalizar Oferta"
                icon={XCircle}>
                <Text
                    size="sm"
                    ta="justify">
                    Al confirmar la finalizacion de esta oferta se notificara a todos los candidatos,
                    tanto a los seleccionados como a los que no, por lo que ten en cuenta esto al momento de realizar
                    dicha accion
                </Text>
                <Button
                    color="red"
                    onClick={() => openModal(
                        <ModalConfirmation
                            description="¿Estas seguro de finalizar esta oferta?"
                            btnColor="red"
                            btnLabel="Finalizar"
                            onConfirm={finishJob} />,
                        "Finalizar Oferta"
                    )}>
                    Finalizar Oferta
                </Button>
            </CardSection>
        </Card>
    )
}