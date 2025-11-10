import { useCart } from '../store/cart';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CartComponent() {
  const { items, increase, decrease, remove, clear, subtotal } = useCart();
  const navigate = useNavigate();

  const [fulfillment, setFulfillment] = useState('delivery');

  const [loading, setLoading] = useState(false);

  // Helpers
  const formatMXN = (n) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 }).format(n);

  // Totales
  const sub = subtotal();
  const shipping = fulfillment === 'pickup' ? 0 : 0; // si quieres estimar envío, cámbialo aquí
  const grandTotal = sub + shipping;

  // Para funciones en producción (Supabase Cloud)
  const FUNCTIONS_BASE =
    import.meta.env.VITE_FUNCTIONS_BASE_URL || 'https://Cafe-Bonnibel.supabase.co/functions/v1';

  const goCheckout = () => {
    navigate(`/checkout?mode=${fulfillment}`);
  };

  // MP directo si es pickup
  const handlePayNowPickup = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${FUNCTIONS_BASE}/order-create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fulfillment_mode: 'pickup',
          customer: {
            name: '', // si quieres, abre un modal para pedir nombre/teléfono
            phone: '',
            address: ''
          },
          items: items.map((i) => ({
            title: i.name,
            quantity: i.qty,
            unit_price: i.price
          })),
          back_urls_base: window.location.origin
        })
      });
      const data = await resp.json();
      if (data?.init_point) {
        window.location.href = data.init_point; // redirige al checkout de MP
      } else {
        alert('No se pudo iniciar el pago con Mercado Pago.');
        console.error('order-create response:', data);
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
        <h1 className="font-serif text-4xl text-cafe mb-6">Tu carrito</h1>

        {items.length === 0 ? (
          <div className="bg-crema p-6 rounded-2xl border border-beige/70">
            <p className="text-cafe/80">Aún no has agregado productos.</p>
            <button onClick={() => navigate('/menu')} className="mt-4 px-4 py-2 rounded-xl bg-cafe text-crema">
              Ver menú
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Lista */}
            <div className="md:col-span-2 space-y-4">
              {items.map((p) => (
                <div
                  key={p.name}
                  className="bg-crema p-4 rounded-2xl border border-beige/70 flex items-center gap-4"
                >
                  <div className="w-20 h-16 rounded-lg bg-beige/40 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${p.img || ''})` }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-cafe font-medium">{p.name}</p>
                    <p className="text-cafe/70 text-sm">{formatMXN(p.price)} c/u</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => decrease(p.name)} className="w-8 h-8 text-crema rounded border">
                      –
                    </button>
                    <span className="w-8 text-center">{p.qty}</span>
                    <button onClick={() => increase(p.name)} className="w-8 h-8 text-crema rounded border">
                      +
                    </button>
                  </div>
                  <div className="w-24 text-right font-semibold">{formatMXN(p.price * p.qty)}</div>
                  <button onClick={() => remove(p.name)} className="text-crema underline ml-2">
                    Quitar
                  </button>
                </div>
              ))}
              <button onClick={clear} className="text-sm text-crema underline">
                Vaciar carrito
              </button>
            </div>

            {/* Resumen */}
            <aside className="bg-crema p-5 rounded-2xl border border-beige/70 h-max space-y-4">
              <h2 className="font-serif text-2xl text-cafe">Resumen</h2>

              {/* Selector envío / pickup */}
              <div className="space-y-2">
                <p className="text-cafe/80 font-medium">¿Cómo lo quieres?</p>

                {/* Color del check: intentamos con Tailwind accent y dejamos fallback con style */}
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="fulfillment"
                    value="delivery"
                    checked={fulfillment === 'delivery'}
                    onChange={() => setFulfillment('delivery')}
                    className="accent-cafe"
                    style={{ accentColor: 'var(--color-cafe)' }} // fallback si 'accent-cafe' no existe
                  />
                  <span className="text-cafe/80">Envío a domicilio</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="fulfillment"
                    value="pickup"
                    checked={fulfillment === 'pickup'}
                    onChange={() => setFulfillment('pickup')}
                    className="accent-cafe"
                    style={{ accentColor: 'var(--color-cafe)' }}
                  />
                  <span className="text-cafe/80">Recoger en tienda</span>
                </label>

                {fulfillment === 'pickup' && (
                  <div className="mt-2 text-sm rounded-xl border border-beige/70 p-3 bg-beige/20">
                    <p className="text-cafe/80">
                      Recoge en: <span className="font-medium">Av. Dulce #123, Col. Encanto, Monterrey</span>. Te
                      avisaremos cuando esté listo.
                    </p>
                  </div>
                )}
              </div>

              {/* Totales */}
              <div className="flex justify-between text-cafe/80">
                <span>Subtotal</span>
                <span>{formatMXN(sub)}</span>
              </div>
              <div className="flex justify-between text-cafe/80">
                <span>Envío</span>
                <span>{fulfillment === 'pickup' ? 'No aplica' : 'Se calcula en checkout'}</span>
              </div>
              <div className="flex justify-between text-cafe font-semibold text-lg">
                <span>Total</span>
                <span>{formatMXN(grandTotal)}</span>
              </div>

              {/* Botón principal */}
              {fulfillment === 'pickup' ? (
                <button
                  onClick={handlePayNowPickup}
                  disabled={loading || items.length === 0}
                  className="w-full px-4 py-3 rounded-xl bg-cafe text-crema disabled:opacity-50"
                >
                  {loading ? 'Creando pago…' : 'Pagar con Mercado Pago'}
                </button>
              ) : (
                <button
                  onClick={goCheckout}
                  className="w-full px-4 py-3 rounded-xl bg-cafe text-crema"
                >
                  Continuar al pago
                </button>
              )}
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
