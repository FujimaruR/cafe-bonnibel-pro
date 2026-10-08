import { track } from '../site/analytics';
import { useLocale as useSiteLocale, t as tr, text as localizeText } from '../site/locale';
import { useCart } from '../store/cart';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CartComponent() {
  useSiteLocale();
    const { items, increase, decrease, remove, clear, subtotal } = useCart();
    const navigate = useNavigate();

    const [fulfillment, setFulfillment] = useState('delivery');

    const [loading, setLoading] = useState(false);

    // Helpers
    const formatMXN = (n) =>
        new Intl.NumberFormat(document.documentElement.lang === 'en' ? 'en-US' : 'es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 }).format(n);

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
            if (loading) return;
            track('form_start','pickup-order');
            track('form_submit_attempt','pickup-order');
            if (!items.length) { track('form_validation_error','pickup-order','validation'); return; }
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
            if (resp.ok && data?.init_point) {
                track('form_submit_success','pickup-order');
                window.location.href = data.init_point; // redirige al checkout de MP
            } else {
                alert(tr("text.9d916f441b"));
                track('form_submit_error','pickup-order','service');
            }
        } catch {
            track('form_submit_error','pickup-order','network');
            alert(tr("text.2ea49ec636"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="pt-28 md:pt-36 bg-beige/30 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-10">
                <h1 className="font-serif text-4xl text-cafe mb-6">{tr("text.a7349b7cad")}</h1>

                {items.length === 0 ? (
                    <div className="bg-crema p-6 rounded-2xl border border-beige/70">
                        <p className="text-cafe/80">{tr("text.2fb3ff8daa")}</p>
                        <button onClick={() => navigate('/menu')} className="mt-4 px-4 py-2 rounded-xl bg-cafe text-crema"> {tr("text.34d6aa1522")} </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Lista */}
                        <div className="md:col-span-2 space-y-4">
                            {items.map((p) => (
                                <div
                                    key={p.name}
                                    className="
                                        bg-crema p-4 rounded-2xl border border-beige/70
                                        grid grid-cols-[80px,1fr] gap-3 items-center
                                        md:flex md:items-center md:gap-4
                                    "
                                >
                                    {/* Imagen */}
                                    <div className="w-20 h-16 rounded-lg bg-beige/40 overflow-hidden">
                                        <div
                                            className="w-full h-full bg-cover bg-center"
                                            style={{ backgroundImage: `url(${p.img || ''})` }}
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0">
                                        <p className="text-cafe font-medium truncate md:truncate-0">{localizeText(p.name)}</p>
                                        <p className="text-cafe/70 text-sm">{formatMXN(p.price)} {tr("text.707b8df477")}</p>
                                    </div>

                                    {/* Controles */}
                                    <div className="flex items-center gap-2 col-start-2">
                                        <button onClick={() => decrease(p.name)} className="w-8 h-8 text-crema rounded border">–</button>
                                        <span className="w-8 text-center">{localizeText(p.qty)}</span>
                                        <button onClick={() => increase(p.name)} className="w-8 h-8 text-crema rounded border">+</button>
                                    </div>

                                    {/* Total (desktop) */}
                                    <div className="hidden md:block w-24 text-right font-semibold">
                                        {formatMXN(p.price * p.qty)}
                                    </div>

                                    {/* Quitar (desktop) */}
                                    <button
                                        onClick={() => remove(p.name)}
                                        className="hidden md:inline text-crema text-sm"
                                    > {tr("text.be78bcf6d4")} </button>

                                    {/* --- MÓVIL: total + quitar debajo de los controles --- */}
                                    <div className="md:hidden col-start-2 flex items-center justify-between w-full">
                                        <div className="font-semibold">{formatMXN(p.price * p.qty)}</div>
                                        <button
                                            onClick={() => remove(p.name)}
                                            className="text-crema text-sm"
                                        > {tr("text.be78bcf6d4")} </button>
                                    </div>
                                </div>

                            ))}
                            <button onClick={clear} className="text-sm text-crema"> {tr("text.4718b2bda9")} </button>
                        </div>

                        {/* Resumen */}
                        <aside className="bg-crema p-5 rounded-2xl border border-beige/70 h-max space-y-4">
                            <h2 className="font-serif text-2xl text-cafe">{tr("text.35414e5322")}</h2>

                            {/* Selector envío / pickup */}
                            <div className="space-y-2">
                                <p className="text-cafe/80 font-medium">{tr("text.62b2db5e67")}</p>

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
                                    <span className="text-cafe/80">{tr("text.fd86fa3241")}</span>
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
                                    <span className="text-cafe/80">{tr("text.65e618348b")}</span>
                                </label>

                                {fulfillment === 'pickup' && (
                                    <div className="mt-2 text-sm rounded-xl border border-beige/70 p-3 bg-beige/20">
                                        <p className="text-cafe/80"> {tr("text.e47d5b93f3")} <span className="font-medium">{tr("text.a337bd4f46")}</span>{tr("text.27b6e17400")} </p>
                                    </div>
                                )}
                            </div>

                            {/* Totales */}
                            <div className="flex justify-between text-cafe/80">
                                <span>{tr("text.97f7359ed8")}</span>
                                <span>{formatMXN(sub)}</span>
                            </div>
                            <div className="flex justify-between text-cafe/80">
                                <span>{tr("text.3bc2689ca4")}</span>
                                <span>{localizeText(fulfillment === 'pickup' ? 'No aplica' : 'Se calcula en checkout')}</span>
                            </div>
                            <div className="flex justify-between text-cafe font-semibold text-lg">
                                <span>{tr("text.b25928c699")}</span>
                                <span>{formatMXN(grandTotal)}</span>
                            </div>

                            {/* Botón principal */}
                            {fulfillment === 'pickup' ? (
                                <button
                                    onClick={handlePayNowPickup}
                                    disabled={loading || items.length === 0}
                                    className="w-full px-4 py-3 rounded-xl bg-cafe text-crema disabled:opacity-50"
                                >
                                    {localizeText(loading ? 'Creando pago…' : 'Pagar con Mercado Pago')}
                                </button>
                            ) : (
                                <button
                                    onClick={goCheckout}
                                    className="w-full px-4 py-3 rounded-xl bg-cafe text-crema"
                                > {tr("text.4da14ab3af")} </button>
                            )}
                        </aside>
                    </div>
                )}
            </div>
        </section>
    );
}
