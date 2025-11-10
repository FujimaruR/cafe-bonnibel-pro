import { useState } from 'react';
import { useCart } from '../store/cart';

export default function CheckoutComponent() {
  const { items, subtotal, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  const total = subtotal();

  const handlePay = async () => {
    try {
      setLoading(true);
      // Llamamos a la Edge Function para crear la preferencia
      const resp = await fetch('/functions/v1/mp-create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: items.map(i => ({ title: i.name, quantity: i.qty, unit_price: i.price })),
        }),
      });
      const data = await resp.json();
      if (data.init_point) {
        window.location.href = data.init_point; // redirige a Mercado Pago
      } else {
        alert('No se pudo iniciar el pago.');
      }
    } catch (e) {
      console.error(e);
      alert('Error al iniciar pago.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-28 md:pt-36 bg-beige/30 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-serif text-4xl text-cafe mb-6">Checkout</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Datos */}
          <div className="md:col-span-2 bg-crema p-5 rounded-2xl border border-beige/70 space-y-4">
            <input className="w-full border rounded-xl p-3" placeholder="Nombre completo"
              value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} />
            <input className="w-full border rounded-xl p-3" placeholder="Teléfono"
              value={form.phone} onChange={e=>setForm(f=>({...f, phone:e.target.value}))} />
            <textarea className="w-full border rounded-xl p-3" placeholder="Dirección de entrega"
              value={form.address} onChange={e=>setForm(f=>({...f, address:e.target.value}))} />
          </div>

          {/* Resumen */}
          <aside className="bg-crema p-5 rounded-2xl border border-beige/70 h-max">
            <h2 className="font-serif text-2xl text-cafe mb-4">Tu pedido</h2>
            <ul className="mb-4 space-y-2">
              {items.map(i => (
                <li key={i.name} className="flex justify-between text-cafe/80">
                  <span>{i.qty}× {i.name}</span>
                  <span>${i.qty * i.price}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-cafe font-semibold text-lg mb-6">
              <span>Total</span><span>${total}</span>
            </div>
            <button
              disabled={loading || items.length===0}
              onClick={handlePay}
              className="w-full px-4 py-3 rounded-xl bg-cafe text-crema disabled:opacity-50"
            >
              {loading ? 'Creando pago…' : 'Pagar con Mercado Pago'}
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
