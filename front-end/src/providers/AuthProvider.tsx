import { PropsWithChildren, useCallback, useEffect } from "react";

import { useFetch } from "../hooks/useFetch";
import { User } from "../types";
import { endpoints } from "../endpoints";
import { AuthContext } from "../contexts/AuthContext";

interface AuthProviderProps extends PropsWithChildren { }

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { data, isLoading: checkLoading, fetchData: fetchCheck } = useFetch<User>();
    const { fetchData } = useFetch();

    const checkAuth = useCallback(async () => await fetchCheck(endpoints.checkAuth, {
        method: "GET",
        credentials: "include"
    }), [fetchCheck]);

    const logout = useCallback(async () => {
        await fetchData(endpoints.logout, {
            method: "POST",
            credentials: "include"
        });
        await checkAuth()
    }, [fetchData, checkAuth]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <AuthContext.Provider value={{ user: data, isAuthenticated: !!data, isAuthLoading: checkLoading, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    )
}