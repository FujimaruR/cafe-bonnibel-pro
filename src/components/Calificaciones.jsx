import { useLocale as useSiteLocale, t as tr } from '../site/locale';
import config from '../data/config.json';

export default function Calificaciones() {
  useSiteLocale();
    return (
        <section id="calificaciones" className="py-20 bg-crema">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="font-serif text-4xl text-cafe mb-6">{tr("text.ed0a9b4a99")}</h2>
                <p className="text-cafe/80 max-w-2xl mx-auto mb-10"> {tr("text.1d22c37934")} </p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl border border-beige/60 shadow-sm p-6 text-left">
                        <p className="text-cafe mb-3 text-lg font-semibold">★★★★★</p>
                        <p className="text-cafe/80 italic">{tr("text.df286f2760")}</p>
                        <p className="text-cafe/60 mt-3 text-sm">{tr("text.aa90b9c8a4")}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-beige/60 shadow-sm p-6 text-left">
                        <p className="text-cafe mb-3 text-lg font-semibold">★★★★★</p>
                        <p className="text-cafe/80 italic">{tr("text.a5c5a44874")}</p>
                        <p className="text-cafe/60 mt-3 text-sm">{tr("text.ddb44bfccc")}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-beige/60 shadow-sm p-6 text-left">
                        <p className="text-cafe mb-3 text-lg font-semibold">★★★★★</p>
                        <p className="text-cafe/80 italic">{tr("text.e86e750c5e")}</p>
                        <p className="text-cafe/60 mt-3 text-sm">{tr("text.1c2186e976")}</p>
                    </div>
                </div>

                <a
                    href={config.reviews}
                    target="_blank"
                    className="inline-block mt-8 px-6 py-3 rounded-xl bg-cafe text-crema hover:opacity-95"
                > {tr("text.5794298efb")} </a>
            </div>
        </section>
    );
}
