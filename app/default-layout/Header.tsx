'use client';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '../hooks/useAuthContext';

const Header = () => {
    const router = useRouter();
    const { auth, dispatch } = useAuthContext();

    return (
        <div style={{ height: '90px', display: 'flex', justifyContent: 'end', alignItems: 'center', background: '#FFFFFF', position: 'relative' }}>
            {/* <SmallMenu /> */}
            <div style={{ color: '#7E7E7E', fontWeight: 900, fontSize: '18px', marginRight: '50px' }}>SPSS Service</div>
            <div
                onClick={() => router.push('/login')}
                className="login-button"
                style={{ color: '#7E7E7E', fontSize: '18px', borderLeft: '1px solid #A1A1A1', height: '70px', display: 'flex', alignItems: 'center', paddingLeft: '50px', paddingRight: '50px' }}
            >
                Đăng nhập
            </div>
        </div>
    );
};

export default Header;
