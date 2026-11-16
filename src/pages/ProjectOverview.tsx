import { useQuery } from "@tanstack/react-query";
import {
    HiOutlineCalendarDays,
    HiOutlineQueueList,
    HiOutlineRocketLaunch,
    HiOutlineUsers,
} from "react-icons/hi2";
import { getProjectSprintCount, getProjectStoryCount } from "../api/projects";
import { useProject } from "../hooks/useProject";
import {
    getProjectStatusClassName,
    getProjectStatusLabel,
} from "../utils/projectStatus";

function formatCreatedAt(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
}

export default function ProjectOverview() {
    const { project } = useProject();

    const storiesQuery = useQuery({
        queryKey: ["project-stats", project.id, "stories"],
        queryFn: () => getProjectStoryCount(project.id),
    });

    const sprintsQuery = useQuery({
        queryKey: ["project-stats", project.id, "sprints"],
        queryFn: () => getProjectSprintCount(project.id),
    });

    const membersCount = project.members?.length ?? 0;

    return (
        <section className="flex flex-col gap-6">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-md bg-[#EDE9FE] px-2.5 py-1 text-xs font-bold tracking-wide text-[#7C3AED]">
                        {project.key}
                    </span>
                    <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getProjectStatusClassName(project.status)}`}
                    >
                        {getProjectStatusLabel(project.status)}
                    </span>
                </div>

                <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">
                    {project.name}
                </h1>

                <p className="mt-3 max-w-3xl text-base text-[#6B7280]">
                    {project.description?.trim() || "Sem descrição"}
                </p>

                <p className="mt-4 inline-flex items-center gap-2 text-sm text-[#6B7280]">
                    <HiOutlineCalendarDays className="size-4 shrink-0" aria-hidden />
                    Criado em {formatCreatedAt(project.createdAt)}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <article className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                    <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-[#EDE9FE] text-[#7C3AED]">
                        <HiOutlineQueueList className="size-5" aria-hidden />
                    </div>
                    <p className="text-sm font-medium text-[#6B7280]">Stories</p>
                    <p className="mt-1 text-3xl font-bold text-[#111827]">
                        {storiesQuery.isLoading ? "—" : (storiesQuery.data ?? 0)}
                    </p>
                </article>

                <article className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                    <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-[#EDE9FE] text-[#7C3AED]">
                        <HiOutlineUsers className="size-5" aria-hidden />
                    </div>
                    <p className="text-sm font-medium text-[#6B7280]">Membros</p>
                    <p className="mt-1 text-3xl font-bold text-[#111827]">{membersCount}</p>
                </article>

                <article className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                    <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-[#EDE9FE] text-[#7C3AED]">
                        <HiOutlineRocketLaunch className="size-5" aria-hidden />
                    </div>
                    <p className="text-sm font-medium text-[#6B7280]">Sprints</p>
                    <p className="mt-1 text-3xl font-bold text-[#111827]">
                        {sprintsQuery.isLoading ? "—" : (sprintsQuery.data ?? 0)}
                    </p>
                </article>
            </div>
        </section>
    );
}
