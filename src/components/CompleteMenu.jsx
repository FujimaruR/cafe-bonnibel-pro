import menu from '../data/menu.json';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useCart } from '../store/cart';

const tabs = [
  { key: 'calientes', label: 'Bebidas calientes', idx: 0 },
  { key: 'frias', label: 'Bebidas frías', idx: 1 },
  { key: 'pan', label: 'Panadería', idx: 2 },
];

// util para IDs amigables (usa la misma en MenuGrid)
const slug = (s) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function MenuPage() {
  const [search, setSearch] = useSearchParams();
  const location = useLocation();
  const { add } = useCart();

  // lee parámetros de la URL
  const tabParam = search.get('tab') || 'calientes';
  const itemParam = search.get('item') || '';

  // pestaña activa
  const [active, setActive] = useState(tabParam);

  // sincroniza pestaña cuando cambia la URL
  useEffect(() => {
    const valid = tabs.map(t => t.key);
    setActive(valid.includes(tabParam) ? tabParam : 'calientes');
  }, [tabParam]);

  // mapeo secciones
  const sectionsMap = useMemo(() => ({
    calientes: menu.sections[0],
    frias: menu.sections[1],
    pan: menu.sections[2],
  }), []);

  const section = sectionsMap[active];

  // scroll al item si viene ?item=...
  useEffect(() => {
    if (!itemParam) return;
    const t = setTimeout(() => {
      const el = document.getElementById(itemParam);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 0);
    return () => clearTimeout(t);
  }, [location, active, itemParam]);

  return (
    <section className="pt-28 md:pt-36 bg-beige/30 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-serif text-4xl text-cafe mb-6">Menú</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => {
                setActive(t.key);
                // Limpia ?item para que no intente re-desplazarse
                setSearch({ tab: t.key });
              }}
              className={`px-4 py-2 rounded-xl border ${active === t.key
                ? 'bg-cafe text-crema border-cafe'
                : 'border-beige/70 text-cafe/80 hover:text-cafe'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Grid (IMPORTANTE: id=slug(name) para que el scroll funcione) */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {section.items.map((it) => (
            <article
              key={it.name}
              id={slug(it.name)}
              className="bg-crema rounded-2xl p-4 border border-beige/70 shadow-sm"
            >
              <div
                className="aspect-[4/3] rounded-xl bg-cover bg-center mb-3"
                style={{ backgroundImage: `url(${it.img || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop'})` }}
              />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-cafe font-semibold">{it.name}</h3>
                  <p className="text-sm text-cafe/70">{it.desc}</p>
                </div>
                <span className="text-cafe/90 font-bold">${it.price}</span>
                <button
                  onClick={() => add(it)}
                  className="mt-3 px-3 py-1 rounded-lg bg-cafe text-crema hover:opacity-90"
                >
                  Agregar
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
