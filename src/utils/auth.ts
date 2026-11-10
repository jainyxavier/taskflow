import { API_URL } from "../config/api";

export function saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
}

export function getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
}

export function getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
}

export type AuthUser = {
    id?: string;
    name: string;
    email?: string;
};

const CURRENT_USER_KEY = "currentUser";

export function saveCurrentUser(user: AuthUser) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;

    try {
        const user = JSON.parse(raw) as AuthUser;
        if (typeof user?.name !== "string" || !user.name.trim()) return null;
        return { ...user, name: user.name.trim() };
    } catch {
        return null;
    }
}

function persistUserFromPayload(payload: unknown) {
    if (!payload || typeof payload !== "object") return;

    const data = payload as { id?: string; name?: string; email?: string };
    if (typeof data.name !== "string" || !data.name.trim()) return;

    saveCurrentUser({
        id: data.id,
        name: data.name.trim(),
        email: data.email,
    });
}

export function clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem(CURRENT_USER_KEY);
}

export function logout() {
    clearTrustedSession();
    clearTokens();
}

let trustedSession = false;

export function markSessionTrusted() {
    trustedSession = true;
}

export function consumeTrustedSession(): boolean {
    const isTrusted = trustedSession;
    trustedSession = false;
    return isTrusted;
}

export function clearTrustedSession() {
    trustedSession = false;
}

type AuthResponse = {
    accessToken?: string;
    refreshToken?: string;
    access_token?: string;
    refresh_token?: string;
    user?: AuthUser;
};

const LOGIN_INVALID_CREDENTIALS = "Email ou senha inválidos";
const LOGIN_NETWORK_ERROR = "Não foi possível conectar ao servidor";
const LOGIN_EMAIL_INVALID = "Informe um e-mail válido.";
const LOGIN_PASSWORD_EMPTY = "A senha não pode estar vazia.";

export type AuthFieldErrors = {
    email?: string;
    password?: string;
};

export class AuthRequestError extends Error {
    readonly fields: AuthFieldErrors;

    constructor(message: string, fields: AuthFieldErrors = {}) {
        super(message);
        this.name = "AuthRequestError";
        this.fields = fields;
    }
}

function isNetworkError(error: unknown) {
    if (error instanceof TypeError) return true;
    if (error instanceof DOMException && error.name === "AbortError") return true;

    return (
        error instanceof Error &&
        /failed to fetch|networkerror|load failed|network request failed/i.test(error.message)
    );
}

async function readErrorPayload(response: Response): Promise<unknown> {
    try {
        return await response.json();
    } catch {
        return null;
    }
}

function extractValidationMessages(payload: unknown): string[] {
    if (!payload || typeof payload !== "object") return [];

    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string") return [message];
    if (Array.isArray(message)) {
        return message.filter((item): item is string => typeof item === "string");
    }

    return [];
}

function mapLoginFieldErrors(messages: string[]): AuthFieldErrors {
    const fields: AuthFieldErrors = {};

    for (const raw of messages) {
        const message = raw.toLowerCase();

        if (message.includes("email")) {
            fields.email = LOGIN_EMAIL_INVALID;
            continue;
        }

        if (message.includes("password")) {
            fields.password =
                message.includes("longer") || message.includes("min") || message.includes("6")
                    ? "A senha deve ter pelo menos 6 caracteres."
                    : LOGIN_PASSWORD_EMPTY;
        }
    }

    return fields;
}

export function isLoggedIn(): boolean {
    return Boolean(getAccessToken());
}

export function hasStoredSession(): boolean {
    return Boolean(getAccessToken() || getRefreshToken());
}

export function getPostLoginPath(from?: string | null): string {
    if (!from || from === "/login" || from === "/cadastro") {
        return "/";
    }

    return from;
}

function decodeJwtPayload(token: string): { exp?: number } | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;

        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
        return JSON.parse(atob(padded)) as { exp?: number };
    } catch {
        return null;
    }
}

export function isAccessTokenExpired(token: string, leewayMs = 5_000): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return true;
    return payload.exp * 1000 <= Date.now() + leewayMs;
}

export async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) return null;

        const data = (await response.json()) as AuthResponse;
        const accessToken = data.accessToken ?? data.access_token;
        if (!accessToken) return null;

        saveTokens(accessToken, refreshToken);
        return accessToken;
    } catch {
        return null;
    }
}

async function fetchCurrentUser(accessToken: string) {
    return fetch(`${API_URL}/auth/me`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export async function validateSession(): Promise<boolean> {
    let accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken && !refreshToken) {
        return false;
    }

    try {
        if (!accessToken || isAccessTokenExpired(accessToken)) {
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                clearTokens();
                return false;
            }
        }

        const response = await fetchCurrentUser(accessToken);

        if (response.ok) {
            persistUserFromPayload(await response.json());
            return true;
        }

        if (response.status === 401) {
            const renewed = await refreshAccessToken();
            if (!renewed) {
                clearTokens();
                return false;
            }

            const retry = await fetchCurrentUser(renewed);
            if (retry.ok) {
                persistUserFromPayload(await retry.json());
                return true;
            }

            clearTokens();
            return false;
        }

        return false;
    } catch {
        return false;
    }
}

function persistAuthResponse(data: AuthResponse, fallbackMessage: string) {
    const accessToken = data.accessToken ?? data.access_token;
    const refreshToken = data.refreshToken ?? data.refresh_token ?? "";

    if (!accessToken) {
        throw new Error(fallbackMessage);
    }

    saveTokens(accessToken, refreshToken);
    persistUserFromPayload(data.user);
}

export async function getCurrentUserProfile(): Promise<AuthUser | null> {
    const cached = getCurrentUser();
    if (cached) return cached;

    try {
        let accessToken = getAccessToken();
        if (!accessToken || isAccessTokenExpired(accessToken)) {
            accessToken = await refreshAccessToken();
        }
        if (!accessToken) return null;

        let response = await fetchCurrentUser(accessToken);
        if (response.status === 401) {
            accessToken = await refreshAccessToken();
            if (!accessToken) {
                clearTokens();
                return null;
            }
            response = await fetchCurrentUser(accessToken);
        }

        if (!response.ok) return null;
        persistUserFromPayload(await response.json());
        return getCurrentUser();
    } catch {
        return null;
    }
}

export async function login(email: string, password: string) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.status === 401) {
            throw new AuthRequestError(LOGIN_INVALID_CREDENTIALS);
        }

        if (response.status === 400) {
            const payload = await readErrorPayload(response);
            const fields = mapLoginFieldErrors(extractValidationMessages(payload));
            const message = fields.email ?? fields.password ?? "Verifique os dados informados.";
            throw new AuthRequestError(message, fields);
        }

        if (!response.ok) {
            throw new AuthRequestError(LOGIN_NETWORK_ERROR);
        }

        const data = (await response.json()) as AuthResponse;
        persistAuthResponse(data, "Não foi possível entrar. Tente novamente.");
    } catch (error) {
        if (error instanceof AuthRequestError) throw error;
        if (isNetworkError(error)) {
            throw new AuthRequestError(LOGIN_NETWORK_ERROR);
        }
        throw error;
    }
}

export async function register(name: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password }),
    });

    if (response.status === 409) {
        throw new Error("Este e-mail já está cadastrado.");
    }

    if (!response.ok) {
        throw new Error("Não foi possível criar a conta. Verifique os dados e tente novamente.");
    }

    const data = (await response.json()) as AuthResponse;
    persistAuthResponse(data, "Não foi possível criar a conta. Tente novamente.");
}
