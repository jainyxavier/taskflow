import type { ColoredOption } from "../components/ColoredSelect";

export const statusOptions: ColoredOption[] = [
    {
        value: "pending",
        label: "A fazer",
        dotClass: "bg-blue-500",
        fieldClass: "border-blue-400 bg-blue-50 focus:border-blue-500",
    },
    {
        value: "in-progress",
        label: "Em andamento",
        dotClass: "bg-yellow-500",
        fieldClass: "border-yellow-400 bg-yellow-50 focus:border-yellow-500",
    },
    {
        value: "completed",
        label: "Concluído",
        dotClass: "bg-green-500",
        fieldClass: "border-green-400 bg-green-50 focus:border-green-500",
    },
];

export const priorityOptions: ColoredOption[] = [
    {
        value: "high",
        label: "Alta",
        dotClass: "bg-red-500",
        fieldClass: "border-red-400 bg-red-50 focus:border-red-500",
    },
    {
        value: "medium",
        label: "Média",
        dotClass: "bg-yellow-500",
        fieldClass: "border-yellow-400 bg-yellow-50 focus:border-yellow-500",
    },
    {
        value: "low",
        label: "Baixa",
        dotClass: "bg-green-500",
        fieldClass: "border-green-400 bg-green-50 focus:border-green-500",
    },
];