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
            title: 'TRANG CHỦ',
            link: '/customer/homepage'
        },
        {
            title: 'IN TÀI LIỆU',
            link: '/customer/printPage'
        },
        {
            title: 'MUA TRANG IN',
            link: '/customer/buy-page'
        },
        {
            title: 'LỊCH SỬ IN',
            link: '/customer/history-print-page'
        },
        {
            title: 'LỊCH SỬ GIAO DỊCH',
            link: '/customer/history-buy-page'
        }
    ];

    return (
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
    );
};

export default DefaultLayout;
