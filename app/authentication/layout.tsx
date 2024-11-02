import React, { Children } from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <div>{children}</div>;
};
