import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
    Button,
    Select,
    Stack,
} from "@mantine/core";
import { MagnifyingGlass } from "@phosphor-icons/react";

import { useFetch } from "../../../hooks/useFetch";
import { useMetadata } from "../../../hooks/useMetadata";
import { endpoints } from "../../../endpoints";
import { AppPaths, City } from "../../../types";
import { useModal } from "../../../hooks/useModal";

interface JobSearchFiltersProps {
    searchParam: string;
}

export const JobSearchFilters = ({ searchParam }: JobSearchFiltersProps) => {
    const navigate = useNavigate();
    const { metadata } = useMetadata();
    const { data: cities, isLoading: citiesLoading, fetchData: fetchCities } = useFetch<City[]>();
    const { closeModal } = useModal();
    const [filters, setFilters] = useState<{ [key: string]: string }>({
        search: searchParam,
        region: "",
        city: ""
    });

    const updateFilter = (key: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value
        }));
    }

    const getCities = async () => await fetchCities(`${endpoints.getCities}?region=${filters.region}`, {
        method: "GET"
    });

    const searchOffers = () => {
        // Set URL And Query Params
        const params = new URLSearchParams({
            ...Object.fromEntries(
                Object.entries(filters).filter(
                    ([_, value]) => value !== null && value !== undefined && value !== ""
                )
            )
        });
        closeModal();
        navigate(`${AppPaths.jobBoard}?${params.toString()}`)
    }

    useEffect(() => {
        if (filters.region != "") getCities();
    }, [filters.region]);

    return (
        <Stack>
            <Select
                label="Region"
                placeholder="Seleccione una region"
                comboboxProps={{ position: 'bottom', middlewares: { flip: false, shift: false } }}
                data={metadata.regions.map((r) => ({
                    value: String(r.number_region),
                    label: r.name
                }))}
                value={filters.region}
                onChange={(value) => updateFilter("region", value ?? "")}
                searchable
                clearable />
            <Select
                label="Ciudad"
                placeholder="Seleccione una ciudad"
                comboboxProps={{ position: 'bottom', middlewares: { flip: false, shift: false } }}
                data={cities?.map((c) => ({
                    value: String(c.city_id),
                    label: c.name
                }))}
                disabled={!filters.region || citiesLoading}
                value={filters.city}
                onChange={(value) => updateFilter("city", value ?? "")}
                searchable
                clearable />
            <Button
                leftSection={<MagnifyingGlass />}
                onClick={searchOffers}>
                Buscar
            </Button>
        </Stack>
    )
}