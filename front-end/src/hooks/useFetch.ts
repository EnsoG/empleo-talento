import {
    useState,
    useEffect,
    useCallback,
    useRef
} from "react";
import { notifications } from "@mantine/notifications";

interface FetchOptions extends RequestInit {
    body?: BodyInit | null;
    showNotifications?: boolean;
    successMessage?: string | null;
    errorMessage?: string | null;
}

interface FetchState<T> {
    data: T | null;
    error: string | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
}

export const useFetch = <T>() => {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        error: null,
        isLoading: false,
        isSuccess: false,
        isError: false
    });

    const abortController = useRef<AbortController | null>(null);

    const fetchData = useCallback(async (url: string, options?: FetchOptions) => {
        const {
            body,
            showNotifications,
            successMessage,
            errorMessage,
            ...restOptions
        } = options || {};
        // Cancel Previous Request If It Exists
        if (abortController.current) {
            abortController.current.abort();
        }
        abortController.current = new AbortController();
        // Set isLoading In True
        setState({ data: null, error: null, isLoading: true, isSuccess: false, isError: false });
        try {
            // Configure Fetch Options
            const fetchOptions = {
                ...restOptions,
                signal: abortController.current.signal,
                body
            };
            const response = await fetch(url, fetchOptions);
            const result = await response.json()
            // Check If Non-OK HTTP Responses
            if (!response.ok) {
                throw new Error(result.detail);
            }
            // Parse And Update State With Fetched Data
            setState({ data: result, error: null, isLoading: false, isSuccess: true, isError: false });
            // Show Notification If Is Necessary
            if (showNotifications) {
                notifications.show({
                    color: "green",
                    title: "Operacion Exitosa",
                    message: successMessage,
                    withBorder: true
                });
            }
        } catch (error: any) {
            // Handle Non-AbortError Exceptions
            if (error.name !== "AbortError") {
                setState({ data: null, error: error.message, isLoading: false, isSuccess: false, isError: true });
                // Show Notification If Is Necessary
                if (showNotifications) {
                    notifications.show({
                        color: "red",
                        title: "Ha Ocurrido Un Error",
                        message: errorMessage || error.message,
                        withBorder: true
                    });
                }
            }
        }
    }, []);
    // Effect To Tringer Data Fetching And Handle Cleanup
    useEffect(() => {
        return () => {
            if (abortController.current) {
                abortController.current.abort();
            }
        }
    }, [fetchData]);
    return { ...state, fetchData }
}