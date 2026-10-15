import Axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import { buildParams } from './helpers';
import { BASE_URI } from '@/shared/constants';
import { TokenService } from '@/shared/utils/storage';
import { paths } from '@/routes/path';

export class BaseClient {
    private axios: AxiosInstance;
    private static instance: BaseClient | null = null;

    private constructor() {
        this.axios = Axios.create({ baseURL: BASE_URI });

        this.axios.interceptors.request.use(this.attachToken);
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

    private attachToken = (req: InternalAxiosRequestConfig) => {
        const token = TokenService.getToken();
        if (token && !req.headers.Authorization) {
            req.headers.Authorization = `Bearer ${token}`;
        }
        return req;
    };

    private onApiError = (error: AxiosError) => {
        const isLoginRequest = error.config?.url?.includes('/login');

        if (error.response?.status === 401 && !isLoginRequest) {
            // Session expired: drop the token and send the operator to login.
            TokenService.clearTokens();
            if (window.location.pathname !== paths.LOGIN) {
                window.location.replace(paths.LOGIN);
            }
        }

        return Promise.reject(error);
    };

    get = async <T, K = Record<string, unknown>>(
        url: string,
        params?: K,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> => {
        const queryParams = params
            ? buildParams(params as Record<string, unknown>)
            : '';
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
