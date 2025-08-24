import { Select } from "@mantine/core";
import { companyUserStates } from "../../../types";

interface CompanyFiltersProps {
    filters: { [key: string]: string };
    onUpdateFilter: (key: string, value: string) => void;
}

export const CompanyFilters = ({ filters, onUpdateFilter }: CompanyFiltersProps) => {
    return (
        <>
            <Select
                label="Estado"
                placeholder="Seleccione el estado de la empresa"
                data={companyUserStates.map((s) => ({
                    value: String(s.value),
                    label: s.name
                }))}
                value={filters.state}
                onChange={(value) => onUpdateFilter("state", value ?? "")}
                clearable />
        </>
    )
}