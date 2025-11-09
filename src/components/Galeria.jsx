import desayuno1 from "../img/desayuno1.png";
import desayuno2 from "../img/desayuno2.png";

export default function Galeria() {
    return (
        <section id="galeria-lugar" className="py-20 bg-beige">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="font-serif text-4xl text-cafe mb-6">Nuestro espacio</h2>
                <p className="text-cafe/75 max-w-2xl mx-auto mb-12">
                    Un ambiente cálido pensado para disfrutar café con calma. Luz suave, madera natural y mesas para conversar o estudiar.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="aspect-square rounded-xl bg-[url('https://images.unsplash.com/photo-1504754524776-8f4f37790ca0')] bg-cover bg-center" />
                    <div className="aspect-square rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${desayuno1})` }} />
                    <div className="aspect-square rounded-xl bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085')] bg-cover bg-center" />
                    <div className="aspect-square rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${desayuno2})` }} />
                </div>
            </div>
        </section>
    );
}
