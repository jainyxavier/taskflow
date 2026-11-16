import { createContext, useContext } from "react";
import type { ProjectDetail, ProjectRole } from "../types/project";

export type ProjectContextValue = {
    project: ProjectDetail;
    userRole: ProjectRole | string;
    canManageMembers: boolean;
};

export const ProjectContext = createContext<ProjectContextValue | null>(null);

export function useProject() {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProject precisa estar dentro de ProjectLayout");
    }
    return context;
}
