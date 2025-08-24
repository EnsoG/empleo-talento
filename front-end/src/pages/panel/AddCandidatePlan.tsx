import { Plus } from "@phosphor-icons/react";

import { PanelLayout } from "../../layouts/PanelLayout";
import { Card } from "@mantine/core";
import { PlanForm } from "../../components/panel/PlanForm";

export const AddCandidatePlan = () => {
    return (
        <PanelLayout
            pageName="Agregar Plan Candidato"
            PageIcon={Plus}>
            <Card
                padding="lg"
                shadow="sm"
                withBorder>
                <PlanForm
                    type="add"
                    planType="candidate" />
            </Card>
        </PanelLayout>
    )
}