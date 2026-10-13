// Cart: state, pricing rules, persistence and the slide-in drawer.
// Exposed as window.Cart; main.js drives it from the product page.
// Behaviour mirrors yourbasil.com's side cart: spend milestones, a "Make it a set"
// row, an order summary and a "saved so far" ribbon.
window.Cart = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const inr2 = n => '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Catalogue ----------
  const BOX = '3 Compartment Stainless Steel Lunchbox with Plastic Lid';
  const CATALOG = {
    'box-winter': { name: `${BOX} - Winter Whirl`, short: 'Bento Lite - Winter Whirl', price: 1899, mrp: 3200, img: 'assets/thumb-raw1.png' },
    'box-frozen': { name: `${BOX} - Frozen Magic`, short: 'Bento Lite - Frozen Magic', price: 1899, mrp: 3200, img: 'assets/acca8.png' },
    'dip': { name: 'Pickle Dip', short: 'Pickle Dip', price: 149, mrp: 249, img: 'assets/c08c1.png', upsell: true },
    'bottle': { name: 'HydraPop 380ml', short: 'HydraPop 380ml', price: 1099, mrp: 2000, img: 'assets/be654.png', upsell: true },
    'hydrapop600': { name: 'HydraPop 600ml', short: 'HydraPop 600ml', price: 1299, mrp: 2400, img: 'assets/327ba.png', upsell: true },
    'hydrafizz': { name: 'HydraFizz 800ml', short: 'HydraFizz 800ml', price: 1399, mrp: 2600, img: 'assets/dbf85.png' },
    'bento-ace': { name: 'Bento Ace', short: 'Bento Ace', price: 1599, mrp: 2500, img: 'assets/5f774.png' },
    'bento-quad': { name: 'Bento Quad', short: 'Bento Quad', price: 1999, mrp: 3500, img: 'assets/c07b7.png' },
  };

  const STRIP = ['dip', 'bottle', 'hydrapop600'];   // "Pack the morning" cards: shown here, not as cart lines

  // ---------- Rules ----------
  const MAX_QTY = 10;
  const SHIPPING_FEE = 49;
  // Spend milestones (on the selling-price subtotal), same as the live store.
  const MILESTONES = [
    { at: 499, label: 'Free Shipping', off: 0, icon: 'truck' },
    { at: 2599, label: '₹150 Off', off: 150, icon: 'pct' },
    { at: 4000, label: '₹400 Off', off: 400, icon: 'pct' },
  ];

  // ---------- State ----------
  const KEY = 'basil-cart-v1';
  let items = {};            // id -> qty
  const listeners = [];
  const load = obj => {
    items = {};
    Object.entries((obj && obj.items) || {}).forEach(([id, q]) => { if (CATALOG[id] && q > 0) items[id] = Math.min(MAX_QTY, q | 0); });
  };
  try { load(JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (_) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ items })); } catch (_) {} };

  const qty = id => items[id] || 0;
  const count = () => Object.values(items).reduce((a, q) => a + q, 0);

  function totals() {
    const lines = Object.entries(items).map(([id, q]) => ({ id, q, p: CATALOG[id], mrp: CATALOG[id].mrp * q, sub: CATALOG[id].price * q, alloc: 0 }));
    const mrp = lines.reduce((a, l) => a + l.mrp, 0);
    const sub = lines.reduce((a, l) => a + l.sub, 0);
    const reached = MILESTONES.filter(m => sub >= m.at);
    const tier = reached.length - 1;                       // index of the highest reached milestone (-1 = none)
    const off = Math.max(0, ...reached.map(m => m.off));
    // spread the milestone discount across lines, proportionally to their value
    let left = off;
    lines.forEach((l, i) => {
      l.alloc = i === lines.length - 1 ? left : Math.floor(off * l.sub / sub);
      left -= l.alloc;
      l.final = l.sub - l.alloc;
    });
    const total = sub - off;
    const n = count();
    const shipping = n === 0 || sub >= MILESTONES[0].at ? 0 : SHIPPING_FEE;
    return { lines, n, mrp, sub, off, tier, total, shipping, pay: total + shipping, save: mrp - total };
  }

  // ---------- Mutations ----------
  function set(id, q) {
    if (!CATALOG[id]) return;
    q = Math.max(0, Math.min(MAX_QTY, q));
    if (q) items[id] = q; else delete items[id];
    save(); render();
    listeners.forEach(f => f(id));
  }
  const add = (id, q = 1) => {
    if (qty(id) + q > MAX_QTY) toast(`Max ${MAX_QTY} per item`);
    set(id, qty(id) + q);
  };

  // ---------- Toast (supports an action button) ----------
  let toastTimer;
  function toast(msg, action) {
    const t = $('#toast');
    t.textContent = msg;
    if (action) {
      const b = document.createElement('button');
      b.className = 'toast-act'; b.textContent = action.label;
      b.onclick = () => { action.fn(); t.classList.remove('show'); };
      t.append(' ', b);
    }
    t.classList.toggle('has-act', !!action);
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), action ? 4500 : 2200);
  }

  // ---------- Confetti when a milestone unlocks ----------
  function confetti() {
    if (reduceMotion) return;
    const cv = $('#cartConfetti');
    const w = cv.width = cv.clientWidth, h = cv.height = cv.clientHeight;
    const ctx = cv.getContext('2d');
    const colors = ['#5F259F', '#C8E616', '#15b79e', '#ffdc07', '#eb6738', '#6fa8ff'];
    const ps = Array.from({ length: 70 }, () => ({
      x: w * (.2 + Math.random() * .6), y: h * .2, vx: (Math.random() - .5) * 9, vy: -Math.random() * 9 - 2,
      s: 4 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: colors[(Math.random() * colors.length) | 0],
    }));
    const t0 = performance.now();
    (function frame(now) {
      const k = (now - t0) / 1700;
      ctx.clearRect(0, 0, w, h);
      if (k >= 1) return;
      ps.forEach(p => {
        p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.globalAlpha = 1 - k * k; ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
      });
      requestAnimationFrame(frame);
    })(t0);
  }

  // ---------- Drawer ----------
  const ICON = {
    close: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 4l12 12M16 4L4 16"/></svg>',
    trash: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 1h5l.5 1.5H14V4H2V2.5h3L5.5 1zM3 5h10l-.7 9.1a1 1 0 0 1-1 .9H4.7a1 1 0 0 1-1-.9L3 5z"/></svg>',
    chev: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6l5 5 5-5"/></svg>',
    tag: '<svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M1.5 1.5h5l6 6-5 5-6-6v-5z"/><circle cx="4.5" cy="4.5" r=".8" fill="currentColor"/></svg>',
    pct: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M10.5 3.5l-7 7"/><circle cx="4" cy="4" r="1.3"/><circle cx="10" cy="10" r="1.3"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 7.5l3 3 6-7"/></svg>',
    receipt: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="1" width="18" height="22" rx="3" fill="currentColor"/><text x="12" y="16.5" text-anchor="middle" font-size="13" font-weight="700" fill="#fff" font-family="system-ui">₹</text></svg>',
    truck: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M1 3h7v6H1zM8 5h3l2 2v2H8z"/><circle cx="4" cy="10" r="1.2" fill="#fff"/><circle cx="10.5" cy="10" r="1.2" fill="#fff"/></svg>',
  };

  const root = document.createElement('div');
  root.id = 'cartRoot';
  root.innerHTML = `
    <div class="cart-overlay" id="cartOverlay" hidden></div>
    <aside class="cart" id="cart" role="dialog" aria-modal="true" aria-labelledby="cartTitle" aria-hidden="true" tabindex="-1">
      <canvas class="cart-confetti" id="cartConfetti" aria-hidden="true"></canvas>
      <header class="cart-head"><h2 id="cartTitle">Your Cart</h2><button class="cart-x" data-act="close" aria-label="Close cart">${ICON.close}</button></header>
      <div class="cart-banner">Free shipping above 499 | 10 Days Return* 🎊</div>
      <div class="cart-scroll" id="cartScroll"></div>
      <footer class="cart-foot" id="cartFoot"></footer>
    </aside>`;
  document.body.append(root);
  const drawer = $('#cart'), overlay = $('#cartOverlay');
  let lastFocus = null, detailsOpen = false, checkoutState = 'idle', shownTier = null;

  function open() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    requestAnimationFrame(() => { root.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); drawer.focus(); });
    document.body.classList.add('no-scroll');
  }
  function close() {
    root.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { if (!root.classList.contains('open')) overlay.hidden = true; }, 300);
    if (checkoutState === 'done') { checkoutState = 'idle'; render(); }
    lastFocus && lastFocus.focus && lastFocus.focus();
  }

  function progressHTML(t) {
    const last = MILESTONES.length - 1, seg = 100 / MILESTONES.length;
    // fill runs 0 -> first milestone -> second -> third, each a third of the rail
    let pct = 100;
    const i = MILESTONES.findIndex(m => t.sub < m.at);
    if (i !== -1) {
      const lo = i === 0 ? 0 : MILESTONES[i - 1].at;
      pct = (i + (t.sub - lo) / (MILESTONES[i].at - lo)) * seg;
    }
    const next = MILESTONES[i];
    const msg = !next ? `You have unlocked ${inr(MILESTONES[last].off)} OFF!`
      : `Add items worth ${inr(next.at - t.sub)} more to unlock ${next.off ? inr(next.off) + ' off' : 'free shipping'}`;
    return `<div class="cart-progress">
      <p class="cp-msg" role="status">${msg}</p>
      <div class="cp-rail" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}" aria-label="Savings milestones">
        <i style="width:${pct}%"></i>
        ${MILESTONES.map((m, k) => `<div class="cp-step ${t.sub >= m.at ? 'on' : ''}" style="left:${(k + 1) * seg}%">
          <span class="cp-goal">${inr(m.at)}</span>
          <span class="cp-ico">${ICON[m.icon]}</span>
          <span class="cp-lab">${m.label}</span></div>`).join('')}
      </div>
    </div>`;
  }

  const pctOff = (mrp, price) => Math.round((1 - price / mrp) * 100);

  function lineHTML(l, t) {
    const { id, q, p } = l;
    return `<li class="cl" data-id="${id}">
      <img src="${p.img}" alt="">
      <div class="cl-main">
        <div class="cl-row">
          <div class="cl-info">
            <p class="cl-name">${p.name}</p>
            <span class="chip">No Personalisation</span>
          </div>
          <div class="cl-price">
            <s>${inr2(l.mrp)}</s><b>${inr2(l.final)}</b><span>(${pctOff(l.mrp, l.final)}% OFF)</span>
            ${l.alloc ? `<em class="cl-coupon">${ICON.tag} SPARK${t.off}</em>` : ''}
          </div>
        </div>
        <div class="cl-ctl">
          <div class="qh">
            <button data-act="dec" aria-label="Decrease quantity of ${p.short}" ${q <= 1 ? 'disabled' : ''}>−</button>
            <input class="qh-in" type="number" min="1" max="${MAX_QTY}" step="1" inputmode="numeric" value="${q}" aria-label="Quantity of ${p.short}">
            <button data-act="inc" aria-label="Increase quantity of ${p.short}" ${q >= MAX_QTY ? 'disabled' : ''}>+</button>
          </div>
          <button class="cl-del" data-act="del" aria-label="Remove ${p.short}">${ICON.trash}</button>
        </div>
      </div>
    </li>`;
  }

  function upsellHTML() {
    return `<section class="cart-up"><h3>Pack the morning, not just the box</h3><div class="up-row">` + STRIP.map(id => {
      const p = CATALOG[id], q = qty(id), on = q > 0;
      return `<div class="up ${on ? 'on' : ''}" data-id="${id}">
        <div class="up-img"><img src="${p.img}" alt="">${on ? `<span class="up-chk">${ICON.check}</span>` : ''}</div>
        <p class="up-name">${p.short}</p>
        <p class="up-price"><b ${id === 'dip' ? 'class="orange"' : ''}>${inr2(p.price).replace('.00', '')}</b><s>MRP${inr(p.mrp)}</s></p>
        <span class="up-off">${pctOff(p.mrp, p.price)}%OFF</span>
        <div class="up-ctl">
          ${on ? `<div class="up-step">
            <button data-act="dec" aria-label="${q > 1 ? 'Remove one' : 'Remove'} ${p.short}">−</button>
            <span aria-live="polite">${q}</span>
            <button data-act="inc" aria-label="Add one more ${p.short}" ${q >= MAX_QTY ? 'disabled' : ''}>+</button>
          </div>${q >= MAX_QTY ? `<p class="up-hint">Max ${MAX_QTY} per order</p>` : ''}`
          : `<button class="up-atc" data-act="inc">Add to Cart</button>`}
        </div>
      </div>`;
    }).join('') + `</div></section>`;
  }

  function summaryHTML(t) {
    return `<div class="bd" id="orderSummary">
      <div class="bd-head"><b>Order Summary</b><span>${inr2(t.save)} saved so far</span></div>
      <div class="bd-row"><span>MRP total</span><span>${inr2(t.mrp)}</span></div>
      <div class="bd-row g"><span>Discount on MRP</span><span>${inr2(t.mrp - t.sub)}</span></div>
      <div class="bd-row"><span>Cart Subtotal</span><span>${inr2(t.sub)}</span></div>
      <div class="bd-row g"><span>Total discount</span><span>${inr2(t.off)}</span></div>
      <div class="bd-row"><span>Shipping Charges</span><span class="${t.shipping ? '' : 'g'}">${t.shipping ? inr2(t.shipping) : 'FREE'}</span></div>
      <div class="bd-row g"><span>Total savings</span><span>${inr2(t.save)}</span></div>
      <div class="bd-total"><span>Estimated Total</span><span>${inr2(t.pay)}</span></div>
    </div>`;
  }

  function render() {
    const t = totals();
    const badge = $('#cartCount');
    if (badge) {
      badge.textContent = t.n > 99 ? '99+' : t.n; badge.hidden = t.n === 0;
      badge.classList.remove('pop'); void badge.offsetWidth; badge.classList.add('pop');
      $('#cartBtn').setAttribute('aria-label', `Cart, ${t.n} item${t.n === 1 ? '' : 's'}`);
    }
    $('#cartTitle').textContent = `Your Cart (${t.n} item${t.n === 1 ? '' : 's'})`;

    const scroll = $('#cartScroll'), foot = $('#cartFoot'), keepTop = scroll.scrollTop;
    const keepRow = $('.up-row', scroll), keepLeft = keepRow ? keepRow.scrollLeft : 0;
    const ae = document.activeElement;
    const focusKey = ae && scroll.contains(ae)
      ? [ae.closest('[data-id]')?.dataset.id, ae.classList.contains('qh-in') ? 'qin' : ae.dataset.act] : null;

    if (checkoutState === 'done') {
      scroll.innerHTML = `<div class="cart-empty"><div class="ce-ico ok">${ICON.check}</div><h3>Order placed!</h3><p>Thanks for shopping with basil. This is a demo checkout, so nothing was charged.</p><button class="ce-btn" data-act="close">Continue shopping</button></div>`;
      foot.hidden = true; return;
    }
    foot.hidden = false;

    scroll.innerHTML = !t.n
      ? `<div class="cart-empty"><div class="ce-ico">🛒</div><h3>Your cart is empty</h3><p>Pick a lunchbox or bottle and it will show up here.</p><button class="ce-btn" data-act="close">Start shopping</button></div>` + upsellHTML()
      : progressHTML(t) + `${t.lines.some(l => !STRIP.includes(l.id)) ? `<ul class="cl-list">${t.lines.filter(l => !STRIP.includes(l.id)).map(l => lineHTML(l, t)).join('')}</ul>` : ''}` + upsellHTML();
    scroll.scrollTop = keepTop;
    const row = $('.up-row', scroll); if (row) row.scrollLeft = keepLeft;
    if (focusKey && focusKey[0]) {   // put focus back on the control the user just used
      const sel = focusKey[1] === 'qin' ? '.qh-in' : `[data-act="${focusKey[1]}"]`;
      const el = $(`[data-id="${focusKey[0]}"] ${sel}`, scroll);
      if (el && !el.disabled) el.focus();
    }

    foot.innerHTML = t.n ? `
      <div class="save-rib"><span>${inr2(t.save)} Saved so far!</span></div>
      <div class="foot-in">
        <div class="tot-row">
          <button class="tot-l" data-act="details" aria-expanded="${detailsOpen}" aria-controls="orderSummary">${ICON.receipt}<b>Estimated Total</b><i class="${detailsOpen ? 'flip' : ''}">${ICON.chev}</i></button>
          <span class="tot-r"><s>${inr2(t.mrp)}</s><b>${inr2(t.total)}</b><small>(${pctOff(t.mrp, t.total)}% OFF)</small></span>
        </div>
        ${detailsOpen ? summaryHTML(t) : ''}
        <span class="ship-chip">${ICON.truck} ${t.shipping ? `Add ${inr(MILESTONES[0].at - t.sub)} more for FREE shipping` : 'FREE shipping included'}</span>
        <button class="checkout" data-act="checkout" ${checkoutState === 'loading' ? 'disabled' : ''}>${checkoutState === 'loading' ? 'Placing order…' : 'Checkout'}<span class="pay-chips"><i>UPI</i><i>Card</i></span></button>
        <p class="fine">*Offer applicable on Products above ₹149</p>
        <p class="powered">Powered by <b>GoKwik</b></p>
      </div>` : '';

    // celebrate a newly unlocked milestone (only while the drawer is visible)
    if (shownTier !== null && t.tier > shownTier && root.classList.contains('open')) confetti();
    shownTier = t.tier;
  }

  // ---------- Events ----------
  root.addEventListener('click', e => {
    if (e.target === overlay) return close();
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const holder = b.closest('[data-id]'), id = holder && holder.dataset.id;
    switch (b.dataset.act) {
      case 'close': close(); break;
      case 'inc':
        if (b.classList.contains('up-atc')) {          // same default -> adding -> stepper flow as the page cards
          if (b.classList.contains('loading')) break;
          b.classList.add('loading'); b.textContent = 'Adding…';
          setTimeout(() => add(id, 1), 450);
        } else add(id, 1);
        break;
      case 'dec':
        set(id, qty(id) - 1);
        if (!qty(id)) toast(`${CATALOG[id].short} removed from cart`);
        break;
      case 'del': {
        const prev = qty(id);
        set(id, 0);
        toast(`${CATALOG[id].short} removed`, { label: 'Undo', fn: () => set(id, prev) });
        break;
      }
      case 'details':
        detailsOpen = !detailsOpen; render();
        if (detailsOpen) $('#orderSummary')?.scrollIntoView({ block: 'nearest' });
        break;
      case 'checkout':
        checkoutState = 'loading'; render();
        setTimeout(() => { items = {}; checkoutState = 'done'; shownTier = null; save(); render(); listeners.forEach(f => f()); }, 1100);
        break;
    }
  });
  // typing a quantity directly
  root.addEventListener('change', e => {
    if (!e.target.classList.contains('qh-in')) return;
    const id = e.target.closest('[data-id]').dataset.id;
    const v = parseInt(e.target.value, 10);
    if (!(v >= 1)) { e.target.value = qty(id); return; }           // empty/0/NaN: keep current
    if (v > MAX_QTY) toast(`Max ${MAX_QTY} per item`);
    set(id, Math.min(MAX_QTY, v));
  });
  root.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.classList.contains('qh-in')) { e.preventDefault(); e.target.blur(); }
  });
  document.addEventListener('keydown', e => {
    if (!root.classList.contains('open')) return;
    if (e.key === 'Escape') return close();
    if (e.key !== 'Tab') return;   // keep focus inside the dialog
    const f = $$('button:not(:disabled), input, [tabindex="0"]', drawer).filter(x => x.offsetParent);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === drawer)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  $('#cartBtn').addEventListener('click', open);
  // cart changed in another tab
  window.addEventListener('storage', e => {
    if (e.key !== KEY) return;
    try { load(JSON.parse(e.newValue || '{}')); } catch (_) { items = {}; }
    render(); listeners.forEach(f => f());
  });

  render();
  return { add, set, qty, count, open, close, toast, inr, CATALOG, onChange: f => listeners.push(f) };
})();
