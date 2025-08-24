import { Card } from "@mantine/core";
import { Plus } from "@phosphor-icons/react";

import { PanelLayout } from "../../layouts/PanelLayout";
import { PlanForm } from "../../components/panel/PlanForm";

export const AddCompanyPlan = () => {
    return (
        <PanelLayout
            pageName="Agregar Plan Empresa"
            PageIcon={Plus}>
            <Card
                padding="lg"
                shadow="sm"
                withBorder>
                <PlanForm
                    type="add"
                    planType="company" />
            </Card>
        </PanelLayout>
    )
}