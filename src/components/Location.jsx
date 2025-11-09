import config from '../data/config.json';

export default function Location() {
  return (
    <section className="pt-28 md:pt-36 bg-beige/20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
        <section>
          <h1 className="font-serif text-4xl text-cafe mb-4">Ubicación</h1>
          <p className="text-cafe/80">{config.address}</p>
          <p className="text-cafe/80">{config.schedule}</p>
          <a href={config.map} target="_blank" className="inline-block mt-3 px-4 py-2 rounded-xl bg-cafe text-crema">Abrir en Google Maps</a>
        </section>
        <section>
          <iframe
            title="mapa"
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
