import Axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { buildParams } from './helpers';
import { TokenService } from '../utils/storage';

const API_URL = import.meta.env.VITE_BASE_URI;

declare module 'axios' {
    export interface AxiosRequestConfig {
        _retry?: boolean;
        unhandled?: boolean;
    }
}

export class HTTPError extends Error {
    constructor(public status: number, public cause: string) {
        super(cause);
    }
}
export class BaseClient {
    private baseUrl = API_URL;
    private axios: AxiosInstance;
    private static instance: BaseClient | null = null;

    private constructor() {
        this.axios = Axios.create({
            baseURL: this.baseUrl,
        });

        // Request interceptor for attaching the token
        this.axios.interceptors.request.use(this.attachToken);
        // Response interceptor for handling errors
        this.axios.interceptors.response.use(
            (response: AxiosResponse) => response,
            this.onApiError
        );
    }

    public static getInstance(): BaseClient {
        if (!BaseClient.instance) {
            BaseClient.instance = new BaseClient();
        }
        return BaseClient.instance;
    }

    // Request interceptor for attaching token
    private attachToken = async (req: InternalAxiosRequestConfig) => {
        const token = TokenService.getToken();

        if (token && !req.headers['Authorization']) {
            req.headers = req.headers || {};
            req.headers['Authorization'] = `Bearer ${token}`;
        }

        return req;
    };

    // API Error handler
    private onApiError = async (error: AxiosError) => {
        const originalRequest = error.config;

        if (originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            switch (error.response?.status) {
                case 401: {
                    if (originalRequest.url?.includes('/login')) {
                        return Promise.reject(error);
                    }
                    // Clear tokens and redirect to login for other endpoints
                    TokenService.clearTokens();
                    // Redirect to login page
                    window.location.href = '/login';
                    break;
                }
                case 502:
                    return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    };

    setAccessToken = (token: string) => {
        const newToken = `Bearer ${token}`;
        this.axios.defaults.headers.common.Authorization = newToken;

        return newToken;
    };

    get = async <T, K, C>(
        url: string,
        params?: K,
        config?: AxiosRequestConfig<C>
    ): Promise<AxiosResponse<T>> => {
        const queryParams = params ? buildParams(params) : '';
        return this.axios.get(url + queryParams, config);
    };

    delete = async <T, K>(url: string, data?: K): Promise<AxiosResponse<T>> => {
        return this.axios.delete(url, { params: data });
    };

    post = async <T, K>(
        url: string,
        data?: K,
        config?: AxiosRequestConfig<K>
    ): Promise<AxiosResponse<T>> => {
        return this.axios.post(url, data, config);
    };

    patch = async <T, K>(
        url: string,
        data?: K,
        config?: AxiosRequestConfig<K>
    ): Promise<AxiosResponse<T>> => {
        return this.axios.patch(url, data, config);
    };

    put = async <T, K>(
        url: string,
        data?: K,
        config?: AxiosRequestConfig<K>
    ): Promise<AxiosResponse<T>> => {
        return this.axios.put(url, data, config);
    };
}

export const baseApiClient = BaseClient.getInstance();
