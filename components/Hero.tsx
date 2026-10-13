'use client';

import { useEffect, useRef, useState } from 'react';
import { BUNDLES, CATALOG, GALLERY, MAIN_PRODUCT, VIBES, type BundleItem, type ProductId } from '@/data/catalog';
import { TRUST } from '@/data/content';
import { inr, inrSp, pctOff } from '@/lib/format';
import { MAX_QTY, MILESTONES, nextMilestone, selectionTotals } from '@/lib/pricing';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCartStore } from '@/stores/cart-store';
import { useUiStore } from '@/stores/ui-store';

const { unit: UNIT, unitMrp: UNIT_MRP } = MAIN_PRODUCT;

export function Hero() {
  const [img, setImg] = useState(0);
  const [vibe, setVibe] = useState(0);
  const [qty, setQty] = useState(2);
  const [added, setAdded] = useState(false);
  const [persona, setPersona] = useState(BUNDLES[0].title);
  // selection is kept per tab; each starts with its first two items picked
  const [picked, setPicked] = useState<Record<string, Set<string>>>(() =>
    Object.fromEntries(BUNDLES.map(b => [b.title, new Set(b.items.slice(0, 2).map(i => i.key))])),
  );
  const bundleDef = BUNDLES.find(b => b.title === persona) ?? BUNDLES[0];
  const selected = picked[bundleDef.title];
  const addTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(addTimer.current), []);

  const add = useCartStore(s => s.add);
  const openCart = useUiStore(s => s.openCart);

  const changeQty = (n: number) => setQty(Math.min(MAX_QTY, Math.max(1, n)));

  const itemOf = (item: BundleItem) =>
    item.cartId === null
      ? { name: `${item.name} ×${qty}`, price: UNIT * qty, mrp: UNIT_MRP * qty }
      : { name: item.name, price: CATALOG[item.cartId].price, mrp: CATALOG[item.cartId].mrp };

  const chosen = bundleDef.items.filter(i => selected.has(i.key));
  const lineOf = (i: BundleItem): [ProductId, number] => (i.cartId === null ? [VIBES[vibe].id, qty] : [i.cartId, 1]);
  const bt = selectionTotals(chosen.map(lineOf));
  const n = chosen.length;
  const next = nextMilestone(bt.sub);
  const allUnlocked = bt.sub >= MILESTONES[MILESTONES.length - 1].at;

  const toggle = (key: string) =>
    setPicked(prev => {
      const next = new Set(prev[bundleDef.title]);
      if (!next.delete(key)) next.add(key);
      return { ...prev, [bundleDef.title]: next };
    });

  const addMain = () => {
    add(VIBES[vibe].id, qty);
    setAdded(true);
    clearTimeout(addTimer.current);
    addTimer.current = setTimeout(() => setAdded(false), 1200);
    openCart();
  };

  const buyNow = () => {
    if (!n) return;
    chosen.forEach(i => add(...lineOf(i)));
    openCart();
  };

  const mainTotals = selectionTotals([[VIBES[vibe].id, qty]]);
  const ctaLabel = `${qty} box${qty > 1 ? 'es' : ''} · ${inr(mainTotals.pay)}`;

  return (
    <section className="hero">
      <div className="thumbs" role="group" aria-label="Product images">
        {GALLERY.map((g, i) => (
          <button key={g.thumb} className={i === img ? 'active' : ''} aria-pressed={i === img} onClick={() => setImg(i)}>
            <img src={g.thumb} alt={g.alt} />
          </button>
        ))}
        <div className="thumbs-fade" />
      </div>

      <div className="gallery-main"><img src={GALLERY[img].main} alt="Bento Lite Frozen" /></div>

      <div className="buybox">
        <div className="bb-head">
          <div className="pills">
            <span className="pill rating"><img src="/assets/99042.svg" alt="" width={13} height={13} />{MAIN_PRODUCT.rating}</span>
            <span className="pill new">New Arrival 🔥</span>
          </div>
          <h1>{MAIN_PRODUCT.title}</h1>
          <p className="sub">{MAIN_PRODUCT.subtitle}</p>
          <div className="price-row">
            <span className="price">{inrSp(UNIT)}</span>
            <span className="mrp">MRP{inrSp(UNIT_MRP)}</span>
            <span className="off">{pctOff(UNIT_MRP, UNIT)}% off</span>
          </div>
          <p className="tax">Inc. all taxes</p>
        </div>

        <div className="vibe">
          <p>Choose your Vibe : <b>{VIBES[vibe].name}</b></p>
          <div className="swatches">
            {VIBES.map((v, i) => (
              <button key={v.name} className={`swatch${i === vibe ? ' active' : ''}`} aria-label={v.name} aria-pressed={i === vibe} onClick={() => setVibe(i)}>
                <img src={v.swatch} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="buy-row">
          <div className="qty">
            <button aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => changeQty(qty - 1)}>-</button>
            <span>{qty}</span>
            <button aria-label="Increase quantity" disabled={qty >= MAX_QTY} onClick={() => changeQty(qty + 1)}>+</button>
          </div>
          <button className="add-btn" disabled={added} onClick={addMain}>{added ? 'Added ✓' : ctaLabel}</button>
        </div>

        <div className="bundle">
          <div className="bundle-top">
            <h2>Pack the morning, not just the box</h2>
            <div className="progress">
              <span>{n} / 3 essentials</span>
              <div className="bar"><i style={{ width: `${(n / 3) * 100}%` }} /></div>
            </div>
          </div>

          <Tabs value={persona} onValueChange={setPersona}>
            <TabsList className="tabs3">
              {BUNDLES.map(t => (
                <TabsTrigger key={t.title} value={t.title}>
                  <b>{t.title}</b><small>{t.sub}</small>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="cards3">
            {bundleDef.items.map(e => {
              const on = selected.has(e.key);
              const it = itemOf(e);
              return (
                <div
                  key={`${bundleDef.title}-${e.key}`}
                  className={`mini${on ? ' selected' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  onClick={() => toggle(e.key)}
                  onKeyDown={ev => {
                    if (ev.key !== 'Enter' && ev.key !== ' ') return;
                    ev.preventDefault();
                    toggle(e.key);
                  }}
                >
                  <div className="mini-img">
                    <img className={e.imgClass} src={e.img} alt="" />
                    <img className="chk" src="/assets/5f154.svg" alt="" width={24} height={24} />
                    <span className="addtag">Add</span>
                  </div>
                  <p className="mini-name">{it.name}</p>
                  <div className="mini-price">
                    <span>
                      <b className={e.key.startsWith('dip') ? 'orange' : undefined}>{e.cartId === null ? inr(it.price) : inrSp(it.price)}</b>
                      <s>MRP{inrSp(it.mrp)}</s>
                    </span>
                    <em>{pctOff(it.mrp, it.price)}%off</em>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="bundle-note" role="status" aria-live="polite" hidden={n !== 0}>
            {n === 0 ? 'Nothing selected. Add an item above, or use the main button to buy the lunchbox on its own.' : ''}
          </p>

          <div className="bundle-total">
            <div>
              <div className="big">{inr(bt.pay)}</div>
              <div className="save">
                <b>You save <span>{inr(bt.save)}</span></b>{' '}
                <small><s>vs.MRP</s> <strong>{inr(bt.mrp)}</strong></small>
              </div>
            </div>
            <span className={`unlock${allUnlocked ? ' done' : ''}`}>
              <img src="/assets/857a2.svg" alt="" width={18} height={18} />
              <span>
                {n === 0
                  ? 'Pick items to start saving'
                  : next
                    ? `Add ${inr(next.at - bt.sub)} more → ${next.off ? `Unlock ${inr(next.off)} OFF` : 'Unlock Free Shipping'}`
                    : `${inr(MILESTONES[MILESTONES.length - 1].off)} OFF unlocked`}
              </span>
            </span>
          </div>

          <button className="buy-now" disabled={n === 0} onClick={buyNow}>
            {n === 0 ? 'Select at least one item' : `Buy Now · ${inr(bt.pay)}`}
          </button>

          <ul className="trust">
            {TRUST.map(t => (
              <li key={t.text}>
                <img src={t.img} alt="" width={t.w} height={t.h} className={t.cls} />
                <span>{t.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
