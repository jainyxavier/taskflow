import { useEffect, useState } from "react";
import { consumeTrustedSession, hasStoredSession, validateSession } from "../utils/auth";

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type UseAuthSessionOptions = {
    acceptTrusted?: boolean;
};

export function useAuthSession(options?: UseAuthSessionOptions) {
    const [status, setStatus] = useState<AuthStatus>(() => {
        if (options?.acceptTrusted && consumeTrustedSession()) {
            return "authenticated";
        }

        return hasStoredSession() ? "checking" : "unauthenticated";
    });

    useEffect(() => {
        if (status === "authenticated") {
            return;
        }

        if (!hasStoredSession()) {
            setStatus("unauthenticated");
            return;
        }

        let cancelled = false;

        validateSession().then((valid) => {
            if (!cancelled) {
                setStatus(valid ? "authenticated" : "unauthenticated");
            }
        });

        return () => {
            cancelled = true;
        };
    }, []);

    return status;
}
