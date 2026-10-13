'use client';

import { useEffect, useRef, useState } from 'react';
import { CATALOG, EXPLORE, type ProductId } from '@/data/catalog';
import { pctOff } from '@/lib/format';
import { MAX_QTY } from '@/lib/pricing';
import { useCartStore } from '@/stores/cart-store';
import { useUiStore } from '@/stores/ui-store';

// States: default "Add to Cart" | adding (shimmer) | in cart with - qty + stepper
//         (qty 1 and "-" removes it) | max reached (+ disabled, hint shown)
function AddToCart({ id, name }: { id: ProductId; name: string }) {
  const n = useCartStore(s => s.items[id] || 0);
  const add = useCartStore(s => s.add);
  const set = useCartStore(s => s.set);
  const { showToast, openCart } = useUiStore.getState();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const addRef = useRef<HTMLButtonElement>(null);
  const plusRef = useRef<HTMLButtonElement>(null);
  const focusNext = useRef<'plus' | 'add' | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => setMounted(true), []);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    // move focus to the control that replaced the one just used
    if (focusNext.current === 'plus') plusRef.current?.focus();
    if (focusNext.current === 'add') addRef.current?.focus();
    focusNext.current = null;
  }, [n]);

  const qty = mounted ? n : 0;

  const onAdd = () => {
    if (loading) return;
    setLoading(true);
    timer.current = setTimeout(() => {
      // short fake latency so the adding state is visible
      setLoading(false);
      focusNext.current = 'plus';
      add(id);
      showToast(`${name} added to cart`, { label: 'View cart', fn: openCart });
    }, 450);
  };

  const onMinus = () => {
    set(id, n - 1);
    if (n - 1 <= 0) {
      focusNext.current = 'add';
      showToast(`${name} removed from cart`);
    }
  };

  return (
    <div className={`atc-area${qty > 0 ? ' in-cart' : ''}`}>
      <button ref={addRef} className={`atc${loading ? ' loading' : ''}`} type="button" hidden={qty > 0} onClick={onAdd}>
        {loading ? 'Adding…' : 'Add to Cart'}
      </button>
      <div className="stepper" hidden={qty === 0}>
        <button type="button" className="st-minus" aria-label={`Remove one ${name}`} onClick={onMinus}>−</button>
        <span className="st-qty" aria-live="polite">{qty}</span>
        <button ref={plusRef} type="button" className="st-plus" aria-label={`Add one more ${name}`} disabled={qty >= MAX_QTY} onClick={() => add(id)}>+</button>
      </div>
      <p className="st-hint" hidden={qty < MAX_QTY}>Max {MAX_QTY} per order</p>
    </div>
  );
}

export function Explore() {
  return (
    <section className="explore">
      <h2 className="sec-title">Explore More</h2>
      <div className="prod-grid">
        {EXPLORE.map(e => {
          const p = CATALOG[e.id];
          const rating = (
            <span className="pill rate"><img src="/assets/2bc4c.svg" alt="" width={9} height={9} />{e.rating}</span>
          );
          return (
            <article key={e.id} className="pcard">
              <div className="pimg"><img src={e.img} alt="" /></div>
              <div className="pbody">
                {e.launch ? <div className="pillrow">{rating}<span className="pill launch">New Launch</span></div> : rating}
                <h3>{p.name}</h3>
                <p>{e.description}</p>
                <div className="pp"><b>₹ {p.price}</b><s>MRP₹ {p.mrp}</s><em>{pctOff(p.mrp, p.price)}% off</em></div>
                <AddToCart id={e.id} name={p.name} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
