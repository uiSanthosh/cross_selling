import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CATALOG, type ProductId } from '@/data/catalog';
import { MAX_QTY, type CartItems } from '@/lib/pricing';
import { useUiStore } from '@/stores/ui-store';

interface CartState {
  items: CartItems;
  qty: (id: ProductId) => number;
  set: (id: ProductId, q: number) => void;
  add: (id: ProductId, q?: number) => void;
  clear: () => void;
}

export const CART_KEY = 'basil-cart-v2';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      qty: id => get().items[id] || 0,
      set: (id, q) => {
        if (!CATALOG[id]) return;
        const next = Math.max(0, Math.min(MAX_QTY, q));
        const items = { ...get().items };
        if (next) items[id] = next;
        else delete items[id];
        set({ items });
      },
      add: (id, q = 1) => {
        const cur = get().items[id] || 0;
        if (cur + q > MAX_QTY) useUiStore.getState().showToast(`Max ${MAX_QTY} per item`);
        get().set(id, cur + q);
      },
      clear: () => set({ items: {} }),
    }),
    {
      name: CART_KEY,
      storage: createJSONStorage(() => (typeof window === 'undefined' ? undefined : window.localStorage) as Storage),
      partialize: s => ({ items: s.items }),
      skipHydration: true, // rehydrated in <CartHydrator/> so server and client markup match
      merge: (persisted, current) => {
        const raw = ((persisted as { items?: Record<string, number> } | undefined)?.items) ?? {};
        const items: CartItems = {};
        Object.entries(raw).forEach(([id, q]) => {
          if (id in CATALOG && q > 0) items[id as ProductId] = Math.min(MAX_QTY, q | 0);
        });
        return { ...current, items };
      },
    },
  ),
);
