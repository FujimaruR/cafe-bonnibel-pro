import menu from '../data/menu.json';
import { Link } from 'react-router-dom';

// misma función slug usada también en MenuPage
const slug = s =>
  s.toLowerCase()
   .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
   .replace(/[^a-z0-9]+/g, '-')
   .replace(/(^-|-$)/g, '');

export default function MenuGrid() {
  
  // relación sección → tab
  const map = { 0: 'calientes', 1: 'frias', 2: 'pan' };

  return (
    <section id="menu" className="py-16 md:py-20 bg-beige">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-4xl text-cafe mb-8">Nuestro menú</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {menu.sections.map((sec, si) => (
            <div key={sec.title} className="bg-crema rounded-2xl p-5 border border-beige/70 shadow-sm">
              <h3 className="font-serif text-2xl text-cafe mb-4">{sec.title}</h3>

              <ul className="space-y-3">
                {sec.items.map((it) => (
                  <li key={it.name} className="flex items-start justify-between gap-4">
                    <div>
                      {/* 👇 enlace que abre la pestaña correcta y hace scroll */}
                      <Link
                        to={`/menu?tab=${map[si]}&item=${slug(it.name)}`}
                        className="text-cafe font-medium hover:underline"
                      >
                        {it.name}
                      </Link>

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
