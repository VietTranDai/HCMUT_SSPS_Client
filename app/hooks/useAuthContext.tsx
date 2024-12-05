import React from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuthContext = () => {
    const context = React.useContext(AuthContext);

    if (!context) {
        throw new Error('useAuthContext must be used in AuthCOntextProvider');
    }
    return context;
};
