import config from '../data/config.json';

export default function Contact() {
  const waNumber = config.cta.whatsapp.replace(/\s|\+/g, '');
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(config.cta.waMessage)}`;

  return (
    <section className="pt-28 md:pt-36 bg-beige/20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl text-cafe mb-6">Contacto</h1>
        <form className="bg-crema p-6 rounded-2xl border border-beige/70 grid gap-4">
          <div>
            <label className="block text-sm text-cafe/70 mb-1">Nombre</label>
            <input type="text" className="w-full rounded-xl border border-beige/70 px-3 py-2 bg-white" placeholder="Tu nombre" />
          </div>
          <div>
            <label className="block text-sm text-cafe/70 mb-1">Correo</label>
            <input type="email" className="w-full rounded-xl border border-beige/70 px-3 py-2 bg-white" placeholder="tunombre@email.com" />
          </div>
          <div>
            <label className="block text-sm text-cafe/70 mb-1">Mensaje</label>
            <textarea className="w-full rounded-xl border border-beige/70 px-3 py-2 bg-white" rows="5" placeholder="¿Cómo podemos ayudarte?" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={()=>window.open(waHref,'_blank')} className="px-4 py-2 rounded-xl bg-cafe text-crema">Enviar por WhatsApp</button>
            <button type="submit" className="px-4 py-2 rounded-xl border border-cafe/30">Enviar (demo)</button>
          </div>
          <p className="text-xs text-cafe/60">*Este formulario es de demostración. Podemos conectarlo a correo o a una función serverless si lo requieres.</p>
        </form>
      </div>
    </section>
  );
}
