import Navbar from '../components/Navbar';
import MenuComplete from '../components/CompleteMenu';
import Toast from '../components/Toast';
import Footer from '../components/Footer';

const Menu = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <Toast />
            <main>
                <MenuComplete />
            </main>
            <Footer />
        </div>
    );
};

export default Menu;