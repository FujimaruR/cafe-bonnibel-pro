import beans from '../assets/beans.svg';
import config from '../data/config.json';


export default function Hero() {
    return (
        <section className="pt-28 md:pt-36 bg-gradient-to-b from-crema to-beige">
            <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h1 className="font-serif text-5xl md:text-6xl text-cafe leading-tight">
                        {config.brand}
                    </h1>
                    <p className="mt-4 text-cafe/80 text-lg md:text-xl max-w-prose">
                        {config.tagline}
                    </p>
                    <div className="mt-6 flex gap-3">
                        <a href="#menu" className="px-5 py-3 rounded-xl bg-cafe text-crema">Ver menú</a>
                        <a href="#ubicacion" className="px-5 py-3 rounded-xl border border-cafe/30 text-cafe">Cómo llegar</a>
                    </div>
                    <p className="mt-6 text-sm text-cafe/70">
                        {config.schedule} · {config.address}
                    </p>
                </div>
                <div className="relative">
                    <div className="aspect-[4/3] rounded-3xl bg-[url('https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center shadow-xl" />
                    <div className="absolute -bottom-5 -left-5 bg-crema rounded-2xl shadow p-4 flex items-center gap-3 border border-beige/70">
                        <img src={beans} alt="beans" className="w-6 h-6 text-cafe" />
                        <span className="font-serif text-cafe">Tostado de la casa</span>
                    </div>
                </div>
            </div>
        </section>
    );
}