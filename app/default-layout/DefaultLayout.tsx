import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const DefaultLayout = () => {
    return (
        <div>
            <Header />
            <Sidebar></Sidebar>
            <Footer />
        </div>
    );
};

export default DefaultLayout;
