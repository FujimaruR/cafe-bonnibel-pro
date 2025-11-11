import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCart = create(persist(
  (set, get) => ({
    items: [],              // [{name, price, desc?, img?, qty}]
    lastAdded: null,        // 👈 para el toast

    add: (p) => {
      const exists = get().items.find(i => i.name === p.name);
      if (exists) {
        set({
          items: get().items.map(i => i.name === p.name ? { ...i, qty: i.qty + 1 } : i),
          lastAdded: p.name,
        });
      } else {
        set({
          items: [...get().items, { ...p, qty: 1 }],
          lastAdded: p.name,
        });
      }
      // (Opcional) vibración sutil en móvil
      if (typeof window !== 'undefined' && navigator?.vibrate) navigator.vibrate(50);
    },

    increase: (name) =>
      set({ items: get().items.map(i => i.name === name ? { ...i, qty: i.qty + 1 } : i) }),

    decrease: (name) =>
      set({ items: get().items.map(i =>
        i.name === name && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i
      ) }),

    remove:   (name) => set({ items: get().items.filter(i => i.name !== name) }),
    clear:    () => set({ items: [] }),

    clearLastAdded: () => set({ lastAdded: null }), // 👈 para que el toast no reaparezca

    subtotal: () => get().items.reduce((acc, i) => acc + i.price * i.qty, 0),
    count:    () => get().items.reduce((acc, i) => acc + i.qty, 0),
  }),
  {
    name: 'cafe-bonnibel-cart',
    // Guarda solo items en el storage; lastAdded es efímero
    partialize: (state) => ({ items: state.items }),
  }
));
