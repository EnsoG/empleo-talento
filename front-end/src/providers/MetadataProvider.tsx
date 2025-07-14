import { PropsWithChildren, useEffect } from "react";
import { MetadataContext } from "../contexts/MetadataContext";
import { useFetch } from "../hooks/useFetch";
import { endpoints } from "../endpoints";
import { Metadata } from "../types";

interface MetadataProviderProps extends PropsWithChildren { }

export const MetadataProvider = ({ children }: MetadataProviderProps) => {
    const { data: metadata, fetchData } = useFetch<Metadata>();

    const getMetadata = async () => await fetchData(endpoints.metadata, {
        method: "GET"
    });

    useEffect(() => {
        getMetadata();
    }, [])

    if (!metadata) return null

    return (
        <MetadataContext.Provider value={{ metadata }}>
            {children}
        </MetadataContext.Provider>
    )
}