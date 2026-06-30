import { IoIosAdd } from "react-icons/io";

type ButtonProps = {
    children: React.ReactNode;
    size?: "sm" | "lg";
    className?: string;
};

const sizeClasses = {
    sm: "text-sm sm:text-base px-3 sm:px-3.5 py-2",
    lg: "text-base sm:text-lg px-4 sm:px-5 py-2.5 sm:py-3",
};

export default function Button({ children, size = "sm", className = "" }: ButtonProps) {
    return (
        <button
            type="button"
            className={`inline-flex items-center justify-center gap-1 rounded-md bg-[#7C3AED] font-medium text-white cursor-pointer transition-colors hover:bg-[#6D28D9] active:bg-[#5B21B6] ${sizeClasses[size]} ${className}`}
        >
            <IoIosAdd className="shrink-0" size={size === "lg" ? 22 : 20} />
            {children}
        </button>
    );
}
