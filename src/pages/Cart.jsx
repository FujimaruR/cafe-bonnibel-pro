import Navbar from '../components/Navbar';
import Cart from '../components/Carrito';
import Footer from '../components/Footer';

const Carrito = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <Cart />
            </main>
            <Footer />
        </div>
    );
};

export default Carrito;