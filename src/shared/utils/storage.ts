import { SessionKeys } from '@/shared/constants';

export class TokenService {
    static getToken() {
        return localStorage.getItem(SessionKeys.TOKEN);
    }

    static setToken(accessToken: string) {
        localStorage.setItem(SessionKeys.TOKEN, accessToken);
    }

    static clearTokens() {
        localStorage.removeItem(SessionKeys.TOKEN);
    }
}
