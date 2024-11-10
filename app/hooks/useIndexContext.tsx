import React from 'react';
import { indexContext } from '../context/IndexContext';

export const useIndexContext = () => {
    const context = React.useContext(indexContext);

    if (!context) {
        throw Error('useIndexContext must be used in IndexContextProvider');
    }
    return context;
};
