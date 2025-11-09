import Navbar from '../components/Navbar';
import MenuComplete from '../components/CompleteMenu';
import Footer from '../components/Footer';

const Menu = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <MenuComplete />
            </main>
            <Footer />
        </div>
    );
};

export default Menu;