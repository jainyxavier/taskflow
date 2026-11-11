import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import { hasStoredSession } from "../utils/auth";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type UseAuthSessionOptions = {
    acceptTrusted?: boolean;
};

export function useAuthSession(options?: UseAuthSessionOptions) {
    const isLoading = useAuthStore((state) => state.isLoading);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const didBootstrap = useAuthStore((state) => state.didBootstrap);
    const acceptTrusted = options?.acceptTrusted;

    useEffect(() => {
        void useAuthStore.getState().bootstrapSession({ acceptTrusted });
    }, [acceptTrusted]);

    if (isAuthenticated) {
        return "authenticated";
    }

    if (isLoading || (!didBootstrap && hasStoredSession())) {
        return "checking";
    }

    return "unauthenticated";
}
