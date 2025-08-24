import { useEffect } from "react";
import { useNavigate } from "react-router";
import {
    Button,
    Card,
    List,
    Menu,
    Stack,
    Text
} from "@mantine/core";
import {
    Building,
    CheckFat,
    ClipboardText,
    FacebookLogo,
    Handshake,
    LinkedinLogo,
    ListBullets,
    MapPin,
    Target,
    UserGear,
    WhatsappLogo
} from "@phosphor-icons/react";

import { useAuth } from "../../../hooks/useAuth";
import { useFetch } from "../../../hooks/useFetch";
import { useModal } from "../../../hooks/useModal";
import {
    AppPaths,
    Company,
    Offer,
    UserRole
} from "../../../types";
import { endpoints } from "../../../endpoints";
import { CLPFormatter } from "../../../utilities";
import { CardSection } from "../../CardSection";
import { JobQuestionsForm } from "./JobQuestionsForm";

interface JobInfoProps {
    offer: Omit<Offer, "title" | "company">;
    companyDescription: Company["description"];
}

export const JobInfo = ({ offer, companyDescription }: JobInfoProps) => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const { isLoading, isSuccess, fetchData } = useFetch();
    const { closeModal, openModal } = useModal();

    const handlePostulation = async () => {
        // If User Is Not Logged In, Redirect To Login
        if (!isAuthenticated) return navigate(AppPaths.login);
        // If Job Offer Has Questions, Open Modal
        if (offer.job_questions.length > 0) return openModal(
            <JobQuestionsForm
                offerId={offer.offer_id}
                questions={offer.job_questions}
                onCloseModal={closeModal} />,
            "Preguntas Empleo"
        );
        // Do Request
        await fetchData(endpoints.postulations, {
            showNotifications: true,
            successMessage: "Postulacion realizada exitosamente",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                offer_id: offer.offer_id
            }),
            credentials: "include"
        });
    }
    // Redirect If Request Is Successful
    useEffect(() => {
        if (isSuccess) navigate(AppPaths.postulations);
    }, [isSuccess])

    return (
        <Card
            padding="lg"
            shadow="sm"
            withBorder>
            <Stack>
                <CardSection title="Descripcion Empresa" icon={Building}>
                    <Text size="sm">
                        {companyDescription ?? "Sin especificar"}
                    </Text>
                </CardSection>
                <CardSection title="Descripcion Oferta" icon={ClipboardText}>
                    <Text size="sm">
                        {offer.description ?? "Sin especificar"}
                    </Text>
                </CardSection>
                <CardSection title="Ubicacion" icon={MapPin}>
                    <Text size="sm">
                        {(offer.city) ? `${offer.city.name}, ${offer.city.region.name}` : "Sin especificar"}
                    </Text>
                </CardSection>
                <CardSection title="Cargo" icon={UserGear}>
                    <Text size="sm">
                        {offer.position ?? "Sin especificar"}
                    </Text>
                </CardSection>
                <CardSection title="Mision Cargo" icon={Target}>
                    <Text size="sm">
                        Sin especificar
                    </Text>
                </CardSection>
                <CardSection title="Responsabilidades" icon={CheckFat}>
                    <Text size="sm">
                        Sin especificar
                    </Text>
                </CardSection>
                <CardSection title="Requisitos del Cargo" icon={ListBullets}>
                    <Text size="sm">
                        {offer.requirements ?? "Sin especificar"}
                    </Text>
                </CardSection>
                <CardSection title="¿Que Ofrecemos?" icon={Handshake}>
                    <List
                        spacing="sm"
                        size="sm"
                        center>
                        <List.Item>Tipo Contrato: {offer.contract_type?.name ?? "Sin especificar"}</List.Item>
                        <List.Item>Jornada: {offer.job_type?.name ?? "Sin especificar"}</List.Item>
                        <List.Item>Turno: {offer.shift?.name ?? "Sin especificar"}</List.Item>
                        <List.Item>Horario: {offer.job_schedule?.name ?? "Sin especificar"}</List.Item>
                        <List.Item>Dia Laboral: {offer.job_day?.name ?? "Sin especificar"}</List.Item>
                        <List.Item>Renta Liquida: {(offer.salary) ? CLPFormatter.format(offer.salary) : "Sin especificar"}</List.Item>
                        <List.Item>Beneficios: Sin especificar</List.Item>
                    </List>
                </CardSection>
                {(user?.user_role === UserRole.candidate) &&
                    <Button
                        disabled={isLoading}
                        onClick={handlePostulation}>
                        Postular
                    </Button>
                }
                <Menu>
                    <Menu.Target>
                        <Button variant="light">
                            Compartir
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item leftSection={<LinkedinLogo />}>LinkedIn</Menu.Item>
                        <Menu.Item leftSection={<FacebookLogo />}>Facebook</Menu.Item>
                        <Menu.Item leftSection={<WhatsappLogo />}>WhatsApp</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Stack>
        </Card>
    )
}