'use client'; // Đánh dấu là component client-side

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Dùng để điều hướng
import Cookies from 'js-cookie'; // Sử dụng js-cookie để truy cập cookies
import { Role } from '../../types/role'; // Import role
import { AUTH_KEY } from '../services/auth.service'; // Import AUTH_KEY

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        // Lấy Auth_key từ cookies trên client
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
            const pathname = window.location.pathname;
            if (pathname.startsWith('/admin') && user.role !== Role.ADMIN) {
                router.push('/login');
                return;
            }

            if (pathname.startsWith('/customer') && user.role !== Role.CUSTOMER) {
                router.push('/login');
                return;
            }

            if (pathname.startsWith('/spso') && user.role !== Role.SPSO) {
                router.push('/login');
                return;
            }
        } catch (error) {
            console.error(error);
            router.push('/login');
            return;
        }
    }, [router]);

    // Render children nếu vượt qua tất cả kiểm tra
    return <>{children}</>;
}
