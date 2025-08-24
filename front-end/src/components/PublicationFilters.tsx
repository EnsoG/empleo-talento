import { useEffect } from "react";
import { Select, Skeleton } from "@mantine/core";

import { useFetch } from "../hooks/useFetch";
import { PublicationCategories, PublicationState } from "../types";
import { endpoints } from "../endpoints";

interface PublicationFiltersProps {
    filters: { [key: string]: string };
    showStateFilter?: boolean;
    onUpdateFilter: (key: string, value: string) => void;
}

export const PublicationFilters = ({ filters, showStateFilter = false, onUpdateFilter }: PublicationFiltersProps) => {
    const { data: categories, isLoading: categoriesLoading, fetchData: fetchCategories } = useFetch<PublicationCategories>();

    const getCategories = async () => await fetchCategories(endpoints.publicationCategories, {
        method: "GET"
    });

    useEffect(() => {
        getCategories();
    }, [])

    return (
        <>
            <Skeleton visible={categoriesLoading}>
                {(categories) &&
                    <Select
                        label="Tipo Categoria"
                        placeholder="Seleccione el tipo de categoria"
                        data={categories.publication_categories.map((c) => ({
                            value: String(c.category_id),
                            label: c.name
                        }))}
                        value={filters.category}
                        onChange={(value) => onUpdateFilter("category", value ?? "")}
                        searchable
                        clearable />
                }
            </Skeleton>
            {(showStateFilter) &&
                <Select
                    label="Tipo Estado"
                    placeholder="Seleccione el tipo de estado"
                    data={Object.values(PublicationState)}
                    value={filters.state}
                    onChange={(value) => onUpdateFilter("state", value ?? "")}
                    searchable
                    clearable />
            }
        </>
    )
}
