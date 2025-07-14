import {
    Box,
    Center,
    Image,
    Title
} from "@mantine/core";

import portalDivider from "../../assets/svg/portal-divider.svg";

interface PortalBannerProps {
    title: string;
}

export const PortalBanner = ({ title }: PortalBannerProps) => {
    return (
        <Box id="portal-banner">
            <Center>
                <Title
                    order={1}
                    tt="uppercase">
                    {title}
                </Title>
            </Center>
            <Image
                className="portal-divider"
                src={portalDivider} />
        </Box>
    )
}