import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
    Alert,
    Box,
    Card,
    Center,
    Container,
    Divider,
    Grid,
    Group,
    Image,
    List,
    Pagination,
    SimpleGrid,
    Skeleton,
    Stack,
    Tabs,
    Text,
    Title
} from "@mantine/core";
import { Briefcase, Building, Envelope, Factory, Globe, Info, Phone } from "@phosphor-icons/react";

import { useFetch } from "../../hooks/useFetch";
import { AppPaths, CompanyPanel, Offers } from "../../types";
import { endpoints } from "../../endpoints";
import { PortalLayout } from "../../layouts/PortalLayout";
import { PortalBanner } from "../../components/portal/PortalBanner";
import banner from "../../assets/img/company-overview-banner.jpg"
import testImg from "../../assets/img/company-overview-test.jpg";
import portalDivider2 from "../../assets/svg/portal-divider-2.svg";
import { FilterCollapse } from "../../components/FilterCollapse";
import { JobFilters } from "../../components/JobFilters";
import { SearchBar } from "../../components/SearchBar";
import { JobCard } from "../../components/portal/JobCard";

export const CompanyOverview = () => {
    const { id } = useParams();
    const { data: company, isLoading, fetchData } = useFetch<CompanyPanel>();
    const { data: offers, isLoading: offersLoading, fetchData: fetchOffers } = useFetch<Offers>();
    const [activePage, setPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: "",
        region: "",
        city: "",
        contract: "",
        job_type: ""
    });
    const totalPages = offers?.total_offers ? Math.ceil(offers.total_offers / 5) : 1;

    const getOffers = async (tradeName: string) => {
        if (!tradeName) return;
        // Set URL And Query Params
        const url = new URL(endpoints.jobOffers);
        const params = new URLSearchParams({
            source: "portal",
            company: tradeName,
            page: String(activePage),
            ...Object.fromEntries(
                Object.entries(filters).filter(
                    ([_, value]) => value !== null && value !== undefined && value !== ""
                )
            )
        });
        url.search = params.toString()
        // Do Request
        await fetchOffers(url.toString(), {
            method: "GET"
        });
    }

    const updateFilter = (key: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value
        }));
    }

    const handleSearch = () => {
        setPage(1);
        if (company?.trade_name) getOffers(company.trade_name);
    }


    const getCompany = async () => await fetchData(`${endpoints.companies}/${id}`, {
        errorRedirect: AppPaths.home,
        method: "GET"
    });

    useEffect(() => {
        if (company?.trade_name) getOffers(company.trade_name);
    }, [activePage, company]);

    useEffect(() => {
        getCompany();
    }, []);

    return (
        <PortalLayout>
            <PortalBanner title="Presentacion Empresa" />
            <Box
                className="portal-section"
                component="section">
                <Container size="xl">
                    <Skeleton
                        height="100%"
                        visible={isLoading}>
                        <Card
                            p="lg"
                            shadow="sm"
                            mb="md"
                            withBorder>
                            <Group align="start">
                                {(company?.logo) &&
                                    <Image
                                        src={`${endpoints.staticLogos}/${company?.logo}`}
                                        h={100}
                                        w={100} />
                                }
                                <List
                                    c="gray"
                                    size="sm"
                                    spacing="xs"
                                    listStyleType="none"
                                    center>
                                    <List.Item>
                                        <Text
                                            size="lg"
                                            fw="bold"
                                            c="blue">
                                            {company?.trade_name}
                                        </Text>
                                    </List.Item>
                                    {company?.company_sector && <List.Item icon={<Factory color="var(--mantine-blue-6)" />}>{company.company_sector.name}</List.Item>}
                                    {company?.web && <List.Item icon={<Globe color="var(--mantine-blue-6)" />}>{company.web}</List.Item>}
                                </List>
                            </Group>
                        </Card>
                        <Tabs
                            defaultValue="company"
                            variant="pills">
                            <Card
                                p="sm"
                                shadow="sm"
                                w="fit-content"
                                mb="md"
                                withBorder>
                                <Tabs.List w="fit-content">
                                    <Tabs.Tab
                                        value="company"
                                        leftSection={<Building />}>
                                        <Text size="md">La Empresa</Text>
                                    </Tabs.Tab>
                                    <Tabs.Tab
                                        value="jobs"
                                        leftSection={<Briefcase />}>
                                        <Text size="md">Ofertas</Text>
                                    </Tabs.Tab>
                                </Tabs.List>
                            </Card>
                            <Tabs.Panel value="company">
                                <Title
                                    order={2}
                                    fw="bold"
                                    mb="md"
                                    c="blue"
                                    size="lg">
                                    Acerca de <Text component="span" c="blue" size="lg" fw="bold">{company?.trade_name}</Text>
                                </Title>
                                <Image
                                    src={banner}
                                    radius="md"
                                    fit="cover"
                                    w="100%"
                                    mah={300} />
                                <Divider my="xl" />
                                <SimpleGrid
                                    cols={{ base: 1, md: 2 }}
                                    mb="md">
                                    <Image
                                        src={testImg}
                                        radius="md"
                                        fit="cover"
                                        w="100%" />
                                    <Stack>
                                        <Text c="blue" fw="bold" size="xl">¿Quienes Somos?</Text>
                                        <Text>{company?.description ?? "Sin especificar"}</Text>
                                    </Stack>
                                </SimpleGrid>
                                <SimpleGrid cols={{ base: 1, md: 2 }}>
                                    <Stack>
                                        <Text c="blue" fw="bold" size="xl">Contacta Con Nosotros</Text>
                                        <Text>
                                            En nuestra empresa disponemos de distintos canales de comunicacion
                                            para diferentes propositos, a continuacion te presentamos cada uno de ellos:
                                        </Text>
                                        <List
                                            spacing="lg"
                                            listStyleType="none"
                                            center>
                                            <List.Item icon={<Envelope color="var(--mantine-blue-6)" />}>Correo Electronico: {company?.email}</List.Item>
                                            <List.Item icon={<Phone color="var(--mantine-blue-6)" />}>Numero Telefonico: {company?.phone ?? "Sin especificar"}</List.Item>
                                            <List.Item icon={<Globe color="var(--mantine-blue-6)" />}>Pagina Web: {company?.web ?? "Sin especificar"}</List.Item>
                                        </List>
                                    </Stack>
                                    <Image
                                        src={testImg}
                                        radius="md"
                                        fit="cover"
                                        w="100%" />
                                </SimpleGrid>
                            </Tabs.Panel>
                            <Tabs.Panel value="jobs">
                                <Grid>
                                    <Grid.Col span={{ base: 12, lg: 3 }}>
                                        <FilterCollapse>
                                            <JobFilters
                                                filters={filters}
                                                onUpdateFilter={updateFilter} />
                                        </FilterCollapse>
                                    </Grid.Col>
                                    <Grid.Col span={{ base: 12, lg: 9 }}>
                                        <SearchBar
                                            value={filters.search}
                                            placeholder="Busqueda laboral"
                                            onChange={(v) => updateFilter("search", v)}
                                            onSearch={handleSearch} />
                                        <Skeleton
                                            height="100%"
                                            visible={offersLoading}
                                            mt="md">
                                            <Stack>
                                                {(offers?.offers.length !== 0)
                                                    ? offers?.offers.map((o) => (
                                                        <JobCard
                                                            key={o.offer_id}
                                                            offer={o} />
                                                    ))
                                                    : <Alert
                                                        title="Sin Ofertas Laborales"
                                                        variant="outline"
                                                        bg="white"
                                                        icon={<Info />}>
                                                        No se han encontrado ofertas laborales
                                                    </Alert>
                                                }
                                                <Center>
                                                    <Pagination
                                                        total={totalPages}
                                                        onChange={setPage} />
                                                </Center>
                                            </Stack>
                                        </Skeleton>
                                    </Grid.Col>
                                </Grid>
                            </Tabs.Panel>
                        </Tabs>
                    </Skeleton>
                </Container>
                <Image
                    className="portal-divider"
                    src={portalDivider2} />
            </Box>
        </PortalLayout >
    )
}