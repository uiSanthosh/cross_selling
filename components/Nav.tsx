'use client';

import { useEffect, useState } from 'react';
import { totals } from '@/lib/pricing';
import { useCartStore } from '@/stores/cart-store';
import { useUiStore } from '@/stores/ui-store';

export function Nav() {
  const items = useCartStore(s => s.items);
  const openCart = useUiStore(s => s.openCart);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const n = mounted ? totals(items).n : 0;

  return (
    <header className="nav">
      <a className="nav-left" href="#"><img src="/assets/f3a9f.svg" alt="" width={24} height={18} /><span>Shop all</span></a>
      <a className="nav-logo" href="#"><img src="/assets/146e4.png" alt="basil" width={106} height={36} /></a>
      <div className="nav-right">
        <button aria-label="Search"><img src="/assets/78ab3.svg" alt="" width={20} height={20} /></button>
        <button aria-label="Account"><img src="/assets/26896.svg" alt="" width={20} height={20} /></button>
        <button
          aria-label={n ? `Cart, ${n} item${n === 1 ? '' : 's'}` : 'Cart'}
          className="cart-btn"
          onClick={openCart}
        >
          <img src="/assets/3175b.svg" alt="" width={20} height={20} />
          <span key={n} className="cart-count pop" hidden={n === 0}>{n > 99 ? '99+' : n}</span>
        </button>
      </div>
    </header>
  );
}
