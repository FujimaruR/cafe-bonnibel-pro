import { useCart } from '../store/cart';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { items, increase, decrease, remove, clear, subtotal } = useCart();
  const navigate = useNavigate();

  const total = subtotal();

  return (
    <section className="pt-28 md:pt-36 bg-beige/30 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-serif text-4xl text-cafe mb-6">Tu carrito</h1>

        {items.length === 0 ? (
          <div className="bg-crema p-6 rounded-2xl border border-beige/70">
            <p className="text-cafe/80">Aún no has agregado productos.</p>
            <button onClick={() => navigate('/menu')} className="mt-4 px-4 py-2 rounded-xl bg-cafe text-crema">Ver menú</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Lista */}
            <div className="md:col-span-2 space-y-4">
              {items.map(p => (
                <div key={p.name} className="bg-crema p-4 rounded-2xl border border-beige/70 flex items-center gap-4">
                  <div className="w-20 h-16 rounded-lg bg-beige/40 overflow-hidden">
                    {/* si tuviera p.img */}
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${p.img || ''})`}}/>
                  </div>
                  <div className="flex-1">
                    <p className="text-cafe font-medium">{p.name}</p>
                    <p className="text-cafe/70 text-sm">${p.price} c/u</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => decrease(p.name)} className="w-8 h-8 rounded border">-</button>
                    <span className="w-8 text-center">{p.qty}</span>
                    <button onClick={() => increase(p.name)} className="w-8 h-8 rounded border">+</button>
                  </div>
                  <div className="w-20 text-right font-semibold">${p.price * p.qty}</div>
                  <button onClick={() => remove(p.name)} className="text-cafe/70 underline ml-2">Quitar</button>
                </div>
              ))}
              <button onClick={clear} className="text-sm text-cafe/70 underline">Vaciar carrito</button>
            </div>

            {/* Resumen */}
            <aside className="bg-crema p-5 rounded-2xl border border-beige/70 h-max">
              <h2 className="font-serif text-2xl text-cafe mb-4">Resumen</h2>
              <div className="flex justify-between text-cafe/80 mb-2">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              <div className="flex justify-between text-cafe/80 mb-4">
                <span>Envío</span>
                <span>Se calcula en checkout</span>
              </div>
              <div className="flex justify-between text-cafe font-semibold text-lg mb-6">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full px-4 py-3 rounded-xl bg-cafe text-crema"
              >
                Continuar al pago
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
