import type { AxiosResponse } from 'axios';
import { baseApiClient } from '@/shared/api';
import type { LoginBody, LoginResponse } from '@/features/auth/types';

const urls = {
    login: '/login',
};

export class AuthAPI {
    constructor(private api = baseApiClient) {}

    login = async (body: LoginBody) => {
        const result: AxiosResponse<LoginResponse> = await this.api.post(
            urls.login,
            body
        );
        return result.data;
    };
}

export const authApi = new AuthAPI();
