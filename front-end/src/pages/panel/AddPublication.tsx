import { Card } from "@mantine/core";
import { Plus } from "@phosphor-icons/react";

import { PanelLayout } from "../../layouts/PanelLayout";
import { PublicationForm } from "../../components/panel/PublicationForm";

export const AddPublication = () => {
    return (
        <PanelLayout
            pageName="Agregar Publicacion"
            PageIcon={Plus}>
            <Card
                padding="lg"
                shadow="sm"
                withBorder>
                <PublicationForm type="add" />
            </Card>
        </PanelLayout>
    )
}