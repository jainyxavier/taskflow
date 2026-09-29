import { createPortal } from "react-dom";

type AuthTransitionOverlayProps = {
    message: string;
};

export default function AuthTransitionOverlay({ message }: AuthTransitionOverlayProps) {
    return createPortal(
        <div
            className="auth-overlay fixed inset-0 z-50 flex items-center justify-center bg-[#F4F0FF]"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="flex flex-col items-center gap-3">
                <div className="size-10 animate-spin rounded-full border-4 border-[#DDD6FE] border-t-[#7C3AED]" />
                <p className="text-sm font-medium text-[#6B7280]">{message}</p>
            </div>
        </div>,
        document.body
    );
}
