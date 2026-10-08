import { useLocale as useSiteLocale, money as formatMoney, t as tr, text as localizeText } from '../site/locale';
import { track } from '../site/analytics';
import { useState } from 'react';
import { useCart } from '../store/cart';

export default function CheckoutComponent() {
  useSiteLocale();
  const { items, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  const total = subtotal();

  const handlePay = async () => {
    try {
      if (loading) return;
      track('form_submit_attempt', 'checkout');
      if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !items.length) {
        track('form_validation_error', 'checkout', 'validation');
        alert(tr("text.138c498c33"));
        return;
      }
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
      if (resp.ok && data.init_point) {
        track('form_submit_success', 'checkout');
        window.location.href = data.init_point; // redirige a Mercado Pago
      } else {
        track('form_submit_error', 'checkout', 'service');
        alert(tr("text.fe6a1586a5"));
      }
    } catch {
      track('form_submit_error', 'checkout', 'network');
      alert(tr("text.2ea49ec636"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section onChangeCapture={() => track('form_start', 'checkout')} className="pt-28 md:pt-36 bg-beige/30 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-serif text-4xl text-cafe mb-6">{tr("text.3ac8e9e58c")}</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Datos */}
          <div className="md:col-span-2 bg-crema p-5 rounded-2xl border border-beige/70 space-y-4">
            <input className="w-full border rounded-xl p-3" aria-label={tr("text.cccece8229")} placeholder={tr("text.cccece8229")}
              value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} />
            <input className="w-full border rounded-xl p-3" aria-label={tr("text.99af3763e0")} placeholder={tr("text.99af3763e0")}
              value={form.phone} onChange={e=>setForm(f=>({...f, phone:e.target.value}))} />
            <textarea className="w-full border rounded-xl p-3" aria-label={tr("text.2bc457c422")} placeholder={tr("text.2bc457c422")}
              value={form.address} onChange={e=>setForm(f=>({...f, address:e.target.value}))} />
          </div>

          {/* Resumen */}
          <aside className="bg-crema p-5 rounded-2xl border border-beige/70 h-max">
            <h2 className="font-serif text-2xl text-cafe mb-4">{tr("text.702c673606")}</h2>
            <ul className="mb-4 space-y-2">
              {items.map(i => (
                <li key={i.name} className="flex justify-between text-cafe/80">
                  <span>{localizeText(i.qty)}× {localizeText(i.name)}</span>
                  <span>{formatMoney(i.qty * i.price)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-cafe font-semibold text-lg mb-6">
              <span>{tr("text.b25928c699")}</span><span>{formatMoney(total)}</span>
            </div>
            <button
              disabled={loading || items.length===0}
              onClick={handlePay}
              className="w-full px-4 py-3 rounded-xl bg-cafe text-crema disabled:opacity-50"
            >
              {localizeText(loading ? 'Creando pago…' : 'Pagar con Mercado Pago')}
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
