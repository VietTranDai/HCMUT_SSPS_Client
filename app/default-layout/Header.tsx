'use client';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState, useRef } from 'react';
import SmallMenu from './SmallMenu';
import { AUTH_KEY } from '@/lib/services/auth.service'; // Import AUTH_KEY
import Cookies from 'js-cookie';

const Header = () => {
    const router = useRouter();
    const { auth, dispatch } = useAuthContext();
    const [open, setOpen] = useState<boolean>(false);
    let menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const authKey = Cookies.get(AUTH_KEY);
        try {
            if (authKey) {
                dispatch({ type: 'LOGIN', payload: JSON.parse(authKey as string).data.user });
            }
        } catch (err) {
            console.log(err);
        }
        let handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (menuRef.current && !menuRef.current?.contains(e.target as HTMLDivElement) && !target.closest('img')) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    }, []);
    return (
        <div style={{ height: '90px', display: 'flex', justifyContent: 'end', alignItems: 'center', background: '#FFFFFF', position: 'relative' }}>
            {open && <SmallMenu ref={menuRef} />}
            <div style={{ color: '#7E7E7E', fontWeight: 900, fontSize: '18px', marginRight: '50px' }}>SPSS Service</div>
            <div style={{ height: '50%', border: '1px solid #A1A1A1' }}></div>
            {auth.avatar === '' ? (
                <div onClick={() => router.push('/login')} className="login-button" style={{ color: '#7E7E7E', fontSize: '18px', height: '70px', display: 'flex', alignItems: 'center', paddingLeft: '50px', paddingRight: '50px' }}>
                    Đăng nhập
                </div>
            ) : (
                <img
                    onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setOpen(!open);
                    }}
                    src={auth.avatar}
                    style={{ height: '50px', borderRadius: '30px', marginLeft: '50px', marginRight: '50px', cursor: 'pointer' }}
                ></img>
            )}
        </div>
    );
};

export default Header;
