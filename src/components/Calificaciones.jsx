import config from '../data/config.json';

export default function Calificaciones() {
    return (
        <section id="calificaciones" className="py-20 bg-crema">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="font-serif text-4xl text-cafe mb-6">Lo que dicen nuestros clientes</h2>
                <p className="text-cafe/80 max-w-2xl mx-auto mb-10">
                    Cada café es un momento para conectar. Estas son algunas opiniones reales de nuestra comunidad.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl border border-beige/60 shadow-sm p-6 text-left">
                        <p className="text-cafe mb-3 text-lg font-semibold">★★★★★</p>
                        <p className="text-cafe/80 italic">“El mejor latte que he probado. El lugar es hermoso y tranquilo.”</p>
                        <p className="text-cafe/60 mt-3 text-sm">– Ana M.</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-beige/60 shadow-sm p-6 text-left">
                        <p className="text-cafe mb-3 text-lg font-semibold">★★★★★</p>
                        <p className="text-cafe/80 italic">“El rol de canela está increíble. Volveré cada semana.”</p>
                        <p className="text-cafe/60 mt-3 text-sm">– Carlos R.</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-beige/60 shadow-sm p-6 text-left">
                        <p className="text-cafe mb-3 text-lg font-semibold">★★★★★</p>
                        <p className="text-cafe/80 italic">“Ambiente muy bonito para estudiar o trabajar.”</p>
                        <p className="text-cafe/60 mt-3 text-sm">– Laura G.</p>
                    </div>
                </div>

                <a
                    href={config.reviews}
                    target="_blank"
                    className="inline-block mt-8 px-6 py-3 rounded-xl bg-cafe text-crema hover:opacity-95"
                >
                    Ver más reseñas en Google
                </a>
            </div>
        </section>
    );
}
