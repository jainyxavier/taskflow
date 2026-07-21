import { useEffect, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

export type ColoredOption<T extends string = string> = {
    value: T;
    label: string;
    dotClass: string;
    fieldClass: string;
};

type ColoredSelectProps<T extends string = string> = {
    id: string;
    options: ColoredOption<T>[];
    value: T | "";
    onChange: (value: T) => void;
    placeholder?: string;
    hasError?: boolean;
};

export default function ColoredSelect<T extends string = string>({
    id,
    options,
    value,
    onChange,
    placeholder = "Selecione...",
    hasError = false,
}: ColoredSelectProps<T>) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selected = options.find((option) => option.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const baseClassName =
        "flex w-full cursor-pointer items-center gap-2.5 rounded-md border bg-white px-3 py-2.5 text-left text-[#111827] outline-none transition-shadow focus:ring-2 focus:ring-[#7C3AED]/20";

    const fieldClassName = hasError
        ? `${baseClassName} border-red-400 focus:border-red-400 focus:ring-red-200`
        : selected
        ? `${baseClassName} ${selected.fieldClass}`
        : `${baseClassName} border-[#E5E7EB] focus:border-[#7C3AED]`;

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                id={id}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((prev) => !prev)}
                className={fieldClassName}
            >
                <span
                    className={`size-2.5 shrink-0 rounded-full ${
                        selected?.dotClass ?? "bg-[#D1D5DB]"
                    }`}
                    aria-hidden
                />

                <span
                    className={`flex-1 text-sm sm:text-base ${
                        selected ? "" : "text-[#9CA3AF]"
                    }`}
                >
                    {selected?.label ?? placeholder}
                </span>

                <IoChevronDown
                    className={`shrink-0 text-[#6B7280] transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                    size={18}
                />
            </button>

            {open && (
                <ul
                    role="listbox"
                    aria-labelledby={id}
                    className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-[#E5E7EB] bg-white py-1 shadow-lg"
                >
                    {options.map((option) => (
                        <li
                            key={option.value}
                            role="option"
                            aria-selected={value === option.value}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors hover:bg-[#F3F1FF] sm:text-base"
                            >
                                <span
                                    className={`size-2.5 shrink-0 rounded-full ${option.dotClass}`}
                                    aria-hidden
                                />
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}