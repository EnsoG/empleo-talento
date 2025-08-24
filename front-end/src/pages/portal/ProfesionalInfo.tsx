import {
    SimpleGrid,
    Stack
} from "@mantine/core";

import { PortalLayout } from "../../layouts/PortalLayout";
import { MyProfileLayout } from "../../layouts/MyProfileLayout";
import { PortalBanner } from "../../components/portal/PortalBanner";
import { ProfilePhoto } from "../../components/portal/my_profile/ProfilePhoto";
import { ProfileResume } from "../../components/portal/my_profile/ProfileResume";
import { ProfileEducation } from "../../components/portal/my_profile/ProfileEducation";
import { ProfileExperience } from "../../components/portal/my_profile/ProfileExperience";
import { ProfileCertification } from "../../components/portal/my_profile/ProfileCertification";
import { ProfileSoftware } from "../../components/portal/my_profile/ProfileSoftware";
import { ProfileLanguage } from "../../components/portal/my_profile/ProfileLanguage";

export const ProfesionalInfo = () => {
    return (
        <PortalLayout>
            <PortalBanner title="Mi Perfil" />
            <MyProfileLayout>
                <Stack>
                    <SimpleGrid cols={{ base: 1, md: 2 }}>
                        <ProfilePhoto />
                        <ProfileResume />
                    </SimpleGrid>
                    <ProfileEducation />
                    <ProfileExperience />
                    <ProfileCertification />
                    <ProfileSoftware />
                    <ProfileLanguage />
                </Stack>
            </MyProfileLayout>
        </PortalLayout>
    )
}