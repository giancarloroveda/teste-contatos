import axios from "../lib/axios.ts";
import { useEffect } from "react";
import { AxiosError } from "axios";
import type User from "../Interfaces/User.ts";
import { useNavigate } from "react-router";
import { useAuthStore } from "../Stores/AuthStore.ts";

interface UseAuthProps {
    middleware: "guest" | "auth";
    redirectIfAuthenticated?: string;
}

export default function useAuth({
                                    middleware,
                                    redirectIfAuthenticated,
                                }: UseAuthProps) {
    const { user, setUser, setAccessToken } = useAuthStore();

    const navigate = useNavigate();

    const saveToken = (token: string) => {
        setAccessToken(token);
    };

    const saveUser = (user: User) => {
        setUser(user);
    };

    const clearUser = () => {
        setUser(null);
    };

    const clearToken = () => {
        setAccessToken(null);
    };

    const login = async (
        email: string,
        password: string
    ) => {
        try {
            const res = await axios.post("/login", { email, password });

            saveUser(res.data.user);
            saveToken(res.data.accessToken);
        } catch (error) {
            clearToken();
            clearUser();
            if (error instanceof AxiosError) {
                return [error.response?.data.message || "Login failed"];
            }
            return ["Unexpected error"];
        }
    };

    const register = async (
        email: string,
        password: string
    ) => {
        try {
            const res = await axios.post("/register", { email, password });

            saveToken(res.data.accessToken);
            saveUser(res.data.user);
        } catch (error) {
            clearToken();
            clearUser();
            if (error instanceof AxiosError) {
                return [error.response?.data.message || "Login failed"];
            }
            return ["Unexpected error"];
        }
    };

    const logout = async () => {
        await axios.post("/logout");
        clearToken();
        clearUser();
    };

    useEffect(() => {
        if (middleware === "guest" && user) navigate(redirectIfAuthenticated ||
            "/");

        if (middleware === "auth" && !user) navigate("/login");
    }, [user]);

    return { login, register, logout };
}