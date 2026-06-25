import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth-store";

const RETRY_SKIP_ROUTES = ["/login"];

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

const onRefreshed = () => {
    refreshSubscribers.forEach((callback) => callback());
    refreshSubscribers = [];
};

const subscribeToRefresh = (callback: () => void) => {
    refreshSubscribers.push(callback);
};

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL!,
    withCredentials: true, // handles auth via httpOnly cookie automatically
    headers: {
        "Content-Type": "application/json",
    },
});

// ─── Request: attach JWT ───────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
    (config) => {
        // For FormData, remove Content-Type to let axios auto-set multipart/form-data with boundary
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        // Pull the token directly from your Zustand store state
        const accessToken = useAuthStore.getState().accessToken;

        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

// ─── Response: unwrap axios layer ─────────────────────────────────────────
axiosInstance.interceptors.response.use(
    (response) => response.data.data, // kills one data. level globally
    async (error: AxiosError) => {
        const err = error?.response?.data as {
            statusCode: number;
            timestamp: string;
            message: string;
            errors?: Record<string, string>;
        };

        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean;
        };

        const isAuthRoute = RETRY_SKIP_ROUTES.some((path) =>
            originalRequest.url?.includes(path),
        );

        // if signin or refresh request itself failed, just reject with error message
        if (isAuthRoute) {
            return Promise.reject(err ?? error);
        } else if (error.response) {
            // Only log actual API errors, not network errors
            console.error("API error:", {
                url: originalRequest.url,
                method: originalRequest.method,
                status: error.response?.status,
                responseData: err,
            });

            // 401 — try silent refresh first, then kick to login

            if (error?.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // prevent infinite loop

                // If already refreshing, queue this request
                if (isRefreshing) {
                    return new Promise((resolve) => {
                        subscribeToRefresh(() => {
                            resolve(axiosInstance(originalRequest));
                        });
                    });
                }

                isRefreshing = true;

                try {
                    // httpOnly refresh cookie is auto-sent
                    const data = await axiosInstance.post<
                        any,
                        { access_token: string }
                    >("/auth/refresh");

                    console.log("Token refreshed successfully", data);

                    onRefreshed();

                    if (data?.access_token) {
                        useAuthStore.getState().setToken(data.access_token);
                    }

                    // just retry — browser will auto-send the new cookie
                    return axiosInstance(originalRequest);
                } catch {
                    // refresh failed — session truly expired
                    if (typeof window !== "undefined") {
                        window.location.href = "/login";
                    }
                } finally {
                    isRefreshing = false;
                }
            }
        }
        return Promise.reject(err ?? error);
    },
);

// ─── Orval-compatible export ───────────────────────────────────────────────
export const axiosInstanceFn = <T>(config: AxiosRequestConfig): Promise<T> => {
    return axiosInstance(config);
};

export default axiosInstanceFn;
