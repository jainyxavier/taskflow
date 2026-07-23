import { FaRegCalendarAlt } from "react-icons/fa";
import { LuCircle } from "react-icons/lu";
import type { Task } from "../types/task";

interface TaskCardProps {
    task: Task;
}

export default function TaskCard({task}: TaskCardProps) {
    return (
        <li className="rounded-2xl flex bg-[#f0f8ff] shadow-sm hover:shadow-md">
            {/* Barra lateral */}
            <div className="w-1.5 rounded-l-2xl bg-blue-500" />

            <div className="flex w-full items-center justify-between gap-6 p-6">
                <div className="flex flex-1 items-start gap-5">
                    {/* Checkbox */}
                    <button
                        type="button"
                        className="mt-1 text-[#C7C9D1] transition-colors hover:text-[#7C3AED]"
                    >
                        <LuCircle size={30} />
                    </button>

                    {/* Conteúdo */}
                    <div className="flex flex-col">
                        <h3 className="text-xl font-bold text-[#667085]">
                            {task.title}
                        </h3>

                        <p className="mt-2 font-medium text-base text-[#6B7280]">
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

                {/* Data */}
                <div className="hidden items-center gap-2 text-[#6B7280] md:flex">
                    <FaRegCalendarAlt size={26} fontWeight={600} />
                    <span className="text-base font-bold">{task.createdAt}</span>
                </div>
            </div>
        </li>
    )
}