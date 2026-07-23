import { useEffect, type ReactNode } from "react";
import { IoClose } from "react-icons/io5";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    useEffect(() => {}, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-[#111827]/40 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="form-task-title"
                className="relative z-10 w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-2xl border border-[#E5E7EB] bg-white shadow-lg"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar modal"
                    className="absolute top-4 right-4 flex size-8 cursor-pointer items-center justify-center rounded-md text-[#6B7280] transition-colors hover:bg-[#F3F1FF] hover:text-[#111827]"
                >
                    <IoClose size={22} />
                </button>

                <div className="p-6 sm:p-8">{children}</div>
            </div>
        </div>
    );
}
