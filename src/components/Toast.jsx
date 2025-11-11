import { useEffect, useState } from 'react';
import { useCart } from '../store/cart';

export default function Toast() {
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
    return () => clearTimeout(t);
  }, [lastAdded, clearLastAdded]);

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[999] transition-all
      ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      bg-cafe text-crema px-4 py-3 rounded-xl shadow-lg`}>
      ✅ <strong>{lastAdded}</strong> agregado al carrito
    </div>
  );
}
