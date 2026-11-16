export type ProjectStatus = "active" | "archived" | "on_hold";

export type Project = {
    id: string;
    name: string;
    key: string;
    description: string | null;
    status: ProjectStatus | string;
    ownerId: string;
    createdAt: string;
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
