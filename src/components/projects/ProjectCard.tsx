import type { Project } from "../../types/project";
import {
    getProjectStatusClassName,
    getProjectStatusLabel,
} from "../../utils/projectStatus";

type ProjectCardProps = {
    project: Project;
    onClick: () => void;
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full cursor-pointer flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#DDD6FE] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]/30"
        >
            <div className="flex items-start justify-between gap-3">
                <span className="inline-flex rounded-md bg-[#EDE9FE] px-2.5 py-1 text-xs font-bold tracking-wide text-[#7C3AED]">
                    {project.key}
                </span>
                <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getProjectStatusClassName(project.status)}`}
                >
                    {getProjectStatusLabel(project.status)}
                </span>
            </div>

            <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-semibold text-[#111827]">{project.name}</h3>
                {project.description ? (
                    <p className="line-clamp-2 text-sm text-[#6B7280]">{project.description}</p>
                ) : (
                    <p className="text-sm text-[#9CA3AF]">Sem descrição</p>
                )}
            </div>
        </button>
    );
}
