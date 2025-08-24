import {
    Box,
    Container,
    Grid,
    Image
} from "@mantine/core";
import { PropsWithChildren } from "react";

import { ProfileSidebar } from "../components/portal/my_profile/ProfileSidebar";
import portalDivider2 from "../assets/svg/portal-divider-2.svg";

interface MyProfileLayoutProps extends PropsWithChildren { }

export const MyProfileLayout = ({ children }: MyProfileLayoutProps) => {
    return (
        <Box id="my-profile-layout">
            <Container size="xl">
                <Grid>
                    <Grid.Col span={{ base: 12, lg: 4 }}>
                        <ProfileSidebar />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, lg: 8 }}>
                        {children}
                    </Grid.Col>
                </Grid>
            </Container>
            <Image
                className="portal-divider"
                src={portalDivider2} />
        </Box>
    )
}