import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth-store';
import { baseUrl } from '../constants/app.config';
import { retrySkipApiRoutes } from '../constants/routes';

let isRefreshing = false;
let refreshSubscribers: { resolve: () => void; reject: (err: unknown) => void }[] = [];

const onRefreshed = () => {
    refreshSubscribers.forEach((sub) => {
        sub.resolve();
    });
    refreshSubscribers = [];
};

const onRefreshFailed = (err: unknown) => {
    refreshSubscribers.forEach((sub) => {
        sub.reject(err);
    });
    refreshSubscribers = [];
};

const subscribeToRefresh = (resolve: () => void, reject: (err: unknown) => void) => {
    refreshSubscribers.push({ resolve, reject });
};

const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true, // handles auth via httpOnly cookie automatically
    headers: {
        'Content-Type': 'application/json'
    }
});

// ─── Request: attach JWT ───────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
    (config) => {
        // For FormData, remove Content-Type to let axios auto-set multipart/form-data with boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        // Pull the token directly from your Zustand store state
        const accessToken = useAuthStore.getState().accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
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

        const isAuthRoute = retrySkipApiRoutes.some((path) => originalRequest.url?.includes(path));

        // if signin or refresh request itself failed, just reject with error message
        if (isAuthRoute) {
            return Promise.reject(err ?? error);
        } else if (error.response) {
            // Only log actual API errors, not network errors
            console.error('API error:', {
                url: originalRequest.url,
                method: originalRequest.method,
                status: error.response?.status,
                responseData: err
            });

            // 401 — try silent refresh first, then kick to login

            if (error?.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true; // prevent infinite loop

                // If already refreshing, queue this request
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        subscribeToRefresh(
                            () => resolve(axiosInstance(originalRequest)),
                            (err) => reject(err ?? error)
                        );
                    });
                }

                isRefreshing = true;

                try {
                    // httpOnly refresh cookie is auto-sent
                    const data = await axiosInstance.post<unknown, { access_token: string }>('/auth/refresh');

                    onRefreshed();

                    if (data?.access_token) {
                        useAuthStore.getState().setToken(data.access_token);
                    }

                    // just retry — browser will auto-send the new cookie
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // refresh failed — session truly expired
                    onRefreshFailed(refreshError);
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
        }
        return Promise.reject(err ?? error);
    }
);

// ─── Orval-compatible export ───────────────────────────────────────────────
export const axiosInstanceFn = <T>(config: AxiosRequestConfig): Promise<T> => {
    return axiosInstance(config);
};

export default axiosInstanceFn;
