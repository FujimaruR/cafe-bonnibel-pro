import { useLocale as useSiteLocale, t as tr, text as localizeText } from '../site/locale';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '../data/config.json';
import { useCart } from '../store/cart';

export default function Navbar() {
  useSiteLocale();
  const [isTop, setIsTop] = useState(true);
  const [open, setOpen] = useState(false);
  const count = useCart(s => s.count());

  const navigate = useNavigate();

  const handleAbout = () => {
    navigate('/About');
  };

  const handleMenu = () => {
    navigate('/Menu');
  };

  const handleLocation = () => {
    navigate('/Location');
  };

  const handleContact = () => {
    navigate('/Contact');
  };

  useEffect(() => {
    const onScroll = () => setIsTop(window.scrollY < 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const waNumber = config.cta.whatsapp.replace(/\s|\+/g, '');
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(localizeText(config.cta.waMessage))}`;

  const link = (label, onClick) => (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); setOpen(false); onClick && onClick(); }}
      className="block px-3 py-2 rounded-xl text-cafe/80 hover:text-cafe hover:bg-beige/40"
    >
      {localizeText(label)}
    </a>
  );


  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all ${isTop ? 'bg-transparent' : 'bg-crema/90 backdrop-blur border-b border-beige/60'}`}>
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl tracking-wide cursor-pointer text-cafe">
          {localizeText(config.brand)}
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/About" className="px-3 py-2 rounded-xl text-cafe/80 cursor-pointer hover:text-cafe">{tr("text.f4d4e9f64b")}</Link>
          <Link to="/Menu" className="px-3 py-2 rounded-xl text-cafe/80 cursor-pointer hover:text-cafe">{tr("text.17ea0a188c")}</Link>
          <Link to="/Location" className="px-3 py-2 rounded-xl text-cafe/80 cursor-pointer hover:text-cafe">{tr("text.7af1ffcca6")}</Link>
          <Link to="/Contact" className="px-3 py-2 rounded-xl text-cafe/80 cursor-pointer hover:text-cafe">{tr("text.d8a53e1f6d")}</Link>
          <Link to="/Cart" onClick={() => setOpen(false)} aria-label={tr('cart.open', { count })} className="relative px-3 py-2 rounded-xl border border-beige/60 cursor-pointer hover:border-cafe/40">
            🛍
            {count > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-cafe text-crema rounded-full px-2 py-0.5">
                {localizeText(count)}
              </span>
            )}
          </Link>
          <a href={waHref} target="_blank" className="px-4 py-2 rounded-xl bg-cafe text-crema hover:opacity-95">{tr("text.b336fc5587")}</a>
        </div>

        {/* Mobile trigger */}
        <button
          className="md:hidden inline-flex items-center justify-center mt-2 px-4 py-2 rounded-xl bg-cafe text-crema"
          aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}
          aria-label={tr("text.256a5c2ab3")}
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div id="mobile-navigation" className="md:hidden bg-crema/95 border-t border-beige/60">
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-1">
            {link('Sobre nosotros', handleAbout)}
            {link('Menú', handleMenu)}
            {link('Ubicación', handleLocation)}
            {link('Contacto', handleContact)}
            <Link to="/Cart" onClick={() => setOpen(false)} aria-label={tr('cart.open', { count })} className="relative px-3 py-2 rounded-xl border border-beige/60 cursor-pointer hover:border-cafe/40">
              🛍
              {count > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-cafe text-crema rounded-full px-2 py-0.5">
                  {localizeText(count)}
                </span>
              )}
            </Link>
            <a
              href={waHref}
              target="_blank"
              className="block text-center mt-2 px-4 py-2 rounded-xl bg-cafe text-crema"
              onClick={() => setOpen(false)}
            > {tr("text.65748a7f83")} </a>
          </div>
        </div>
      )}
    </header>
  );
}
