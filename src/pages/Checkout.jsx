import Navbar from '../components/Navbar';
import CheckOut from '../components/CheckOut';
import Footer from '../components/Footer';

const Check = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <CheckOut />
            </main>
            <Footer />
        </div>
    );
};

export default Check;