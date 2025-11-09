import { useEffect, useState } from 'react';
import config from '../data/config.json';

export default function Navbar() {
  const [isTop, setIsTop] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsTop(window.scrollY < 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const waNumber = config.cta.whatsapp.replace(/\s|\+/g, '');
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(config.cta.waMessage)}`;

  const link = (href, label, onClick) => (
    <a
      href={href}
      onClick={() => { setOpen(false); onClick && onClick(); }}
      className="block px-3 py-2 rounded-xl text-cafe/80 hover:text-cafe hover:bg-beige/40"
    >
      {label}
    </a>
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all ${isTop ? 'bg-transparent' : 'bg-crema/90 backdrop-blur border-b border-beige/60'}`}>
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="font-serif text-2xl tracking-wide text-cafe">
          {config.brand}
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <a href="/About" className="px-3 py-2 rounded-xl text-cafe/80 hover:text-cafe">Sobre nosotros</a>
          <a href="/Menu" className="px-3 py-2 rounded-xl text-cafe/80 hover:text-cafe">Menú</a>
          <a href="/Location" className="px-3 py-2 rounded-xl text-cafe/80 hover:text-cafe">Ubicación</a>
          <a href="/Contact" className="px-3 py-2 rounded-xl text-cafe/80 hover:text-cafe">Contacto</a>
          <a href={waHref} target="_blank" className="px-4 py-2 rounded-xl bg-cafe text-crema hover:opacity-95">WhatsApp</a>
        </div>

        {/* Mobile trigger */}
        <button
          className="md:hidden inline-flex items-center justify-center mt-2 px-4 py-2 rounded-xl bg-cafe text-crema"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden bg-crema/95 border-t border-beige/60">
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-1">
            {link('/About', 'Sobre nosotros')}
            {link('/Menu', 'Menú')}
            {link('/Location', 'Ubicación')}
            {link('/Contact', 'Contacto')}
            <a
              href={waHref}
              target="_blank"
              className="block text-center mt-2 px-4 py-2 rounded-xl bg-cafe text-crema"
              onClick={() => setOpen(false)}
            >
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
