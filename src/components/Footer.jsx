import { useLocale as useSiteLocale, t as tr, text as localizeText } from '../site/locale';
import config from '../data/config.json';


export default function Footer() {
  useSiteLocale();
    return (
        <footer id="contacto" className="bg-crema border-t border-beige/60">
            <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
                <div>
                    <h4 className="font-serif text-2xl text-cafe">{localizeText(config.brand)}</h4>
                    <p className="text-cafe/80 mt-2">{localizeText(config.tagline)}</p>
                </div>
                <div id="ubicacion">
                    <h5 className="font-serif text-xl text-cafe mb-2">{tr("text.7af1ffcca6")}</h5>
                    <p className="text-cafe/80">{localizeText(config.address)}</p>
                    <p className="text-cafe/80">{localizeText(config.schedule)}</p>
                    <a href={config.map} target="_blank" className="inline-block mt-3 text-cafe underline">{tr("text.e7d93450ac")}</a>
                </div>
                <div>
                    <h5 className="font-serif text-xl text-cafe mb-2">{tr("text.d8a53e1f6d")}</h5>
                    <ul className="text-cafe/80 space-y-2">
                        <li>
                            <a className="underline" href={`https://wa.me/${config.cta.whatsapp.replace(/\s|\+/g, '')}?text=${encodeURIComponent(localizeText(config.cta.waMessage))}`} target="_blank"> {tr("text.b336fc5587")} </a>
                        </li>
                        {config.social.instagram && (
                            <li><a className="underline" href={config.social.instagram} target="_blank">{tr("text.5721bbef40")}</a></li>
                        )}
                        {config.social.facebook && (
                            <li><a className="underline" href={config.social.facebook} target="_blank">{tr("text.82da67b211")}</a></li>
                        )}
                    </ul>
                </div>
            </div>
            <div className="text-center text-xs text-cafe/60 pb-6">© {new Date().getFullYear()} {localizeText(config.brand)}{tr("text.280104d516")}</div>
        </footer>
    );
}
