import type User from "../Interfaces/User";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
    user: User | null;
    setUser: (user: User | null) => void;
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user: User | null) => set({ user }),
            accessToken: null,
            setAccessToken: (token: string | null) => set({ accessToken: token }),
        }),
        {
            name: "auth-storage",
        }
    )
);