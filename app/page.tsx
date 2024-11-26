'use client';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'; // Sử dụng thư viện js-cookie để lấy cookies
import { useEffect } from 'react';
import { Role } from '@/types/role';
import { AUTH_KEY } from '@/lib/services/auth.service';
export default function MyComponent() {
    const router = useRouter();

    useEffect(() => {
        // Lấy Auth_key từ cookies
        const authKey = Cookies.get(AUTH_KEY);

        // Nếu Auth_key không tồn tại, có thể điều hướng về trang đăng nhập hoặc xử lý lỗi
        if (!authKey) {
            router.push('/login');
            return;
        }

        try {
            // Giả sử authKey là một chuỗi JSON chứa thông tin role, ví dụ: { role: 'admin' }
            const user = JSON.parse(authKey);
            // Kiểm tra role của user và điều hướng
            console.log('User role: ', user.role);
            switch (user.role) {
                case Role.ADMIN:
                    router.push('/admin');
                    break;
                case Role.CUSTOMER:
                    router.push('/customer/homepage');
                    break;
                default:
                    router.push('/spso');
                    break;
            }
        } catch (error) {
            console.error('Lỗi parse JSON: ', error);
            // Điều hướng về login nếu lỗi parse xảy ra
            router.push('/login');
        }
    }, []); // Chỉ chạy một lần khi component mount

    return <div>Loading...</div>;
}
