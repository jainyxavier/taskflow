import { isAxiosError } from "axios";
import { api } from "./client";
import type {
    CreateProjectInput,
    ListProjectsParams,
    PaginatedProjects,
    Project,
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
