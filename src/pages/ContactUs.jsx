import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const ContactUs = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main>
                <Contact />
            </main>
            <Footer />
        </div>
    );
};

export default ContactUs;