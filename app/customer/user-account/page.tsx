import hcmut from '@/app/assets/hcmut.png';
import './index.css';

const UserAccount = () => {
    const user = {
        ID: '111111',
        role: 'Sinh viên',
        name: 'Trần Trung Kiên',
        email: 'kien.trankiensvbk@hcmut.edu.vn',
        sex: 'Nam',
        pageLeft: 70
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: '#6DBCF5', fontWeight: '900', fontSize: '20px', marginTop: '50px' }}>THÔNG TIN TÀI KHOẢN</div>
            <div style={{ paddingTop: '20px', display: 'flex', alignItems: 'center', marginBottom: '40px', width: '500px' }}>
                {/* Avatar */}
                <div style={{ width: '80px', height: '80px', borderRadius: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#6DBCF5' }}>
                    <img src={hcmut.src} style={{ height: '35px' }}></img>
                </div>
                <div style={{ border: '1px solid #A1A1A1', width: '300px', background: 'white', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '10px', marginLeft: '40px' }}>
                    <div style={{ color: '#4663B7', fontWeight: '900', fontSize: '20px', marginBottom: '10px' }}>Tên người dùng</div>
                    <div style={{ fontSize: '18px', fontWeight: '900' }}>{user.name}</div>
                </div>
            </div>
            <div className="container">
                <div className="info-container">
                    <div className="info-header">Mã người dùng</div>
                    <div className="info">{user.ID}</div>
                </div>
                <div className="info-container">
                    <div className="info-header">Họ và tên</div>
                    <div className="info">{user.name}</div>
                </div>
                <div className="info-container">
                    <div className="info-header">Chức vụ</div>
                    <div className="info">{user.role}</div>
                </div>
                <div className="info-container">
                    <div className="info-header">Giới tính</div>
                    <div className="info">{user.sex}</div>
                </div>
                <div className="info-container">
                    <div className="info-header">Số trang còn dư</div>
                    <div className="info">{user.pageLeft}</div>
                </div>
            </div>
        </div>
    );
};

export default UserAccount;
