import { useState, useCallback } from "react";
import { notifications } from "@mantine/notifications";
import { useFetch } from "./useFetch";
import { CodelcoJobsResponse } from "../types";
import { endpoints } from "../endpoints";

export const useCodelcoJobs = () => {
    const { data: codelcoJobs, isLoading, fetchData: fetchCodelcoJobs } = useFetch<CodelcoJobsResponse>();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const getCodelcoJobs = useCallback(async () => {
        try {
            await fetchCodelcoJobs(endpoints.codelcoJobs, {
                method: "GET"
            });
        } catch (error) {
            console.error("Error fetching Codelco jobs:", error);
            notifications.show({
                title: "Error",
                message: "No se pudieron cargar los empleos de Codelco",
                color: "red"
            });
        }
    }, [fetchCodelcoJobs]);

    const runScraper = useCallback(async () => {
        setIsRefreshing(true);
        try {
            const response = await fetch(endpoints.codelcoRun, {
                method: "POST"
            });
            
            if (response.ok) {
                notifications.show({
                    title: "Scraping iniciado",
                    message: "El scraping de empleos de Codelco ha comenzado. Los resultados se actualizarán automáticamente.",
                    color: "blue"
                });
                
                // Esperar un poco y luego refrescar la lista
                setTimeout(() => {
                    getCodelcoJobs();
                    setIsRefreshing(false);
                }, 30000); // 30 segundos
            } else {
                throw new Error("Error al iniciar scraping");
            }
        } catch (error) {
            console.error("Error running scraper:", error);
            notifications.show({
                title: "Error",
                message: "No se pudo iniciar el scraping de empleos",
                color: "red"
            });
            setIsRefreshing(false);
        }
    }, [getCodelcoJobs]);

    const testScraper = useCallback(async () => {
        try {
            const response = await fetch(endpoints.codelcoTest, {
                method: "GET"
            });
            
            if (response.ok) {
                const result = await response.json();
                notifications.show({
                    title: "Test exitoso",
                    message: `Scraper funcionando correctamente. ${result.jobs_found} empleos encontrados.`,
                    color: "green"
                });
                return result;
            } else {
                throw new Error("Error en test del scraper");
            }
        } catch (error) {
            console.error("Error testing scraper:", error);
            notifications.show({
                title: "Error en test",
                message: "El scraper no está funcionando correctamente",
                color: "red"
            });
            return null;
        }
    }, []);

    return {
        codelcoJobs,
        isLoading,
        isRefreshing,
        getCodelcoJobs,
        runScraper,
        testScraper
    };
};
