import { Link } from "react-router";
import {
    Badge,
    Box,
    Button,
    Card,
    Group,
    List,
    Stack,
    Text
} from "@mantine/core";
import {
    ArrowSquareOut,
    Buildings,
    Calendar,
    CalendarX,
    MapPin,
} from "@phosphor-icons/react";

import { AppPaths, SummaryOffer, OfferFeaturedState } from "../../types";
import { parseDateToLocal } from "../../utilities";

export interface JobCardProps {
    offer: SummaryOffer;
}

export const JobCard = ({ offer }: JobCardProps) => {

    return (
        <Card
            className={`job-card ${offer.featured == 1 ? "featured" : ""}`}
            padding="lg"
            shadow="sm"
            withBorder>
            {offer.featured == OfferFeaturedState.featured && <Box className="job-featured" />}
            <Stack gap="xs">
                <Text
                    style={{ wordBreak: "break-word" }}
                    c="blue"
                    fw="bold"
                    lineClamp={2}>
                    {offer.title}
                </Text>
                <Badge
                    variant="light"
                    leftSection={<Buildings />}>
                    {offer.company?.trade_name ?? "Empleo Talento"}
                </Badge>
                <List
                    size="xs"
                    spacing="xs"
                    c="gray"
                    center>
                    {(offer.city) && <List.Item icon={<MapPin />}>{offer.city.region.name} | {offer.city.name}</List.Item>}
                    <List.Item icon={<Calendar />}>Fecha Publicacion: {parseDateToLocal(offer.publication_date).toLocaleDateString("es-CL")}</List.Item>
                    <List.Item icon={<CalendarX />}>Fecha Cierre: {
                        (offer.closing_date)
                            ? parseDateToLocal(offer.closing_date).toLocaleDateString("es-CL")
                            : "Sin Especificar"
                    }
                    </List.Item>
                </List>
                {(offer.description) && <Text size="sm" lineClamp={3}>{offer.description}</Text>}
                <Group justify="space-between">
                    <Text size="xs" c="gray">ID: {offer.code}</Text>
                    <Link
                        className="react-link"
                        to={`${AppPaths.jobDetail}/${offer.offer_id}`}>
                        <Button
                            variant="light"
                            rightSection={<ArrowSquareOut />}>
                            Ver Detalles
                        </Button>
                    </Link>
                </Group>
            </Stack>
        </Card>
    )
}