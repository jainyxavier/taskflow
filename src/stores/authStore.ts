import { create } from "zustand";
import { api } from "../api/client";
import {
    consumeTrustedSession,
    getAccessToken,
    getCurrentUser,
    getRefreshToken,
    hasStoredSession,
    persistUserFromPayload,
    type AuthUser,
} from "../utils/auth";

type AuthState = {
    user: AuthUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    didBootstrap: boolean;
    hydrateFromStorage: () => void;
    acceptTrustedSession: () => void;
    bootstrapSession: (options?: { acceptTrusted?: boolean }) => Promise<void>;
};

let bootstrapInFlight: Promise<void> | null = null;

function readSession() {
    const user = getCurrentUser();
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    return {
        user,
        accessToken,
        refreshToken,
        isAuthenticated: Boolean(accessToken || refreshToken),
    };
}

export const useAuthStore = create<AuthState>((set, get) => ({
    ...readSession(),
    isLoading: hasStoredSession(),
    didBootstrap: false,

    hydrateFromStorage() {
        set(readSession());
    },

    acceptTrustedSession() {
        set({
            ...readSession(),
            isLoading: false,
            isAuthenticated: true,
            didBootstrap: true,
        });
    },

    async bootstrapSession(options) {
        if (options?.acceptTrusted && consumeTrustedSession()) {
            get().acceptTrustedSession();
            return;
        }

        if (get().didBootstrap) {
            return;
        }

        if (bootstrapInFlight) {
            await bootstrapInFlight;
            return;
        }

        bootstrapInFlight = (async () => {
            if (!hasStoredSession()) {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                    didBootstrap: true,
                });
                return;
            }

            set({ isLoading: true });

            try {
                const { data } = await api.get("/auth/me");
                persistUserFromPayload(data);
                set({
                    ...readSession(),
                    isAuthenticated: true,
                    isLoading: false,
                    didBootstrap: true,
                });
            } catch {
                set({
                    ...readSession(),
                    isAuthenticated: Boolean(getAccessToken() || getRefreshToken()),
                    isLoading: false,
                    didBootstrap: true,
                });
            }
        })();

        try {
            await bootstrapInFlight;
        } finally {
            bootstrapInFlight = null;
        }
    },
}));
