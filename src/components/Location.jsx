import { useLocale as useSiteLocale, t as tr, text as localizeText } from '../site/locale';
import config from '../data/config.json';

export default function Location() {
  useSiteLocale();
  return (
    <section className="pt-28 md:pt-36 bg-beige/20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
        <section>
          <h1 className="font-serif text-4xl text-cafe mb-4">{tr("text.7af1ffcca6")}</h1>
          <p className="text-cafe/80">{localizeText(config.address)}</p>
          <p className="text-cafe/80">{localizeText(config.schedule)}</p>
          <a href={config.map} target="_blank" className="inline-block mt-3 px-4 py-2 rounded-xl bg-cafe text-crema">{tr("text.7be0616ebd")}</a>
        </section>
        <section>
          <iframe
            title={tr("text.4a472d01a3")}
            className="w-full aspect-[4/3] rounded-2xl border border-beige/70"
            src={`https://www.google.com/maps?q=${encodeURIComponent(config.address)}&output=embed`}
            loading="lazy"
            allowFullScreen
          />
        </section>
      </div>
    </section>
  );
}
