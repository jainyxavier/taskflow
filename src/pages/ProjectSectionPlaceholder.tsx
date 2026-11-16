import { useProject } from "../hooks/useProject";

type ProjectSectionPlaceholderProps = {
    title: string;
    description: string;
};

export default function ProjectSectionPlaceholder({
    title,
    description,
}: ProjectSectionPlaceholderProps) {
    const { project } = useProject();

    return (
        <section className="flex min-h-70 flex-col justify-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-md bg-[#EDE9FE] px-2.5 py-1 text-xs font-bold tracking-wide text-[#7C3AED]">
                    {project.key}
                </span>
                <span className="text-sm text-[#6B7280]">{project.name}</span>
            </div>
            <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">{title}</h1>
            <p className="max-w-xl text-base text-[#6B7280]">{description}</p>
        </section>
    );
}
