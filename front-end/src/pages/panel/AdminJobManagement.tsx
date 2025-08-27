import { Buildings } from "@phosphor-icons/react";

import { PanelLayout } from "../../layouts/PanelLayout";
import { AdminCodelcoPanelEnhanced } from "../../components/AdminCodelcoPanelEnhanced";
import { EmpleosExternos } from "../../components/EmpleosExternos";
import { Stack, Title, Space } from "@mantine/core";

export const AdminJobManagement = () => {
    return (
        <PanelLayout
            pageName="Gestión de Empleos Externos"
            PageIcon={Buildings}
        >
            <Stack gap="xl">
                <div>
                    <Title order={2}>Control de Scraper Codelco</Title>
                    <Space h="md" />
                    <AdminCodelcoPanelEnhanced />
                </div>
                
                <div>
                    <Title order={2}>Empleos Externos</Title>
                    <Space h="md" />
                    <EmpleosExternos />
                </div>
            </Stack>
        </PanelLayout>
    );
};
