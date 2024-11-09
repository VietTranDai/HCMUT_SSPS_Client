'use client';

import hcmut from '../assets/logo_bku.png';
import Link from 'next/link';
import './layout.css';
import { useState } from 'react';

const Sidebar = () => {
    const [cont, setCont] = useState<number>(0);
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
            link: '/customer'
        },
        {
            title: 'LỊCH SỬ GIAO DỊCH',
            link: '/customer'
        }
    ];
    return (
        <div style={{ minHeight: '100vh', background: '#4663B7', width: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={hcmut.src} style={{ height: '90px' }}></img>
            </div>
            <div style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', marginTop: '50px' }}>
                {sidebar_content.map((content, index) => (
                    <div key={index} className={cont === index ? 'sidebar-content sidebar-content-extra' : 'sidebar-content'}>
                        <Link onClick={() => setCont(index)} href={content.link} style={cont === index ? { textDecoration: 'none', color: '#7E7E7E' } : { textDecoration: 'none', color: '#E5DEDE' }}>
                            {content.title}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
