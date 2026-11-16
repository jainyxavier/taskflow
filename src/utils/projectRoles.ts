import type { ProjectRole } from "../types/project";

export const MANAGEABLE_ROLES: ProjectRole[] = ["viewer", "developer", "admin"];

const ROLE_LABELS: Record<string, string> = {
    owner: "Owner",
    admin: "Admin",
    developer: "Developer",
    viewer: "Viewer",
};

export function getProjectRoleLabel(role: string) {
    return ROLE_LABELS[role] ?? role;
}

export function canManageProjectMembers(role: string) {
    return role === "admin" || role === "owner";
}
