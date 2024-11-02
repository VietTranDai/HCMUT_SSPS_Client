'use client';

import { Button } from 'antd';
import { useRouter } from 'next/navigation';

export default function PreLoginPage() {
    const router = useRouter();
    return (
        <Button
            onClick={() => {
                router.push('/login');
            }}
        >
            Đăng nhập
        </Button>
    );
}
