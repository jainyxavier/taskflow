import { api } from "./client";

export type ListedUser = {
    id: string;
    name: string;
    email: string;
    role?: string;
    avatarUrl?: string | null;
    isActive?: boolean;
};

type PaginatedUsers = {
    data: ListedUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export async function searchUsersByEmail(email: string): Promise<ListedUser | null> {
    const normalized = email.trim().toLowerCase();
    if (!normalized) return null;

    const { data } = await api.get<PaginatedUsers>("/users", {
        params: {
            page: 1,
            limit: 20,
            search: normalized,
        },
    });

    const exact = data.data.find((user) => user.email.toLowerCase() === normalized);
    return exact ?? data.data[0] ?? null;
}
