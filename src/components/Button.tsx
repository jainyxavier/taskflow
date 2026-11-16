type ButtonProps = {
    children: React.ReactNode;
    size?: "sm" | "lg";
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    "aria-label"?: string;
};

const sizeClasses = {
    sm: "text-sm sm:text-base px-3 sm:px-3.5 py-2",
    lg: "text-base sm:text-lg px-4 sm:px-5 py-2.5 sm:py-3",
};

export default function Button({
    children,
    size = "sm",
    className = "",
    onClick,
    type = "button",
    disabled = false,
    "aria-label": ariaLabel,
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className={`inline-flex items-center justify-center gap-1 rounded-md bg-[#7C3AED] font-medium text-white transition-colors hover:bg-[#6D28D9] active:bg-[#5B21B6] disabled:cursor-wait disabled:opacity-70 ${disabled ? "cursor-wait" : "cursor-pointer"} ${sizeClasses[size]} ${className}`}
        >
            {children}
        </button>
    );
}
