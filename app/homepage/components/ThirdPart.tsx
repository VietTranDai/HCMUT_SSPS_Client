import admin from '../../assets/admin.png';
import technician from '@/app/assets/technician.png';
import administrator from '@/app/assets/administrator (1).png';
import manager from '@/app/assets/management.png';
import group from '@/app/assets/group-chat.png';

const ThirdPart = () => {
    const contents = [
        {
            title: 'Sinh viên/ giảng viên',
            image: group
        },
        {
            title: 'HCMUT Admin',
            image: administrator
        },
        {
            title: 'BKPay Admin',
            image: admin
        },
        {
            title: 'SPSO',
            image: manager
        },
        {
            title: 'Nhân viên hỗ trợ kỹ thuật',
            image: technician
        }
    ];
    return (
        <div className="third-part">
            <div style={{ marginBottom: '30px', fontSize: '20px', fontWeight: '800' }}>Các bên liên quan chính</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6rem', width: '900px' }}>
                {contents.map((content, index) => (
                    <div key={index} className="card">
                        <img src={content.image.src} style={{ height: '80px', width: '80px', marginTop: '20px' }}></img>
                        <div style={{ fontWeight: '900', fontSize: '17px', marginTop: '20px' }}>{content.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThirdPart;
