import * as SessionKeys from '../constants/session-constants';

export const getFromStorage = (key: string) => {
    return localStorage.getItem(key) || localStorage.getItem(key);
};

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
