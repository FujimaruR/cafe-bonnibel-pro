import Navbar from '../components/Navbar';
import History from '../components/History';
import Calificaciones from '../components/Calificaciones';
import Galeria from '../components/Galeria';
import Footer from '../components/Footer';

const AboutUs = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <History />
                <Galeria />
                <Calificaciones />
            </main>
            <Footer />
        </div>
    );
};

export default AboutUs;