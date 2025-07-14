import { Select } from "@mantine/core";

import { PostulationState } from "../../../types";

interface PostulationFiltersProps {
    filters: { [key: string]: string };
    onUpdateFilter: (key: string, value: string) => void;
}

export const PostulationFilters = ({ filters, onUpdateFilter }: PostulationFiltersProps) => {
    return (
        <>
            <Select
                label="Estado"
                placeholder="Seleccione un estado"
                data={Object.values(PostulationState)}
                value={filters.state}
                onChange={(value) => onUpdateFilter("state", value ?? "")}
                clearable />
        </>
    )
}