import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_URL } from "../config/api";
import {
    getAccessToken,
    getRefreshToken,
    logout,
    refreshAccessToken,
} from "../utils/auth";

type RetryRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

type QueueItem = {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
};

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

let isRefreshing = false;
let refreshQueue: QueueItem[] = [];

function isPublicAuthRequest(config: InternalAxiosRequestConfig) {
    const url = `${config.baseURL ?? ""}${config.url ?? ""}`;
    return /\/auth\/(login|register|refresh)(?:\?|$)/.test(url);
}

function processRefreshQueue(error: unknown, token: string | null) {
    const queue = refreshQueue;
    refreshQueue = [];

    for (const item of queue) {
        if (error || !token) {
            item.reject(error ?? new Error("Refresh token failed"));
        } else {
            item.resolve(token);
        }
    }
}

function redirectToLogin() {
    logout();

    const path = window.location.pathname;
    if (path === "/login" || path === "/cadastro" || path === "/register") {
        return;
    }

    window.location.assign("/login");
}

api.interceptors.request.use((config) => {
    if (isPublicAuthRequest(config)) {
        return config;
    }

    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryRequestConfig | undefined;

        if (!originalRequest || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        if (isPublicAuthRequest(originalRequest)) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            redirectToLogin();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                refreshQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            if (!getRefreshToken()) {
                throw error;
            }

            const accessToken = await refreshAccessToken();
            if (!accessToken) {
                throw error;
            }

            processRefreshQueue(null, accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            processRefreshQueue(refreshError, null);
            redirectToLogin();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);
