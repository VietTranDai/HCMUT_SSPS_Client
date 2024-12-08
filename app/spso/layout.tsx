import React from 'react';
import Header from '../default-layout/Header';
import Sidebar, { SidebarType } from '../default-layout/Sidebar';
import Footer from '../default-layout/Footer';
import IndexContextProvider from '../context/IndexContext';
import AuthWrapper from '@/lib/helpers/AuthWrapper';
// import AuthContextProvider from '../context/AuthContext';

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const sidebar_content: SidebarType[] = [
        {
            title: 'Danh sách máy in',
            link: '/spso/printers'
        },
        {
            title: 'Danh sách báo cáo',
            link: '/spso/reportlist'
        }
    ];

    return (
        <IndexContextProvider>
            <AuthWrapper>
                <div style={{ display: 'flex', minHeight: '100vh', background: '#F9F9F9' }}>
                    <Sidebar sidebar_content={sidebar_content} />
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
