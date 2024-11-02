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

const { Title } = Typography;

function LoginPage() {
    const [role, setRole] = useState<Role>(Role.CUSTOMER); // State for role
    const router = useRouter();

    const handleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async ({ code }) => {
            try {
                const { status } = await AuthService.loginWithCode(code, role); // Use role from state
                if (status >= 200 && status < 300) {
                    const authKey = Cookies.get(AUTH_KEY);
                    // Nếu không có Auth_key, chuyển hướng đến trang login
                    if (!authKey) {
                        router.push('/login');
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
                            router.push('/customer');
                            return;
                        }

                        if (user.role === Role.SPSO) {
                            router.push('/spso');
                            return;
                        }
                    } catch (error) {
                        console.error(error);
                        router.push('/login');
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
        <div>
            {/* Todo: Make login page */}
            <Button onClick={() => onLoginClick(Role.CUSTOMER)}>Customer</Button>
            <Button onClick={() => onLoginClick(Role.ADMIN)}>Admin</Button>
            <Button onClick={() => onLoginClick(Role.SPSO)}>Spso</Button>
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
