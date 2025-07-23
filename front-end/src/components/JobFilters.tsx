import { useEffect } from "react";
import { Select, Skeleton, TextInput } from "@mantine/core";

import { useMetadata } from "../hooks/useMetadata";
import { useFetch } from "../hooks/useFetch";
import { City, ContractTypes, JobTypes, OfferState } from "../types";
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
    const { data: jobType, isLoading: jobTypeLoading, fetchData: fetchJobTypes } = useFetch<JobTypes>();
    const { data: contractType, isLoading: contractLoading, fetchData: fetchContracts } = useFetch<ContractTypes>();

    const getCities = async () => await fetchCities(`${endpoints.getCities}?region=${filters.region}`, {
        method: "GET"
    });

    const getJobTypes = async () => await fetchJobTypes(endpoints.jobTypes, {
        method: "GET"
    });

    const getContracts = async () => await fetchContracts(endpoints.contractTypes, {
        method: "GET"
    });

    useEffect(() => {
        if (filters.region != "") getCities();
    }, [filters.region]);

    useEffect(() => {
        getJobTypes();
        getContracts();
    }, [])

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
            <Skeleton visible={contractLoading}>
                {(contractType) &&
                    <Select
                        label="Tipo Contrato"
                        placeholder="Seleccione el tipo de contrato"
                        data={contractType.contract_types.map((c) => ({
                            value: String(c.type_id),
                            label: c.name
                        }))}
                        value={filters.contract}
                        onChange={(value) => onUpdateFilter("contract", value ?? "")}
                        searchable
                        clearable />
                }
            </Skeleton>
            <Skeleton visible={jobTypeLoading}>
                {(jobType) &&
                    <Select
                        label="Tipo Jornada"
                        placeholder="Seleccione el tipo de jornada"
                        data={jobType.job_types.map((t) => ({
                            value: String(t.job_type_id),
                            label: t.name
                        }))}
                        value={filters.job_type}
                        onChange={(value) => onUpdateFilter("job_type", value ?? "")}
                        searchable
                        clearable />
                }
            </Skeleton>
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
