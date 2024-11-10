import { Button } from 'antd';

const SecondPart = () => {
    const second_part_content = [
        {
            title: 'Hiệu quả'
        },
        {
            title: 'Nhanh chóng'
        },
        {
            title: 'Tiện lợi'
        }
    ];
    return (
        <div className="second-part">
            <h1 style={{ fontSize: '20px' }}>Dịch vụ của chúng tôi</h1>
            <p style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                SSPS (Student Smart Printing Service) sẽ đáp ứng nhu cầu ngày càng tăng về các giải pháp in ấn hiệu quả,
                <br />
                tiện lợi và đáng tin cậy trong khuôn viên trường.{' '}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', minWidth: '100%' }}>
                {second_part_content.map((content, index) => (
                    <div className="second-part-content" key={index}>
                        {content.title}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button color="primary" style={{ background: '#4663B7', color: '#FFFFFF', fontWeight: 'bolder', fontSize: '15px', paddingLeft: '50px', paddingRight: '50px', paddingTop: '20px', paddingBottom: '20px' }}>
                    Tìm hiểu thêm
                </Button>
            </div>
        </div>
    );
};

export default SecondPart;
