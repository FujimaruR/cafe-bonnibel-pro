import menu from '../data/menu.json';


export default function MenuGrid() {
    return (
        <section id="menu" className="py-16 md:py-20 bg-beige/40">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="font-serif text-3xl md:text-4xl text-cafe mb-8">Nuestro menú</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {menu.sections.map((sec) => (
                        <div key={sec.title} className="bg-crema rounded-2xl p-5 border border-beige/70 shadow-sm">
                            <h3 className="font-serif text-2xl text-cafe mb-4">{sec.title}</h3>
                            <ul className="space-y-3">
                                {sec.items.map((it) => (
                                    <li key={it.name} className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-cafe font-medium">{it.name}</p>
                                            <p className="text-sm text-cafe/70">{it.desc}</p>
                                        </div>
                                        <span className="text-cafe/80 font-semibold">${it.price}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}