'use client';

import { Button, Card, Space, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import AuthService, { AUTH_KEY } from '@/lib/services/auth.service';
import { toast } from 'react-toastify';
import { Role } from '@/types/role';
import { useState } from 'react';
import { removeCookie } from '@/lib/helpers/cookieStorage';
import Cookies from 'js-cookie'; // Sử dụng thư viện js-cookie để lấy cookies
import { useAuthContext } from '../hooks/useAuthContext';
import hcmut from '@/app/assets/hcmut.png';
import './index.css';

const { Title } = Typography;

function LoginPage() {
    const [role, setRole] = useState<Role>(Role.CUSTOMER); // State for role
    const router = useRouter();
    const { auth, dispatch } = useAuthContext();
    const login_button = [
        {
            title: 'Tài khoản HCMUT',
            role: Role.CUSTOMER
        },
        {
            title: 'Quản trị viên',
            role: Role.ADMIN
        },
        {
            title: 'SPSO',
            role: Role.SPSO
        }
    ];
    const handleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async ({ code }) => {
            try {
                const { status } = await AuthService.loginWithCode(code, role); // Use role from state
                if (status >= 200 && status < 300) {
                    const authKey = Cookies.get(AUTH_KEY);
                    // Nếu không có Auth_key, chuyển hướng đến trang login
                    if (!authKey) {
                        router.push('/homepage');
                        return;
                    }
                    let user;
                    try {
                        user = JSON.parse(authKey).data.user; // Parse Auth_key để lấy thông tin user
                        // Điều hướng dựa trên role

                        if (user.role === Role.ADMIN) {
                            router.push('/admin');
                            return;
                        }

                        if (user.role === Role.CUSTOMER) {
                            dispatch({ type: 'LOGIN', payload: user });
                            router.push('/homepage');
                            return;
                        }

                        if (user.role === Role.SPSO) {
                            router.push('/spso');
                            return;
                        }
                    } catch (error) {
                        console.error(error);
                        router.push('/homepage');
                        return;
                    }
                } else {
                    removeCookie(AUTH_KEY); // Handle token removal on failure
                }
            } catch {
                toast.error('Đăng nhập thất bại, vui lòng thử lại.'); // Hiển thị lỗi đăng nhập thất bại
                removeCookie(AUTH_KEY); // Handle token removal on failure
            }
        }
    });

    // Function to update role and trigger login
    const onLoginClick = (selectedRole: Role) => {
        setRole(selectedRole); // Update role state
        handleLogin(); // Trigger Google login
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', marginTop: '25px' }}>
            <div className="login-container">
                {/* Todo: Make login page */}
                <h1 style={{ marginTop: '40px' }}>SPSS Service</h1>
                <img src={hcmut.src} style={{ height: '100px', marginTop: '10px', marginBottom: '18px' }}></img>
                <div style={{ fontWeight: '800', fontSize: '18px' }}>Đăng nhập bằng tải khoản của bạn trên </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '30px', justifyContent: 'space-between', height: '120px' }}>
                    {login_button.map((btn, index) => (
                        <div key={index} className="login-btn" onClick={() => onLoginClick(btn.role)}>
                            {index === 0 && <img src={hcmut.src} style={{ height: '25px', marginRight: '10px' }}></img>}
                            {btn.title}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Login() {
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
            <LoginPage />
        </GoogleOAuthProvider>
    );
}
