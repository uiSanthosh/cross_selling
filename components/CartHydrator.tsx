'use client';

import { useEffect } from 'react';
import { CART_KEY, useCartStore } from '@/stores/cart-store';

// Loads the saved cart after mount (so SSR markup matches) and keeps other tabs in sync.
export function CartHydrator() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) useCartStore.persist.rehydrate();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return null;
}
