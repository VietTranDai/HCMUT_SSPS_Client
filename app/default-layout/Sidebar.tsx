'use client';

import hcmut from '../assets/logo_bku.png';
import Link from 'next/link';
import './layout.css';
import { useEffect, useState } from 'react';
import { useIndexContext } from '../hooks/useIndexContext';

const Sidebar = () => {
    const { curIndex, dispatch } = useIndexContext();
    // const [cont, setCont] = useState<number>(0);
    const sidebar_content = [
        {
            title: 'TRANG CHỦ',
            link: '/homepage'
        },
        {
            title: 'IN TÀI LIỆU',
            link: '/printPage'
        },
        {
            title: 'MUA TRANG IN',
            link: '/buy-page'
        },
        {
            title: 'LỊCH SỬ IN',
            link: '/history-print-page'
        },
        {
            title: 'LỊCH SỬ GIAO DỊCH',
            link: '/history-buy-page'
        }
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#4663B7', width: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={hcmut.src} style={{ height: '90px' }}></img>
            </div>
            <div style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginTop: '50px' }}>
                {sidebar_content.map((content, index) => (
                    <div key={index} className={curIndex === index ? 'sidebar-content sidebar-content-extra' : 'sidebar-content'}>
                        <Link onClick={() => dispatch({ type: 'INDEX', payload: index })} href={content.link} style={curIndex === index ? { textDecoration: 'none', color: '#7E7E7E' } : { textDecoration: 'none', color: '#E5DEDE' }}>
                            {content.title}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
