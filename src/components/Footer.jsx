import config from '../data/config.json';


export default function Footer() {
    return (
        <footer id="contacto" className="bg-crema border-t border-beige/60">
            <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
                <div>
                    <h4 className="font-serif text-2xl text-cafe">{config.brand}</h4>
                    <p className="text-cafe/80 mt-2">{config.tagline}</p>
                </div>
                <div id="ubicacion">
                    <h5 className="font-serif text-xl text-cafe mb-2">Ubicación</h5>
                    <p className="text-cafe/80">{config.address}</p>
                    <p className="text-cafe/80">{config.schedule}</p>
                    <a href={config.map} target="_blank" className="inline-block mt-3 text-cafe underline">Ver en Google Maps</a>
                </div>
                <div>
                    <h5 className="font-serif text-xl text-cafe mb-2">Contacto</h5>
                    <ul className="text-cafe/80 space-y-2">
                        <li>
                            <a className="underline" href={`https://wa.me/${config.cta.whatsapp.replace(/\s|\+/g, '')}?text=${encodeURIComponent(config.cta.waMessage)}`} target="_blank">
                                WhatsApp
                            </a>
                        </li>
                        {config.social.instagram && (
                            <li><a className="underline" href={config.social.instagram} target="_blank">Instagram</a></li>
                        )}
                        {config.social.facebook && (
                            <li><a className="underline" href={config.social.facebook} target="_blank">Facebook</a></li>
                        )}
                    </ul>
                </div>
            </div>
            <div className="text-center text-xs text-cafe/60 pb-6">© {new Date().getFullYear()} {config.brand}. Hecho con amor y buen café.</div>
        </footer>
    );
}