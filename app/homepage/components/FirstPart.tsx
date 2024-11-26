'use client';

import { useIndexContext } from '@/app/hooks/useIndexContext';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

const FirstPart = () => {
    const router = useRouter();
    const { curIndex, dispatch } = useIndexContext();

    const handleButton = (index: number) => {
        dispatch({ type: 'INDEX', payload: index });
        router.push('/printPage');
    };
    return (
        <div className="first-part">
            <div style={{ color: '#6DBCF5', fontWeight: 'bolder', fontSize: '20px' }}>SPSS Service</div>
            <p style={{ textAlign: 'center', color: '#ADADAD', fontWeight: '900', fontSize: '17px', marginTop: '10px', marginBottom: '10px' }}>
                SPSS service là dịch vụ cung cấp cho sinh viên/ giảng viên <br />
                có nhu cầu in/ ấn tài liệu
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={() => handleButton(1)} color="primary" style={{ background: '#6DBCF5', color: '#FFFFFF', fontWeight: 'bolder', fontSize: '15px', paddingLeft: '50px', paddingRight: '50px', paddingTop: '20px', paddingBottom: '20px' }}>
                    In tài liệu
                </Button>
            </div>
        </div>
    );
};

export default FirstPart;
