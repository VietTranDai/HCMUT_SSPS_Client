'use client';

import './layout.css';
import { useRouter } from 'next/navigation';
import React from 'react';

const SmallMenu = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
    const router = useRouter();
    return (
        <div ref={ref} style={{ background: '#FFFFFF', position: 'absolute', right: '30px', top: '100px', width: '220px', height: '200px', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
            <div className="small-menu-content" onClick={() => router.push('/user-account')}>
                Thông tin tài khoản
            </div>
            <div className="small-menu-content">Cài đặt</div>
            <div style={{ border: '1px solid #ADADAD', width: '80%', marginTop: '20px', marginLeft: '20px' }}></div>
            <div className="small-menu-content">Đăng xuất</div>
        </div>
    );
});

export default SmallMenu;
