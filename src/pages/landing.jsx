import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MenuGrid from '../components/MenuGrid';
import Footer from '../components/Footer';

const Landing = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <Hero />
                <MenuGrid />
            </main>
            <Footer />
        </div>
    );
};

export default Landing;