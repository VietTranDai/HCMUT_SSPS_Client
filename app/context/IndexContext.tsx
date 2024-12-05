'use client';

import React, { useState, createContext } from 'react';
import { indexAction } from '../types/defaultLayout';

interface Props {
    children: React.ReactNode;
}

// const initialIndex: indexType = {
//     index: 0
// };

export const indexContext = createContext<{
    curIndex: number;
    setCurIndex: React.Dispatch<indexAction>;
} | null>(null);

export const indexReducer = (state: number, action: indexAction) => {
    switch (action.type) {
        case 'INDEX':
            localStorage.setItem('index', JSON.stringify(action.payload));
            return action.payload;
        default:
            localStorage.setItem('index', JSON.stringify(0));
            return state;
    }
};

const IndexContextProvider: React.FC<Props> = ({ children }: Props) => {
    const [curIndex, setCurIndex] = React.useReducer(indexReducer, 0);

    return <indexContext.Provider value={{ curIndex, setCurIndex }}>{children}</indexContext.Provider>;
};

export default IndexContextProvider;
