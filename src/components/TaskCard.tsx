import { FaCheck, FaRegCalendarAlt } from "react-icons/fa";
import type { Task } from "../types/task";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { useState } from "react";

interface TaskCardProps {
    task: Task;
    onEdit: () => void;
}

const statusVariants: Record<string, [string, string]> = {
    "A fazer": ["bg-[#f0f8ff]", "bg-blue-500"],
    "Em andamento": ["bg-[#FFF9E8]", "bg-yellow-500"],
    "Concluído": ["bg-[#F0FDF4]", "bg-green-500"],
};

const priorityBadgeVariants: Record<string, { container: string; dot: string; text: string }> = {
    Alta: {
        container: "border-red-100 bg-red-50",
        dot: "bg-red-500",
        text: "text-red-700",
    },
    Média: {
        container: "border-yellow-100 bg-yellow-50",
        dot: "bg-yellow-500",
        text: "text-yellow-700",
    },
    Baixa: {
        container: "border-green-100 bg-green-50",
        dot: "bg-green-500",
        text: "text-green-700",
    },
};

function getTaskCardColor(status: string): [string, string] {
    return statusVariants[status] ?? statusVariants["A fazer"];
}

function getPriorityBadge(priority: string) {
    return priorityBadgeVariants[priority] ?? priorityBadgeVariants.Baixa;
}

export default function TaskCard({ task, onEdit }: TaskCardProps) {
    const [bgColor, sidebarColor] = getTaskCardColor(task.status);
    const priorityBadge = getPriorityBadge(task.priority);
    const [checked, setChecked] = useState(task.isChecked || task.status === "Concluído");

    return (
        <li
            className={`flex rounded-xl shadow-sm transition-all duration-300 hover:shadow-md sm:rounded-2xl ${bgColor} ${checked ? "opacity-70" : ""}`}
        >
            <div className={`w-1 shrink-0 rounded-l-xl sm:rounded-l-2xl sm:w-1.5 ${sidebarColor}`} />

            <div className="flex w-full min-w-0 flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-5 md:gap-6 md:p-6">
                <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4 md:gap-5">
                    <label className="mt-0.5 shrink-0 cursor-pointer sm:mt-1">
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setChecked((prev) => !prev)}
                            className="peer sr-only"
                        />

                        <div className="flex size-6 items-center justify-center rounded-md border-2 border-[#C7C9D1] transition-all duration-200 hover:border-[#7C3AED] peer-checked:border-[#7C3AED] peer-checked:bg-[#7C3AED] peer-focus:ring-2 peer-focus:ring-[#7C3AED]/20 sm:size-7">
                            {checked && <FaCheck className="text-base text-white sm:text-[18px]" />}
                        </div>
                    </label>

                    <div className="min-w-0 flex-1">
                        <h3
                            className={`text-base font-bold transition-all sm:text-lg md:text-xl ${
                                checked ? "text-[#98A2B3] line-through" : "text-[#667085]"
                            }`}
                        >
                            {task.title}
                        </h3>

                        <p
                            className={`mt-1.5 text-sm font-medium transition-all sm:mt-2 sm:text-base ${
                                checked ? "text-[#98A2B3] line-through" : "text-[#6B7280]"
                            }`}
                        >
                            {task.description}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3 md:mt-5">
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 sm:gap-2 sm:px-3 sm:py-1.5">
                                <span className="size-1.5 rounded-full bg-blue-500 sm:size-2" />
                                <span className="text-xs font-medium text-blue-700 sm:text-sm md:text-base">
                                    {task.status}
                                </span>
                            </div>

                            <div
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 sm:gap-2 sm:px-3 sm:py-1.5 ${priorityBadge.container}`}
                            >
                                <span className={`size-1.5 rounded-full sm:size-2 ${priorityBadge.dot}`} />
                                <span className={`text-xs font-medium sm:text-sm md:text-base ${priorityBadge.text}`}>
                                    {task.priority}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-[#E5E7EB]/60 pt-3 sm:justify-end sm:gap-5 sm:border-t-0 sm:pt-0 md:gap-8">
                    <div className="flex items-center gap-2 text-[#6B7280] md:hidden">
                        <FaRegCalendarAlt className="size-4 shrink-0" />
                        <span className="text-sm font-bold">{task.createdAt}</span>
                    </div>

                    <div className="hidden items-center gap-2 text-[#6B7280] md:flex">
                        <FaRegCalendarAlt className="size-5 shrink-0" />
                        <span className="text-base font-bold">{task.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            title="Editar"
                            aria-label={`Editar tarefa ${task.title}`}
                            onClick={onEdit}
                            className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#7C3AED] shadow-sm transition-all duration-200 hover:border-[#DDD6FE] hover:bg-[#F5F3FF] hover:shadow sm:size-10 md:size-11 md:rounded-xl"
                        >
                            <LuPencil size={16} strokeWidth={2.2} className="sm:hidden" />
                            <LuPencil size={18} strokeWidth={2.2} className="hidden sm:block" />
                        </button>

                        <button
                            type="button"
                            title="Excluir"
                            aria-label={`Excluir tarefa ${task.title}`}
                            className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#EF4444] shadow-sm transition-all duration-200 hover:border-[#FECACA] hover:bg-[#FEF2F2] hover:shadow sm:size-10 md:size-11 md:rounded-xl"
                        >
                            <LuTrash2 size={16} strokeWidth={2.2} className="sm:hidden" />
                            <LuTrash2 size={18} strokeWidth={2.2} className="hidden sm:block" />
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
}
