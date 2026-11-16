import { getInitials } from "../utils/getInitials";

type AvatarProps = {
    name: string;
    size?: "sm" | "md";
};

const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
};

export default function Avatar({ name, size = "md" }: AvatarProps) {
    return (
        <span
            aria-hidden="true"
            className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] font-bold text-[#7C3AED] ${sizeClasses[size]}`}
        >
            {getInitials(name) || name[0]?.toUpperCase() || "?"}
        </span>
    );
}
