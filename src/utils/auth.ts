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

export function clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
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
};

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
            return true;
        }

        if (response.status === 401) {
            const renewed = await refreshAccessToken();
            if (!renewed) {
                clearTokens();
                return false;
            }

            const retry = await fetchCurrentUser(renewed);
            if (retry.ok) return true;

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
}

export async function login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error("E-mail ou senha inválidos.");
    }

    const data = (await response.json()) as AuthResponse;
    persistAuthResponse(data, "Não foi possível entrar. Tente novamente.");
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
