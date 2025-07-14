import { useEffect } from "react";
import { Select, TextInput } from "@mantine/core";

import { useMetadata } from "../hooks/useMetadata";
import { useFetch } from "../hooks/useFetch";
import { City, jobTypes, OfferState } from "../types";
import { endpoints } from "../endpoints";

interface JobFiltersProps {
    filters: { [key: string]: string };
    showCompanyFilter?: boolean;
    showJobStateFilter?: boolean;
    onUpdateFilter: (key: string, value: string) => void;
}

export const JobFilters = ({ filters, showCompanyFilter = false, showJobStateFilter = false, onUpdateFilter }: JobFiltersProps) => {
    const { metadata } = useMetadata();
    const { data: cities, isLoading: citiesLoading, fetchData: fetchCities } = useFetch<City[]>();

    const getCities = async () => await fetchCities(`${endpoints.getCities}?region=${filters.region}`, {
        method: "GET"
    });

    useEffect(() => {
        if (filters.region != "") getCities();
    }, [filters.region]);

    return (
        <>
            {(showCompanyFilter) &&
                <TextInput
                    label="Nombre empresa"
                    placeholder="Ingrese el nombre de la empresa"
                    value={filters.company}
                    onChange={(e) => onUpdateFilter("company", e.target.value)} />
            }
            <Select
                label="Region"
                placeholder="Seleccione una region"
                data={metadata.regions.map((r) => ({
                    value: String(r.number_region),
                    label: r.name
                }))}
                value={filters.region}
                onChange={(value) => onUpdateFilter("region", value ?? "")}
                searchable
                clearable />
            <Select
                label="Ciudad"
                placeholder="Seleccione una ciudad"
                data={cities?.map((c) => ({
                    value: String(c.city_id),
                    label: c.name
                }))}
                disabled={!filters.region || citiesLoading}
                value={filters.city}
                onChange={(value) => onUpdateFilter("city", value ?? "")}
                searchable
                clearable />
            <Select
                label="Tipo Contrato"
                placeholder="Seleccione el tipo de contrato"
                data={metadata.contract_types.map((c) => ({
                    value: String(c.type_id),
                    label: c.name
                }))}
                value={filters.contract}
                onChange={(value) => onUpdateFilter("contract", value ?? "")}
                searchable
                clearable />
            <Select
                label="Tipo Jornada"
                placeholder="Seleccione el tipo de jornada"
                data={jobTypes}
                value={filters.job_type}
                onChange={(value) => onUpdateFilter("job_type", value ?? "")}
                searchable
                clearable />
            {(showJobStateFilter) &&
                <Select
                    label="Tipo Estado"
                    placeholder="Seleccione el tipo de estado"
                    data={Object.values(OfferState)}
                    value={filters.state}
                    onChange={(value) => onUpdateFilter("state", value ?? "")}
                    searchable
                    clearable />
            }
        </>
    )
}
