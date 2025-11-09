import Navbar from '../components/Navbar';
import Location from '../components/Location';
import Footer from '../components/Footer';

const OurLocation = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <Location />
            </main>
            <Footer />
        </div>
    );
};

export default OurLocation;