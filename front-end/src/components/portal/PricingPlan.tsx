import {
    Box,
    Button,
    Card,
    Center,
    Divider,
    Image,
    Stack,
    Text
} from "@mantine/core";

import { CandidatePlan, CompanyPlan } from "../../types";
import { CLPFormatter } from "../../utilities";
import { endpoints } from "../../endpoints";

interface PricingPlanProps {
    plan: CandidatePlan | CompanyPlan
}

export const PricingPlan = ({ plan }: PricingPlanProps) => {
    const formatedValue = CLPFormatter.format(plan.value);

    return (
        <Card
            className="pricing-card"
            padding="xl"
            shadow="sm"
            radius="lg"
            withBorder>
            <Stack>
                <Box>
                    <Text
                        size="lg"
                        fw="bold"
                        c="blue"
                        mb="sm">
                        {plan.name}
                    </Text>
                    <Center mb="md">
                        <Image
                            src={`${endpoints.staticPlanPhotos}/${plan.photo}`}
                            radius="md"
                            h={100}
                            w={100} />
                    </Center>
                    <Text size="lg">
                        <Text component="span" fw="bold" fz="h1">{formatedValue}</Text> / Mes
                    </Text>
                    <Text
                        c="blue"
                        size="sm">
                        *IVA no incluido en el precio presentado
                    </Text>
                </Box>
                <Button
                    size="md"
                    mb="sm"
                    fullWidth>
                    Elegir
                </Button>
                <Text size="sm">Se renueva a {formatedValue} cada mes, destacar que puedes cancelar cuando quieras</Text>
                <Divider label="Descripcion" />
                <Text size="md">{plan.description}</Text>
            </Stack>
        </Card>
    )
}