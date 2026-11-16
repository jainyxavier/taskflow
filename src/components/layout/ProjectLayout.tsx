import { Navigate, NavLink, Outlet, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    HiOutlineClipboardDocumentList,
    HiOutlineCog6Tooth,
    HiOutlineFlag,
    HiOutlineHome,
    HiOutlineQueueList,
    HiOutlineRocketLaunch,
    HiOutlineUsers,
} from "react-icons/hi2";
import { getProject } from "../../api/projects";
import { ProjectContext } from "../../hooks/useProject";
import { useAuthStore } from "../../stores/authStore";
import type { ProjectRole } from "../../types/project";
import { canManageProjectMembers } from "../../utils/projectRoles";
import ProjectSkeleton from "./ProjectSkeleton";

const NAV_ITEMS = [
    { to: "overview", label: "Visão geral", icon: HiOutlineHome },
    { to: "board", label: "Board", icon: HiOutlineClipboardDocumentList },
    { to: "backlog", label: "Backlog", icon: HiOutlineQueueList },
    { to: "sprints", label: "Sprints", icon: HiOutlineRocketLaunch },
    { to: "epics", label: "Épicos", icon: HiOutlineFlag },
    { to: "members", label: "Membros", icon: HiOutlineUsers },
    { to: "settings", label: "Configurações", icon: HiOutlineCog6Tooth },
] as const;

function navClassName({ isActive }: { isActive: boolean }) {
    return [
        "inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
        isActive
            ? "bg-[#EDE9FE] text-[#7C3AED]"
            : "text-[#6B7280] hover:bg-[#F5F3FF] hover:text-[#7C3AED]",
    ].join(" ");
}

export default function ProjectLayout() {
    const { projectId } = useParams<{ projectId: string }>();
    const currentUserId = useAuthStore((state) => state.user?.id);

    const { data: project, isLoading, isError } = useQuery({
        queryKey: ["project", projectId],
        queryFn: () => getProject(projectId!),
        enabled: Boolean(projectId),
        retry: false,
    });

    if (!projectId) {
        return <Navigate to="/projects" replace />;
    }

    if (isLoading) {
        return <ProjectSkeleton />;
    }

    if (isError || !project) {
        return <Navigate to="/projects" replace />;
    }

    const membership = project.members?.find((member) => member.userId === currentUserId);
    const userRole: ProjectRole | string = membership?.role || "viewer";
    const canManageMembers = canManageProjectMembers(userRole);

    return (
        <ProjectContext.Provider value={{ project, userRole, canManageMembers }}>
            <div className="flex w-full flex-1 flex-col gap-4 pt-6 lg:flex-row lg:gap-6">
                <aside className="w-full shrink-0 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm lg:w-64 lg:self-start">
                    <div className="mb-4 border-b border-[#F3F4F6] pb-4">
                        <span className="inline-flex rounded-md bg-[#EDE9FE] px-2.5 py-1 text-xs font-bold tracking-wide text-[#7C3AED]">
                            {project.key}
                        </span>
                        <h2 className="mt-2 truncate text-lg font-semibold text-[#111827]">
                            {project.name}
                        </h2>
                    </div>

                    <nav
                        className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
                        aria-label="Navegação do projeto"
                    >
                        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={`/projects/${projectId}/${to}`}
                                className={navClassName}
                            >
                                <Icon className="size-5 shrink-0" aria-hidden />
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                <main className="min-w-0 flex-1">
                    <Outlet />
                </main>
            </div>
        </ProjectContext.Provider>
    );
}
