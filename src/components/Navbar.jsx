import { useEffect, useState } from 'react';
import config from '../data/config.json';


export default function Navbar() {
    const [isTop, setIsTop] = useState(true);
    useEffect(() => {
        const onScroll = () => setIsTop(window.scrollY < 12);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);


    const waNumber = config.cta.whatsapp.replace(/\s|\+/g, '');
    const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(config.cta.waMessage)}`;


    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all ${isTop ? 'bg-transparent' : 'bg-crema/90 backdrop-blur border-b border-beige/60'}`}>
            <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <a href="#" className="font-serif text-2xl tracking-wide text-cafe">
                    {config.brand}
                </a>
                <div className="hidden md:flex items-center gap-6 text-cafe/80">
                    <a href="#menu" className="hover:text-cafe">Menú</a>
                    <a href="#ubicacion" className="hover:text-cafe">Ubicación</a>
                    <a href="#contacto" className="hover:text-cafe">Contacto</a>
                    <a href={waHref} target="_blank" className="px-4 py-2 rounded-xl bg-cafe text-crema hover:opacity-95">Pedir por WhatsApp</a>
                </div>
            </nav>
        </header>
    );
}