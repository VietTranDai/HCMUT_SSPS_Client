'use client';

import React, { createContext, useContext } from 'react';
import { authAction, authType } from '../types/auth';

interface Props {
    children: React.ReactNode;
}

const initialAuth: authType = {
    avatar: '',
    email: '',
    familyName: '',
    givenName: '',
    role: ''
};
export const AuthContext = createContext<{
    auth: authType;
    dispatch: React.Dispatch<authAction>;
} | null>(null);

export const authReducer = (state: authType, action: authAction) => {
    switch (action.type) {
        case 'LOGIN':
            // console.log(action.payload);
            return action.payload;
        default:
            return state;
    }
};

const AuthContextProvider: React.FC<Props> = ({ children }) => {
    const [auth, dispatch] = React.useReducer(authReducer, initialAuth);

    return <AuthContext.Provider value={{ auth, dispatch }}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
