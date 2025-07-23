import { Plus } from "@phosphor-icons/react";

import { PanelLayout } from "../../layouts/PanelLayout";
import { Card } from "@mantine/core";
import { CandidatePlanForm } from "../../components/panel/CandidatePlanForm";

export const AddCandidatePlan = () => {
    return (
        <PanelLayout
            pageName="Agregar Plan Candidato"
            PageIcon={Plus}>
            <Card
                padding="lg"
                shadow="sm"
                withBorder>
                <CandidatePlanForm type="add" />
            </Card>
        </PanelLayout>
    )
}