import { useState } from "react";
import { useNavigate } from "react-router";
import {
    Button,
    Card,
    Grid,
    TextInput
} from "@mantine/core";
import { SlidersHorizontal } from "@phosphor-icons/react";

import { useModal } from "../../../hooks/useModal";
import { AppPaths } from "../../../types";
import { JobSearchFilters } from "./JobSearchFilters";

export const JobSearch = () => {
    const navigate = useNavigate();
    const { openModal } = useModal();
    const [search, setSearch] = useState("");

    return (
        <Card
            p="sm"
            shadow="sm"
            withBorder>
            <Grid grow>
                <Grid.Col span={8}>
                    <TextInput
                        variant="unstyled"
                        placeholder="Nombre Cargo"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search} />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 2 }}>
                    <Button.Group>
                        <Button
                            size="sm"
                            onClick={() => openModal(
                                <JobSearchFilters
                                    searchParam={search} />,
                                "Filtros Busqueda")
                            }>
                            <SlidersHorizontal />
                        </Button>
                        <Button
                            size="sm"
                            variant="default"
                            flex={1}
                            onClick={() => navigate(`${AppPaths.jobBoard}?search=${search}`)}>
                            Buscar
                        </Button>
                    </Button.Group>
                </Grid.Col>
            </Grid>
        </Card>
    )
}