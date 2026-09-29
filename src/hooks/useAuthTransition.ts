import { useEffect, useRef, useState } from "react";

export const AUTH_TRANSITION_MS = 480;

export function useAuthTransition() {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const actionRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!isTransitioning) return;

        const timeoutId = window.setTimeout(() => {
            actionRef.current?.();
        }, AUTH_TRANSITION_MS);

        return () => window.clearTimeout(timeoutId);
    }, [isTransitioning]);

    function startTransition(action: () => void) {
        if (isTransitioning) return;
        actionRef.current = action;
        setIsTransitioning(true);
    }

    return { isTransitioning, startTransition };
}
