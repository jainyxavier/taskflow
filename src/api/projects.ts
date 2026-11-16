import { isAxiosError } from "axios";
import { api } from "./client";
import type {
    CreateProjectInput,
    ListProjectsParams,
    PaginatedProjects,
    Project,
    ProjectDetail,
    ProjectMember,
    ProjectRole,
} from "../types/project";

export class ProjectRequestError extends Error {
    status?: number;
    fields: Partial<Record<"name" | "key" | "description", string>>;

    constructor(
        message: string,
        options?: {
            status?: number;
            fields?: Partial<Record<"name" | "key" | "description", string>>;
        },
    ) {
        super(message);
        this.name = "ProjectRequestError";
        this.status = options?.status;
        this.fields = options?.fields ?? {};
    }
}

export class ProjectMemberRequestError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = "ProjectMemberRequestError";
        this.status = status;
    }
}

function mapMemberError(error: unknown, fallback: string): never {
    if (!isAxiosError(error)) {
        throw new ProjectMemberRequestError("Não foi possível conectar ao servidor");
    }

    if (!error.response) {
        throw new ProjectMemberRequestError("Não foi possível conectar ao servidor");
    }

    const status = error.response.status;

    if (status === 403) {
        throw new ProjectMemberRequestError(
            "Você não tem permissão para esta ação",
            status,
        );
    }

    if (status === 409) {
        throw new ProjectMemberRequestError(
            "Este usuário já faz parte do projeto",
            status,
        );
    }

    if (status === 404) {
        throw new ProjectMemberRequestError("Recurso não encontrado", status);
    }

    throw new ProjectMemberRequestError(fallback, status);
}

function mapCreateError(error: unknown): never {
    if (!isAxiosError(error)) {
        throw new ProjectRequestError("Não foi possível conectar ao servidor");
    }

    if (!error.response) {
        throw new ProjectRequestError("Não foi possível conectar ao servidor");
    }

    const status = error.response.status;
    const payload = error.response.data as
        | {
              message?: string | string[] | Record<string, string[] | string>;
          }
        | undefined;

    if (status === 409) {
        throw new ProjectRequestError("Esta key já está em uso", {
            status,
            fields: { key: "Esta key já está em uso" },
        });
    }

    if (status === 400) {
        const fields: Partial<Record<"name" | "key" | "description", string>> = {};
        const message = payload?.message;

        if (message && typeof message === "object" && !Array.isArray(message)) {
            for (const [field, value] of Object.entries(message)) {
                if (field === "name" || field === "key" || field === "description") {
                    fields[field] = Array.isArray(value) ? value.join(", ") : String(value);
                }
            }
        }

        const fallback = Array.isArray(message)
            ? message.join(", ")
            : typeof message === "string"
              ? message
              : "Verifique os dados informados.";

        if (Object.keys(fields).length === 0) {
            const lower = fallback.toLowerCase();
            if (lower.includes("key")) {
                fields.key = fallback;
            } else if (lower.includes("name") || lower.includes("nome")) {
                fields.name = fallback;
            }
        }

        throw new ProjectRequestError(
            Object.values(fields)[0] || fallback || "Verifique os dados informados.",
            { status, fields },
        );
    }

    throw new ProjectRequestError("Não foi possível criar o projeto", { status });
}

export async function listProjects(
    params: ListProjectsParams = {},
): Promise<PaginatedProjects> {
    const { page = 1, limit = 20, search = "" } = params;

    const { data } = await api.get<PaginatedProjects>("/projects", {
        params: {
            page,
            limit: Math.min(limit, 100),
            ...(search.trim() ? { search: search.trim() } : {}),
        },
    });

    return data;
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
    try {
        const { data } = await api.post<Project>("/projects", input);
        return data;
    } catch (error) {
        mapCreateError(error);
    }
}

export async function getProject(projectId: string): Promise<ProjectDetail> {
    const { data } = await api.get<ProjectDetail>(`/projects/${projectId}`);
    return data;
}

export async function addProjectMember(
    projectId: string,
    input: { userId: string; role: ProjectRole },
): Promise<ProjectMember> {
    try {
        const { data } = await api.post<ProjectMember>(
            `/projects/${projectId}/members`,
            input,
        );
        return data;
    } catch (error) {
        mapMemberError(error, "Não foi possível adicionar o membro");
    }
}

export async function updateProjectMemberRole(
    projectId: string,
    userId: string,
    role: ProjectRole,
): Promise<ProjectMember> {
    try {
        const { data } = await api.patch<ProjectMember>(
            `/projects/${projectId}/members/${userId}`,
            { role },
        );
        return data;
    } catch (error) {
        mapMemberError(error, "Não foi possível atualizar a role");
    }
}

export async function removeProjectMember(
    projectId: string,
    userId: string,
): Promise<void> {
    try {
        await api.delete(`/projects/${projectId}/members/${userId}`);
    } catch (error) {
        mapMemberError(error, "Não foi possível remover o membro");
    }
}

type CountResponse = {
    total: number;
};

export async function getProjectStoryCount(projectId: string): Promise<number> {
    const { data } = await api.get<CountResponse>(`/stories/project/${projectId}`, {
        params: { page: 1, limit: 1 },
    });
    return data.total;
}

export async function getProjectSprintCount(projectId: string): Promise<number> {
    const { data } = await api.get<CountResponse>(`/sprints/project/${projectId}`, {
        params: { page: 1, limit: 1 },
    });
    return data.total;
}
