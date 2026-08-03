import { FaCheck, FaRegCalendarAlt } from "react-icons/fa";
import type { Task } from "../types/task";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { useState } from "react";

interface TaskCardProps {
    task: Task;
}

const blueVariant = ["bg-[#f0f8ff]", "bg-blue-500"]
const yellowVariant = ["bg-[#FFF9E8]", "bg-yellow-500"]
const greenVariant = ["bg-[#F0FDF4]", "bg-green-500"]

export default function TaskCard({task}: TaskCardProps) {

    function getTaskCardColor(status: string) {
        if(status == "A fazer") {
            return blueVariant
        }

        if(status == "Em andamento") {
            return yellowVariant
        }

        if(status == "Concluído") {
            return greenVariant
        }

        return blueVariant;
    }

    const [bgColor, sidebarColor] = getTaskCardColor(task.status)

    const [checked, setChecked] = useState(false);

    return (
        <li className={`rounded-2xl flex ${bgColor} shadow-sm transition-all duration-300 hover:shadow-md ${checked ? "opacity-70" : ""}`}>
            {/* Barra lateral */}
            <div className={`w-1.5 rounded-l-2xl ${sidebarColor}`} />

            <div className="flex w-full items-center justify-between gap-6 p-6">
                <div className="flex flex-1 items-start gap-5">
                    {/* Checkbox */}
                    <label className="mt-1 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setChecked((prev) => !prev)}
                            className="peer sr-only"
                        />

                        <div
                            className="
                                flex size-7 items-center justify-center
                                rounded-md
                                border-2 border-[#C7C9D1]
                                transition-all duration-200
                                hover:border-[#7C3AED]
                                peer-checked:border-[#7C3AED]
                                peer-checked:bg-[#7C3AED]
                                peer-focus:ring-2 peer-focus:ring-[#7C3AED]/20
                            "
                        >
                            {checked && (
                                <FaCheck
                                    className="
                                        text-[18px]
                                        text-white
                                        peer-checked:block
                                    "
                                />
                            )}
                        </div>
                    </label>

                    {/* Conteúdo */}
                    <div className="flex flex-col">
                        <h3
                            className={`text-xl font-bold transition-all ${
                                checked
                                    ? "text-[#98A2B3] line-through"
                                    : "text-[#667085]"
                            }`}
                        >
                            {task.title}
                        </h3>

                        <p
                            className={`mt-2 text-base font-medium transition-all ${
                                checked
                                    ? "text-[#98A2B3] line-through"
                                    : "text-[#6B7280]"
                            }`}
                        >
                            {task.description}
                        </p>

                        {/* Badges */}
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5">
                                <span className="size-2 rounded-full bg-blue-500" />
                                <span className="text-base font-medium text-blue-700">
                                    {task.status}
                                </span>
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1.5">
                                <span className="size-2 rounded-full bg-red-500" />
                                <span className="text-base font-medium text-red-700">
                                    {task.priority}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Data */}
                    <div className="hidden items-center gap-2 text-[#6B7280] md:flex">
                        <FaRegCalendarAlt size={26} fontWeight={600} />
                        <span className="text-base font-bold">{task.createdAt}</span>
                    </div>

                    {/*Editar e excluir  */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            title="Editar"
                            className="flex size-11 cursor-pointer items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#7C3AED] shadow-sm transition-all duration-200 hover:border-[#DDD6FE] hover:bg-[#F5F3FF] hover:shadow"
                        >
                            <LuPencil size={18} strokeWidth={2.2} />
                        </button>

                        <button
                            type="button"
                            title="Excluir"
                            className="flex size-11 cursor-pointer items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#EF4444] shadow-sm transition-all duration-200 hover:border-[#FECACA] hover:bg-[#FEF2F2] hover:shadow"
                        >
                            <LuTrash2 size={18} strokeWidth={2.2} />
                        </button>
                    </div>
                </div>
            </div>
        </li>
    )
}