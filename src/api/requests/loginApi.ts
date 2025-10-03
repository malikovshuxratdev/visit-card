import { AxiosResponse } from 'axios';
import { baseApiClient } from '../baseClient';
import { LoginBodyType, LoginResponseType } from '../../types/login';

const urls = {
    login: '/login',
};

export class LoginAPI {
    constructor(private api = baseApiClient) {}

    login = async (body: LoginBodyType) => {
        const result: AxiosResponse<LoginResponseType> = await this.api.post(
            urls.login,
            body
        );
        return result.data;
    };
}

export const loginApi = new LoginAPI();
