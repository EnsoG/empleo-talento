import {
    Badge,
    Button,
    Card,
    Divider,
    Flex,
    List,
    Text
} from "@mantine/core";
import { CheckCircle } from "@phosphor-icons/react";

export interface PricingPlanProps {
    name: string;
    description: string;
    price: number;
    discount?: number;
    features: string[];
}

export const PricingPlan = ({ name, description, price, discount, features }: PricingPlanProps) => {
    return (
        <Card
            className="pricing-card"
            padding="xl"
            shadow="sm"
            radius="lg"
            withBorder>
            <Flex
                direction="column"
                justify="space-between"
                gap="xl"
                w="100%">
                <div>
                    <Text
                        size="lg"
                        fw="bold"
                        mb="sm">
                        {name}
                    </Text>
                    <Text
                        size="sm"
                        mb="lg">
                        {description}
                    </Text>
                    {
                        discount &&
                        <Flex gap="md" align="center">
                            <Text
                                size="lg"
                                td="line-through">
                                $ {price}
                            </Text>
                            <Badge size="lg">Ahorra {discount * 100}%</Badge>
                        </Flex>
                    }
                    <Text size="lg">
                        $ <Text component="span" fw="bold" fz="h1">{discount ? price * discount : price}</Text> / Mes
                    </Text>
                    <Text
                        c="blue"
                        size="sm">
                        *IVA no incluido en el precio presentado
                    </Text>
                </div>
                <div>
                    <Button
                        size="lg"
                        fullWidth
                        mb="sm">
                        Elegir
                    </Button>
                    <Text size="sm">Se renueva a $ {price} cada mes, destacar que puedes cancelar cuando quieras</Text>
                </div>
                <Divider label="Caracteristicas" />
                <List
                    spacing="lg"
                    size="md"
                    icon={<CheckCircle fill="var(--mantine-blue-6)" />}
                    center>
                    {
                        features.map((feature) => (
                            <List.Item key={feature}>{feature}</List.Item>
                        ))
                    }
                </List>
            </Flex>
        </Card>
    )
}