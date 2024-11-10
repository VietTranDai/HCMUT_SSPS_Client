import { Button } from 'antd';
import './index.css';
import SecondPart from './components/SecondPart';
import FirstPart from './components/FirstPart';
import ThirdPart from './components/ThirdPart';
const HomePage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '1000px' }}>
            {/* First part */}
            <FirstPart />
            {/* Second part */}
            <SecondPart />
            {/* Third part */}
            <ThirdPart />
        </div>
    );
};

export default HomePage;
