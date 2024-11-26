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
    dispatch: React.Dispatch<indexAction>;
} | null>(null);

export const indexReducer = (state: number, action: indexAction) => {
    switch (action.type) {
        case 'INDEX':
            return action.payload;
        default:
            return state;
    }
};

const IndexContextProvider: React.FC<Props> = ({ children }: Props) => {
    const [curIndex, dispatch] = React.useReducer(indexReducer, 0);

    return <indexContext.Provider value={{ curIndex, dispatch }}>{children}</indexContext.Provider>;
};

export default IndexContextProvider;
