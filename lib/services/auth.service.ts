import { Role } from '@/types/role';
import httpClient from './httpClient';
import { getCookie, removeCookie, setCookie } from '../helpers/cookieStorage';

export type LoginDataResponse = {
    msg: string;
    data: LoginData;
};

export type LoginData = {
    token: string;
    user: {
        id: string;
        email: string;
        familyName: string | null;
        givenName: string | null;
        role: Role;
        createdAt: string;
        updatedAt: string;
        avatar: string | null;
    };
};

export const AUTH_KEY = 'auth';

const AuthService = {
    loginWithCode: async (code: string, role: Role) => {
        const redirectUrl = window.location.origin;
        const resp = await httpClient.get<LoginDataResponse>('/auth/google/redirect', {
            params: { code, role, redirectUrl }
        });

        const { data, status } = resp;
        if (data.msg == 'Success') {
            const loginData = data.data;
            setCookie(AUTH_KEY, loginData, true);
        }
        return { data, status };
    },

    logout: () => {
        removeCookie(AUTH_KEY);
        window.location.href = '/login';
    },

    getUser: () => {
        const data = getCookie<LoginData>(AUTH_KEY);
        return data?.user;
    }
};

export default AuthService;
