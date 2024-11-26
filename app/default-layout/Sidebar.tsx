'use client';

import hcmut from '../assets/logo_bku.png';
import Link from 'next/link';
import './layout.css';
import { useEffect, useState } from 'react';
import { useIndexContext } from '../hooks/useIndexContext';

const Sidebar = () => {
    const { curIndex, dispatch } = useIndexContext();
    const [prevIndex, setPrevIndex] = useState<number>(0);
    // const [cont, setCont] = useState<number>(0);
    const sidebar_content = [
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

    useEffect(() => {
        // dispatch({ type: 'INDEX', payload: prevIndex });
        if (localStorage.getItem('index') !== null) {
            dispatch({ type: 'INDEX', payload: JSON.parse(localStorage.getItem('index') as string) });
        }
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#4663B7', width: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={hcmut.src} style={{ height: '90px' }}></img>
            </div>
            <div style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginTop: '50px' }}>
                {sidebar_content.map((content, index) => (
                    <div key={index} className={curIndex === index ? 'sidebar-content sidebar-content-extra' : 'sidebar-content'}>
                        <Link
                            onClick={() => {
                                dispatch({ type: 'INDEX', payload: index });
                            }}
                            href={content.link}
                            style={curIndex === index ? { textDecoration: 'none', color: '#7E7E7E' } : { textDecoration: 'none', color: '#E5DEDE' }}
                        >
                            {content.title}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
