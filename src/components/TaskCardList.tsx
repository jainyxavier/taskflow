import { LuBadgeCheck, LuChevronUp, LuCircleDashed, LuRefreshCw } from "react-icons/lu";
import TaskCard from "../components/TaskCard";
import { statusToDo, statusInProgress, statusCompleted } from "../constants/taskList.contants";

export default function TaskCardList() {
    return (
        <section>
            <div className="flex w-full flex-col gap-2 sm:my-8 md:my-10 md:gap-2.5">
                <h1 className="text-4xl font-bold tracking-tight text-[#111827] sm:text-3xl md:text-4xl lg:text-5xl">
                    Minhas<span className="text-[#7C3AED]">Tarefas</span>
                </h1>

                <p className="max-w-xl text-xl font-semibold text-[#6B7280]">
                    Organize, priorize e conclua suas tarefas
                </p>
            </div>

            <ul className="flex flex-col gap-8">
                {/* a fazer */}
                <li>
                    <section className="rounded-3xl bg-white/60 p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-7">
                            <div className="flex items-center gap-5">
                                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#4F6EF7] text-white shadow-sm">
                                    <LuCircleDashed size={26} />
                                </div>

                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-bold tracking-tight text-[#172554]">
                                            {statusToDo.sectionTitle}
                                        </h2>

                                        <span className="rounded-full bg-[#E8EBFF] px-5 py-2 text-lg font-semibold text-[#365CF5]">
                                            {statusToDo.tasks.length} tarefas
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button className="flex size-14 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white text-[#111827] shadow-sm transition hover:bg-[#F9FAFB]">
                                <LuChevronUp size={26} />
                            </button>
                        </div>

                        <ol className="transition-all flex flex-col gap-5">
                            {statusToDo.tasks.map(task => {
                                return (
                                    <TaskCard key={task.id} task={task} />
                                )
                            })}
                        </ol>
                    </section>
                </li>

                {/* em andamento */}
                <li>
                    <section className="rounded-3xl bg-white/60 p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-7">
                            <div className="flex items-center gap-5">
                                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#FDBA1A] text-[#111827] shadow-sm">
                                    <LuRefreshCw size={26} />
                                </div>

                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-bold tracking-tight text-[#172554]">
                                            {statusInProgress.sectionTitle}
                                        </h2>

                                        <span className="rounded-full bg-[#FFF3D6] px-5 py-2 text-lg font-semibold text-[#C97A00]">
                                            {statusInProgress.tasks.length} tarefas
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button className="flex size-14 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white text-[#111827] shadow-sm transition hover:bg-[#F9FAFB]">
                                <LuChevronUp size={26} />
                            </button>
                        </div>

                        <ol className="transition-all flex flex-col gap-5">
                            {statusInProgress.tasks.map(task => {
                                return (
                                    <TaskCard key={task.id} task={task} />
                                )
                            })}
                        </ol>
                    </section>
                </li>

                {/* concluído */}
                <li>
                    <section className="rounded-3xl bg-white/60 p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-7">
                            <div className="flex items-center gap-5">
                                <div className="flex size-14 items-center justify-center rounded-2xl bg-[#22C55E] text-white shadow-sm">
                                    <LuBadgeCheck size={26} />
                                </div>

                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-2xl font-bold tracking-tight text-[#172554]">
                                            {statusCompleted.sectionTitle}
                                        </h2>

                                        <span className="rounded-full bg-[#DCFCE7] px-5 py-2 text-lg font-semibold text-[#15803D]">
                                            {statusCompleted.tasks.length} tarefas
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button className="flex size-14 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white text-[#111827] shadow-sm transition hover:bg-[#F9FAFB]">
                                <LuChevronUp size={26} />
                            </button>
                        </div>

                        <ol className="transition-all flex flex-col gap-5">
                            {statusCompleted.tasks.map(task => {
                                return (
                                    <TaskCard key={task.id} task={task} />
                                )
                            })}
                        </ol>
                    </section>
                </li>
            </ul>
        </section>
    )
}