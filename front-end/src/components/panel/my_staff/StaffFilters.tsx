import { Select, TextInput } from "@mantine/core";

import { companyUserStates } from "../../../types";

interface StaffFiltersProps {
    filters: { [key: string]: string };
    onUpdateFilter: (key: string, value: string) => void;
}

export const StaffFilters = ({ filters, onUpdateFilter }: StaffFiltersProps) => {
    return (
        <>
            <TextInput
                label="Cargo"
                placeholder="Ingrese el cargo del personal"
                maxLength={300}
                value={filters.position}
                onChange={(e) => onUpdateFilter("position", e.target.value)} />
            <Select
                label="Estado"
                placeholder="Seleccione el estado del personal"
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
