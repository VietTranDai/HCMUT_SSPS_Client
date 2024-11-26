import React from 'react';
import Header from '../default-layout/Header';
import Sidebar from '../default-layout/Sidebar';
import Footer from '../default-layout/Footer';
import IndexContextProvider from '../context/IndexContext';
import AuthWrapper from '@/lib/helpers/AuthWrapper';
// import AuthContextProvider from '../context/AuthContext';

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <IndexContextProvider>
            <AuthWrapper>
                <div style={{ display: 'flex', minHeight: '100vh', background: '#F9F9F9' }}>
                    <Sidebar />
                    <div style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                        <Header />
                        {children}
                        <Footer />
                    </div>
                </div>
            </AuthWrapper>
        </IndexContextProvider>
    );
};

export default DefaultLayout;
