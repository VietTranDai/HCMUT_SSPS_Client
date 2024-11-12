export interface authType {
    avatar: string;
    email: string;
    familyName: string;
    givenName: string;
    role: string;
}

export type authAction = { type: 'LOGIN'; payload: authType } | { type: 'LOGOUT'; payload: authType };
