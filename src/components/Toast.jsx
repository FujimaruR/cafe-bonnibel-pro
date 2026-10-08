import { useLocale as useSiteLocale, t as tr, text as localizeText } from '../site/locale';
import { useEffect, useState } from 'react';
import { useCart } from '../store/cart';

export default function Toast() {
  useSiteLocale();
  const lastAdded = useCart(s => s.lastAdded);
  const clearLastAdded = useCart(s => s.clearLastAdded);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastAdded) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      clearLastAdded();
    }, 1500);
    if (!lastAdded) return null;
  return () => clearTimeout(t);
  }, [lastAdded, clearLastAdded]);

  return (
    <div role="status" aria-live="polite" aria-hidden={!visible} className={`pointer-events-none fixed top-4 left-1/2 -translate-x-1/2 z-[999] transition-all
      ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      bg-cafe text-crema px-4 py-3 rounded-xl shadow-lg`}>
      ✅ <strong>{localizeText(lastAdded)}</strong> {tr("text.3ea17eaef1")} </div>
  );
}
