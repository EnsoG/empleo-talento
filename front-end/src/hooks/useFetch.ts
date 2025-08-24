import {
    useState,
    useEffect,
    useCallback,
    useRef
} from "react";
import { useNavigate } from "react-router";
import { notifications } from "@mantine/notifications";

interface FetchOptions extends RequestInit {
    body?: BodyInit | null;
    showNotifications?: boolean;
    successTitle?: string | null;
    successMessage?: string | null;
    successRedirect?: string | null;
    errorTitle?: string | null;
    errorMessage?: string | null;
    errorRedirect?: string | null;
}

interface FetchState<T> {
    data: T | null;
    error: string | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
}

export const useFetch = <T>() => {
    const navigate = useNavigate();
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
            successTitle,
            successMessage,
            successRedirect,
            errorTitle,
            errorMessage,
            errorRedirect,
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
            // Redirect If Is Necessary
            if (successRedirect) {
                navigate(successRedirect);
            }
            // Show Notification If Is Necessary
            if (showNotifications) {
                notifications.show({
                    color: "green",
                    title: successTitle || "Operacion Exitosa",
                    message: successMessage || "Operacion realizada exitosamente",
                    withBorder: true
                });
            }
        } catch (error: any) {
            // Handle Non-AbortError Exceptions
            if (error.name !== "AbortError") {
                setState({ data: null, error: error.message, isLoading: false, isSuccess: false, isError: true });
                // Redirect If Is Necessary
                if (errorRedirect) {
                    navigate(errorRedirect);
                }
                // Show Notification If Is Necessary
                if (showNotifications) {
                    notifications.show({
                        color: "red",
                        title: errorTitle || "Ha Ocurrido Un Error",
                        message: errorMessage || error.message || "Ha ocurrido un error en la operacion",
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