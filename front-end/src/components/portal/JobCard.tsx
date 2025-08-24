import { Link } from "react-router";
import {
    Box,
    Button,
    Card,
    Flex,
    Menu,
    Text
} from "@mantine/core";
import {
    ArrowRight,
    BookmarkSimple,
    FacebookLogo,
    LinkedinLogo,
    ShareNetwork,
    WhatsappLogo
} from "@phosphor-icons/react";

import { AppPaths, SummaryOffer, OfferFeaturedState } from "../../types";
import { useMediaQuery } from "@mantine/hooks";
import { parseDateToLocal } from "../../utilities";

export interface JobCardProps {
    offer: SummaryOffer;
}

export const JobCard = ({ offer }: JobCardProps) => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <Card
            className={`job-card ${offer.featured == 1 ? "featured" : ""}`}
            padding="lg"
            shadow="sm"
            withBorder>
            {offer.featured == OfferFeaturedState.featured && <Box className="job-featured" />}
            <Text
                style={{ wordBreak: "break-word" }}
                c="blue"
                fw="bold"
                lineClamp={2}>
                {offer.title}
            </Text>
            <Text
                c="gray"
                size="xs"
                mb="xs">
                {offer.city && `${offer.city.name} ${offer.city.region.name} |`} {offer.code}
            </Text>
            <Flex
                mb="xs"
                gap="xs"
                direction={(isMobile) ? "column" : "row"}>
                <Link
                    className="react-link"
                    to={`${AppPaths.jobDetail}/${offer.offer_id}`}>
                    <Button
                        size="xs"
                        rightSection={<ArrowRight />}
                        fullWidth>
                        Postular
                    </Button>
                </Link>
                <Menu>
                    <Menu.Target>
                        <Button
                            size="xs"
                            variant="light"
                            rightSection={<ShareNetwork />}>
                            Compartir
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item leftSection={<LinkedinLogo />}>LinkedIn</Menu.Item>
                        <Menu.Item leftSection={<FacebookLogo />}>Facebook</Menu.Item>
                        <Menu.Item leftSection={<WhatsappLogo />}>WhatsApp</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
                <Button
                    size="xs"
                    variant="light"
                    rightSection={<BookmarkSimple />}>
                    Guardar
                </Button>
            </Flex>
            <Text
                c="gray"
                fw="bold"
                size="sm">
                Fecha Publicacion: {parseDateToLocal(offer.publication_date).toLocaleDateString("es-CL")}
            </Text>
        </Card>
    )
}