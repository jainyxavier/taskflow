import { useMemo } from "react";
import { LuBadgeCheck, LuChevronUp, LuCircleDashed, LuRefreshCw } from "react-icons/lu";
import TaskCard from "../components/TaskCard";
import type { Task } from "../types/task";
import { groupTasksByStatus } from "../utils/groupTasksByStatus";

type TaskCardListProps = {
    tasks: Task[];
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: number) => void;
    onToggleTask: (id: number) => void;
};

const statusSections = [
    {
        key: "todo",
        status: "A fazer",
        icon: LuCircleDashed,
        iconClass: "bg-[#4F6EF7] text-white",
        badgeClass: "bg-[#E8EBFF] text-[#365CF5]",
    },
    {
        key: "in-progress",
        status: "Em andamento",
        icon: LuRefreshCw,
        iconClass: "bg-[#FDBA1A] text-[#111827]",
        badgeClass: "bg-[#FFF3D6] text-[#C97A00]",
    },
    {
        key: "completed",
        status: "Concluído",
        icon: LuBadgeCheck,
        iconClass: "bg-[#22C55E] text-white",
        badgeClass: "bg-[#DCFCE7] text-[#15803D]",
    },
] as const;

export default function TaskCardList({ tasks, onEditTask, onDeleteTask, onToggleTask }: TaskCardListProps) {
    const tasksByStatus = useMemo(() => groupTasksByStatus(tasks), [tasks]);

    return (
        <section>
            <div className="flex w-full flex-col gap-2 sm:my-8 md:my-10 md:gap-2.5">
                <h1 className="text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl md:text-4xl lg:text-5xl">
                    Minhas<span className="text-[#7C3AED]">Tarefas</span>
                </h1>

                <p className="max-w-xl text-base font-semibold text-[#6B7280] sm:text-lg md:text-xl">
                    Organize, priorize e conclua suas tarefas
                </p>
            </div>

            <ul className="flex flex-col gap-5 sm:gap-6 md:gap-8">
                {statusSections.map(({ key, status, icon: SectionIcon, iconClass, badgeClass }) => {
                    const sectionTasks = tasksByStatus[status] ?? [];

                    return (
                        <li key={key}>
                            <section className="rounded-2xl bg-white/60 p-4 shadow-sm sm:rounded-3xl sm:p-5 md:p-6">
                                <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6 md:mb-7">
                                    <div className="flex min-w-0 items-center gap-3 sm:gap-4 md:gap-5">
                                        <div
                                            className={`flex size-11 shrink-0 items-center justify-center rounded-xl shadow-sm sm:size-12 md:size-14 md:rounded-2xl ${iconClass}`}
                                        >
                                            <SectionIcon className="size-5 sm:size-6 md:size-6.5" />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                                <h2 className="text-lg font-bold tracking-tight text-[#172554] sm:text-xl md:text-2xl">
                                                    {status}
                                                </h2>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-sm font-semibold sm:px-4 sm:py-1.5 sm:text-base md:px-5 md:py-2 md:text-lg ${badgeClass}`}
                                                >
                                                    {sectionTasks.length} tarefas
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#111827] shadow-sm transition hover:bg-[#F9FAFB] sm:size-11 md:size-14 md:rounded-2xl"
                                    >
                                        <LuChevronUp className="size-5 sm:size-6 md:size-6.5" />
                                    </button>
                                </div>

                                <ol className="flex flex-col gap-3 transition-all sm:gap-4 md:gap-5">
                                    {sectionTasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onEdit={() => onEditTask(task)}
                                            onDelete={() => onDeleteTask(task.id)}
                                            onToggleTask={() => onToggleTask(task.id)}
                                        />
                                    ))}
                                </ol>
                            </section>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
