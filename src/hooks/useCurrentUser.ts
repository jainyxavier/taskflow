import { useEffect, useState } from "react";
import { getCurrentUser, getCurrentUserProfile, type AuthUser } from "../utils/auth";

export function useCurrentUser() {
    const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());

    useEffect(() => {
        let cancelled = false;

        getCurrentUserProfile().then((profile) => {
            if (!cancelled && profile) {
                setUser(profile);
            }
        });

        return () => {
            cancelled = true;
        };
    }, []);

    return user;
}
