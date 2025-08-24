import {
    Box,
    Card,
    Group,
    Image,
    List,
    Text
} from "@mantine/core";
import {
    Building,
    Factory,
    Globe,
} from "@phosphor-icons/react";

import { AppPaths, Offer } from "../../../types";
import { endpoints } from "../../../endpoints";
import { Link } from "react-router";

interface JobCompanyInfoProps {
    offerTitle: Offer["title"];
    company: Offer["company"];
}

export const JobCompanyInfo = ({ offerTitle, company }: JobCompanyInfoProps) => {
    return (
        <Card
            p="lg"
            shadow="sm"
            withBorder>
            <Group>
                {company?.logo &&
                    <Image
                        src={`${endpoints.staticLogos}/${company?.logo}`}
                        radius="md"
                        h={75}
                        w={75} />
                }
                <Box>
                    <Text
                        c="blue"
                        size="md"
                        fw="bold"
                        mb="xs">
                        {offerTitle}
                    </Text>
                    <List
                        c="gray"
                        size="xs"
                        spacing="xs"
                        center>
                        {company?.trade_name &&
                            <List.Item icon={<Building color="var(--mantine-blue-6)" />}>
                                <Link
                                    className="react-link-primary"
                                    to={`${AppPaths.companyOverview}/${company.company_id}`}>
                                    {company.trade_name}
                                </Link>
                            </List.Item>
                        }
                        {company?.company_sector && <List.Item icon={<Factory color="var(--mantine-blue-6)" />}>{company.company_sector.name}</List.Item>}
                        {company?.web && <List.Item icon={<Globe color="var(--mantine-blue-6)" />}>{company.web}</List.Item>}
                    </List>
                </Box>
            </Group>
        </Card>
    )
}
