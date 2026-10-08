import { useLocale as useSiteLocale, t as tr } from '../site/locale';
export default function History() {
  useSiteLocale();
  return (
    <section className="pt-28 md:pt-36 bg-gradient-to-b from-crema to-beige">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl text-cafe mb-4">{tr("text.63e7cb7598")}</h1>
        <p className="text-cafe/80 text-lg leading-relaxed"> {tr("text.2660104da4")} </p>
        <p className="text-cafe/80 mt-4"> {tr("text.f811b4156f")} </p>
      </div>
    </section>
  );
}
