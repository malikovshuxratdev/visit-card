export interface LoginBodyType {
    username: string;
    password: string;
}

export interface LoginResponseType {
    access_token: string;
    token_type: string;
    expires_in: number;
}
