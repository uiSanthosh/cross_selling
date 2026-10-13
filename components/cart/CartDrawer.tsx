'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Check, ChevronDown, Percent, Tag, Trash2, Truck, X } from 'lucide-react';
import { CATALOG, STRIP, type ProductId } from '@/data/catalog';
import { inr, inr2, pctOff } from '@/lib/format';
import { MAX_QTY, MILESTONES, totals, type CartLine, type Totals } from '@/lib/pricing';
import { confetti } from '@/lib/confetti';
import { useCartStore } from '@/stores/cart-store';
import { useUiStore } from '@/stores/ui-store';
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from '@/components/ui/dialog';

type CheckoutState = 'idle' | 'loading' | 'done';

const MILESTONE_ICON = {
  truck: <Truck size={14} strokeWidth={1.4} />,
  pct: <Percent size={14} strokeWidth={1.6} />,
};

function Receipt() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="1" width="18" height="22" rx="3" fill="currentColor" />
      <text x="12" y="16.5" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="system-ui">₹</text>
    </svg>
  );
}

function Progress({ t }: { t: Totals }) {
  const last = MILESTONES.length - 1;
  const seg = 100 / MILESTONES.length;
  // fill runs 0 -> first milestone -> second -> third, each a third of the rail
  let pct = 100;
  const i = MILESTONES.findIndex(m => t.sub < m.at);
  if (i !== -1) {
    const lo = i === 0 ? 0 : MILESTONES[i - 1].at;
    pct = (i + (t.sub - lo) / (MILESTONES[i].at - lo)) * seg;
  }
  const next = MILESTONES[i];
  const msg = !next
    ? `You have unlocked ${inr(MILESTONES[last].off)} OFF!`
    : `Add items worth ${inr(next.at - t.sub)} more to unlock ${next.off ? inr(next.off) + ' off' : 'free shipping'}`;
  return (
    <div className="cart-progress">
      <p className="cp-msg" role="status">{msg}</p>
      <div className="cp-rail" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label="Savings milestones">
        <i style={{ width: `${pct}%` }} />
        {MILESTONES.map((m, k) => (
          <div key={m.at} className={`cp-step${t.sub >= m.at ? ' on' : ''}`} style={{ left: `${(k + 1) * seg}%` }}>
            <span className="cp-goal">{inr(m.at)}</span>
            <span className="cp-ico">{MILESTONE_ICON[m.icon]}</span>
            <span className="cp-lab">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// typing a quantity directly; committed on blur / Enter
function QtyInput({ id, q, label }: { id: ProductId; q: number; label: string }) {
  const set = useCartStore(s => s.set);
  const showToast = useUiStore(s => s.showToast);
  const [draft, setDraft] = useState(String(q));
  useEffect(() => setDraft(String(q)), [q]);

  const commit = () => {
    const v = parseInt(draft, 10);
    if (!(v >= 1)) return setDraft(String(q)); // empty/0/NaN: keep current
    if (v > MAX_QTY) showToast(`Max ${MAX_QTY} per item`);
    set(id, Math.min(MAX_QTY, v));
    setDraft(String(Math.min(MAX_QTY, v)));
  };

  return (
    <input
      className="qh-in"
      type="number"
      min={1}
      max={MAX_QTY}
      step={1}
      inputMode="numeric"
      value={draft}
      aria-label={`Quantity of ${label}`}
      onChange={e => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    />
  );
}

function Line({ l, t }: { l: CartLine; t: Totals }) {
  const p = CATALOG[l.id];
  const { set } = useCartStore.getState();
  const showToast = useUiStore(s => s.showToast);
  const dec = () => set(l.id, l.q - 1);
  const inc = () => useCartStore.getState().add(l.id, 1);
  const del = () => {
    const prev = l.q;
    set(l.id, 0);
    showToast(`${p.short} removed`, { label: 'Undo', fn: () => useCartStore.getState().set(l.id, prev) });
  };
  return (
    <li className="cl">
      <img src={p.img} alt="" />
      <div className="cl-main">
        <div className="cl-row">
          <div className="cl-info">
            <p className="cl-name">{p.name}</p>
            <span className="chip">No Personalisation</span>
          </div>
          <div className="cl-price">
            <s>{inr2(l.mrp)}</s><b>{inr2(l.final)}</b><span>({pctOff(l.mrp, l.final)}% OFF)</span>
            {l.alloc ? <em className="cl-coupon"><Tag size={12} strokeWidth={1.6} /> SPARK{t.off}</em> : null}
          </div>
        </div>
        <div className="cl-ctl">
          <div className="qh">
            <button aria-label={`Decrease quantity of ${p.short}`} disabled={l.q <= 1} onClick={dec}>−</button>
            <QtyInput id={l.id} q={l.q} label={p.short} />
            <button aria-label={`Increase quantity of ${p.short}`} disabled={l.q >= MAX_QTY} onClick={inc}>+</button>
          </div>
          <button className="cl-del" aria-label={`Remove ${p.short}`} onClick={del}>
            <Trash2 size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </li>
  );
}

function Upsell({ id }: { id: ProductId }) {
  const p = CATALOG[id];
  const q = useCartStore(s => s.items[id] || 0);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const on = q > 0;

  const addFirst = () => {
    if (loading) return;
    setLoading(true); // same default -> adding -> stepper flow as the page cards
    timer.current = setTimeout(() => {
      setLoading(false);
      useCartStore.getState().add(id, 1);
    }, 450);
  };
  const dec = () => {
    useCartStore.getState().set(id, q - 1);
    if (q - 1 <= 0) useUiStore.getState().showToast(`${p.short} removed from cart`);
  };

  return (
    <div className={`up${on ? ' on' : ''}`}>
      <div className="up-img">
        <img src={p.img} alt="" />
        {on && <span className="up-chk"><Check size={14} strokeWidth={2.4} /></span>}
      </div>
      <p className="up-name">{p.short}</p>
      <p className="up-price"><b className={id === 'dip' ? 'orange' : undefined}>{inr2(p.price).replace('.00', '')}</b><s>MRP{inr(p.mrp)}</s></p>
      <span className="up-off">{pctOff(p.mrp, p.price)}%OFF</span>
      <div className="up-ctl">
        {on ? (
          <>
            <div className="up-step">
              <button aria-label={`${q > 1 ? 'Remove one' : 'Remove'} ${p.short}`} onClick={dec}>−</button>
              <span aria-live="polite">{q}</span>
              <button aria-label={`Add one more ${p.short}`} disabled={q >= MAX_QTY} onClick={() => useCartStore.getState().add(id, 1)}>+</button>
            </div>
            {q >= MAX_QTY && <p className="up-hint">Max {MAX_QTY} per order</p>}
          </>
        ) : (
          <button className={`up-atc${loading ? ' loading' : ''}`} onClick={addFirst}>{loading ? 'Adding…' : 'Add to Cart'}</button>
        )}
      </div>
    </div>
  );
}

function UpsellStrip() {
  return (
    <section className="cart-up">
      <h3>Pack the morning, not just the box</h3>
      <div className="up-row">{STRIP.map(id => <Upsell key={id} id={id} />)}</div>
    </section>
  );
}

function Summary({ t }: { t: Totals }) {
  return (
    <div className="bd" id="orderSummary">
      <div className="bd-head"><b>Order Summary</b><span>{inr2(t.save)} saved so far</span></div>
      <div className="bd-row"><span>MRP total</span><span>{inr2(t.mrp)}</span></div>
      <div className="bd-row g"><span>Discount on MRP</span><span>{inr2(t.mrp - t.sub)}</span></div>
      <div className="bd-row"><span>Cart Subtotal</span><span>{inr2(t.sub)}</span></div>
      <div className="bd-row g"><span>Total discount</span><span>{inr2(t.off)}</span></div>
      <div className="bd-row"><span>Shipping Charges</span><span className={t.shipping ? '' : 'g'}>{t.shipping ? inr2(t.shipping) : 'FREE'}</span></div>
      <div className="bd-row g"><span>Total savings</span><span>{inr2(t.save)}</span></div>
      <div className="bd-total"><span>Estimated Total</span><span>{inr2(t.pay)}</span></div>
    </div>
  );
}

export function CartDrawer() {
  const open = useUiStore(s => s.cartOpen);
  const setOpen = useUiStore(s => s.setCartOpen);
  const closeCart = useUiStore(s => s.closeCart);
  const items = useCartStore(s => s.items);
  const clear = useCartStore(s => s.clear);
  const t = totals(items);
  const nonStrip = t.lines.filter(l => !STRIP.includes(l.id));

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutState>('idle');
  const canvas = useRef<HTMLCanvasElement>(null);
  const shownTier = useRef<number | null>(null);
  const wasOpen = useRef(false);
  const checkoutTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(checkoutTimer.current), []);

  // celebrate a newly unlocked milestone (only while the drawer was already visible)
  useEffect(() => {
    if (shownTier.current !== null && t.tier > shownTier.current && wasOpen.current) confetti(canvas.current);
    shownTier.current = t.tier;
  }, [t.tier]);
  useEffect(() => {
    wasOpen.current = open;
  });

  useEffect(() => {
    if (detailsOpen) document.getElementById('orderSummary')?.scrollIntoView({ block: 'nearest' });
  }, [detailsOpen]);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next && checkout === 'done') setCheckout('idle');
  };

  const placeOrder = () => {
    setCheckout('loading');
    checkoutTimer.current = setTimeout(() => {
      clear();
      setCheckout('done');
    }, 1100);
  };

  const done = checkout === 'done';

  return (
    <MotionConfig reducedMotion="user">
      <Dialog open={open} onOpenChange={onOpenChange}>
        <AnimatePresence>
          {open && (
            <DialogPortal forceMount>
              <DialogOverlay asChild forceMount>
                <motion.div className="cart-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
              </DialogOverlay>
              <DialogContent
                asChild
                forceMount
                aria-describedby={undefined}
                // the toast (with its Undo / View cart button) lives outside the dialog
                onPointerDownOutside={e => (e.target as Element).closest('.toast') && e.preventDefault()}
                onFocusOutside={e => (e.target as Element).closest('.toast') && e.preventDefault()}
              >
                <motion.aside
                  className="cart"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                >
                  <canvas ref={canvas} className="cart-confetti" aria-hidden="true" />
                  <header className="cart-head">
                    <DialogTitle asChild><h2>Your Cart ({t.n} item{t.n === 1 ? '' : 's'})</h2></DialogTitle>
                    <button className="cart-x" aria-label="Close cart" onClick={closeCart}><X size={20} strokeWidth={2.2} /></button>
                  </header>
                  <div className="cart-banner">Free shipping above 499 | 10 Days Return* 🎊</div>
                  <div className="cart-scroll">
                    {done ? (
                      <div className="cart-empty">
                        <div className="ce-ico ok"><Check size={34} strokeWidth={2.4} /></div>
                        <h3>Order placed!</h3>
                        <p>Thanks for shopping with basil. This is a demo checkout, so nothing was charged.</p>
                        <button className="ce-btn" onClick={closeCart}>Continue shopping</button>
                      </div>
                    ) : !t.n ? (
                      <>
                        <div className="cart-empty">
                          <div className="ce-ico">🛒</div>
                          <h3>Your cart is empty</h3>
                          <p>Pick a lunchbox or bottle and it will show up here.</p>
                          <button className="ce-btn" onClick={closeCart}>Start shopping</button>
                        </div>
                        <UpsellStrip />
                      </>
                    ) : (
                      <>
                        <Progress t={t} />
                        {nonStrip.length > 0 && <ul className="cl-list">{nonStrip.map(l => <Line key={l.id} l={l} t={t} />)}</ul>}
                        <UpsellStrip />
                      </>
                    )}
                  </div>
                  <footer className="cart-foot" hidden={done}>
                    {t.n > 0 && (
                      <>
                        <div className="save-rib"><span>{inr2(t.save)} Saved so far!</span></div>
                        <div className="foot-in">
                          <div className="tot-row">
                            <button className="tot-l" aria-expanded={detailsOpen} aria-controls="orderSummary" onClick={() => setDetailsOpen(d => !d)}>
                              <Receipt /><b>Estimated Total</b>
                              <i className={detailsOpen ? 'flip' : ''}><ChevronDown size={16} strokeWidth={2} /></i>
                            </button>
                            <span className="tot-r"><s>{inr2(t.mrp)}</s><b>{inr2(t.pay)}</b><small>({pctOff(t.mrp, t.total)}% OFF)</small></span>
                          </div>
                          {detailsOpen && <Summary t={t} />}
                          <span className="ship-chip">
                            <Truck size={14} strokeWidth={1.4} /> {t.shipping ? `Add ${inr(MILESTONES[0].at - t.sub)} more for FREE shipping` : 'FREE shipping included'}
                          </span>
                          <button className="checkout" disabled={checkout === 'loading'} onClick={placeOrder}>
                            {checkout === 'loading' ? 'Placing order…' : 'Checkout'}
                            <span className="pay-chips"><i>UPI</i><i>Card</i></span>
                          </button>
                          <p className="fine">*Offer applicable on Products above ₹149</p>
                          <p className="powered">Powered by <b>GoKwik</b></p>
                        </div>
                      </>
                    )}
                  </footer>
                </motion.aside>
              </DialogContent>
            </DialogPortal>
          )}
        </AnimatePresence>
      </Dialog>
    </MotionConfig>
  );
}
