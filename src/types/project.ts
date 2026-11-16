export type ProjectStatus = "active" | "archived" | "on_hold";

export type ProjectRole = "owner" | "admin" | "developer" | "viewer";

export type ProjectMemberUser = {
    id: string;
    name: string;
    email: string;
};

export type ProjectMember = {
    userId: string;
    role: ProjectRole | string;
    user: ProjectMemberUser;
};

export type Project = {
    id: string;
    name: string;
    key: string;
    description: string | null;
    status: ProjectStatus | string;
    ownerId: string;
    createdAt: string;
};

export type ProjectDetail = Project & {
    members: ProjectMember[];
};

export type PaginatedProjects = {
    data: Project[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type CreateProjectInput = {
    name: string;
    key: string;
    description?: string;
};

export type ListProjectsParams = {
    page?: number;
    limit?: number;
    search?: string;
};
