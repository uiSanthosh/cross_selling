const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const inr = n => '₹' + n.toLocaleString('en-IN');
const inrSp = n => inr(n).replace('₹', '₹ ');

// ---------- Cart (state + drawer live in cart.js) ----------
const { toast } = Cart;
const flash = (btn, label) => {
  const old = btn.dataset.label || btn.textContent;
  btn.dataset.label = old;
  btn.textContent = label;
  btn.disabled = true;
  setTimeout(() => { btn.textContent = btn.dataset.label; btn.disabled = false; }, 1200);
};

// ---------- Gallery ----------
const mainImg = $('#mainImg');
$('#thumbs').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  $$('#thumbs button').forEach(x => x.classList.toggle('active', x === b));
  mainImg.src = b.dataset.src;
});

// ---------- Swatches ----------
$('#swatches').addEventListener('click', e => {
  const b = e.target.closest('.swatch');
  if (!b) return;
  $$('.swatch').forEach(x => x.classList.toggle('active', x === b));
  $('#vibeName').textContent = b.dataset.name;
});

// ---------- Quantity + main CTA ----------
const BOX_ID = { 'Winter Whirl': 'box-winter', 'Frozen Magic': 'box-frozen' };
const UNIT = 1899, UNIT_MRP = 3200, MAX_QTY = 10;
let qty = 2;
const addBtn = $('#addBtn');

const setQty = n => {
  qty = Math.min(MAX_QTY, Math.max(1, n));
  $('#qVal').textContent = qty;
  $('#qMinus').disabled = qty <= 1;
  $('#qPlus').disabled = qty >= MAX_QTY;
  addBtn.textContent = `${qty} box${qty > 1 ? 'es' : ''} · ${inr(qty * UNIT)}`;
  addBtn.dataset.label = addBtn.textContent;
  renderBundle();
};
$('#qMinus').onclick = () => setQty(qty - 1);
$('#qPlus').onclick = () => setQty(qty + 1);

addBtn.addEventListener('click', () => {
  const vibe = $('#vibeName').textContent;
  Cart.add(BOX_ID[vibe], qty);
  flash(addBtn, 'Added ✓');
  Cart.open();
});

// ---------- "Pack the morning" bundle ----------
const cards = $$('#cards3 .mini');
const note = $('#bundleNote');
const OFFER_AT = 3;          // select all essentials to unlock the extra 10%
const OFFER_PCT = 0.10;

const itemOf = el => el.dataset.id === 'box'
  ? { name: `Frozen Magic lunchbox ×${qty}`, price: UNIT * qty, mrp: UNIT_MRP * qty }
  : { name: el.dataset.name, price: +el.dataset.price, mrp: +el.dataset.mrp };

const setSelected = (el, on) => {
  el.classList.toggle('selected', on);
  el.setAttribute('aria-pressed', String(on));
};

function renderBundle() {
  const sel = cards.filter(c => c.classList.contains('selected'));
  const n = sel.length;

  // keep the main card's text in sync with quantity
  const box = itemOf(cards[0]);
  $('.mini-name', cards[0]).textContent = box.name;
  $('b', cards[0]).textContent = inr(box.price);
  $('s', cards[0]).textContent = `MRP${inrSp(box.mrp)}`;

  let price = 0, mrp = 0;
  sel.forEach(c => { const i = itemOf(c); price += i.price; mrp += i.mrp; });
  const unlocked = n >= OFFER_AT;
  const discount = unlocked ? Math.round(price * OFFER_PCT) : 0;
  price -= discount;

  $('#essText').textContent = `${n} / 3 essentials`;
  $('#essBar').style.width = `${(n / 3) * 100}%`;
  $('#bundleTotal').textContent = inr(price);
  $('#bundleSave').textContent = inr(mrp - price);
  $('#bundleMrp').textContent = inr(mrp);

  const unlock = $('#unlockChip');
  unlock.classList.toggle('done', unlocked);
  $('#unlockText').textContent = unlocked
    ? `Extra 10% OFF unlocked (−${inr(discount)})`
    : n === 0 ? 'Pick items to start saving'
    : `Add ${OFFER_AT - n} more → Unlock Extra 10% OFF`;

  const buy = $('#buyNow');
  buy.disabled = n === 0;
  buy.textContent = n === 0 ? 'Select at least one item' : `Buy Now · ${inr(price)}`;
  buy.dataset.total = price;

  note.hidden = n !== 0;
  note.textContent = n === 0
    ? 'Nothing selected. Add an item above, or use the main button to buy the lunchbox on its own.'
    : '';
}

const toggleCard = card => {
  setSelected(card, !card.classList.contains('selected'));
  renderBundle();
};
$('#cards3').addEventListener('click', e => {
  const card = e.target.closest('.mini');
  if (card) toggleCard(card);
});
$('#cards3').addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.mini');
  if (!card) return;
  e.preventDefault();
  toggleCard(card);
});

$('#buyNow').addEventListener('click', () => {
  const sel = cards.filter(c => c.classList.contains('selected'));
  if (!sel.length) return;
  sel.forEach(c => {
    if (c.dataset.id === 'box') Cart.add(BOX_ID[$('#vibeName').textContent], qty);
    else Cart.add(c.dataset.id, 1);
  });
  Cart.open();
});

$$('#tabs3 button').forEach(b => b.addEventListener('click', () => {
  $$('#tabs3 button').forEach(x => x.classList.toggle('active', x === b));
}));

// ---------- Explore more: Add to Cart (default -> adding -> stepper) ----------
// States: default "Add to Cart" | adding (spinner) | in cart with - qty + stepper
//         (qty 1 and "-" removes it) | max reached (+ disabled, hint shown)
const ITEM_MAX = 10;
$$('.atc').forEach(btn => {
  const { id, name } = btn.dataset;
  const area = document.createElement('div');
  area.className = 'atc-area';
  btn.replaceWith(area);
  area.innerHTML = `
    <button class="atc" type="button">Add to Cart</button>
    <div class="stepper" hidden>
      <button type="button" class="st-minus" aria-label="Remove one ${name}">−</button>
      <span class="st-qty" aria-live="polite">1</span>
      <button type="button" class="st-plus" aria-label="Add one more ${name}">+</button>
    </div>
    <p class="st-hint" hidden></p>`;
  const add = $('.atc', area), step = $('.stepper', area), q = $('.st-qty', area);
  const plus = $('.st-plus', area), minus = $('.st-minus', area), hint = $('.st-hint', area);

  const render = () => {
    const n = Cart.qty(id);
    add.hidden = n > 0;
    step.hidden = n === 0;
    q.textContent = n;
    plus.disabled = n >= ITEM_MAX;
    hint.hidden = n < ITEM_MAX;
    hint.textContent = `Max ${ITEM_MAX} per order`;
    area.classList.toggle('in-cart', n > 0);
  };
  Cart.onChange(render);   // stays in sync with the drawer and other tabs

  add.addEventListener('click', () => {
    if (add.classList.contains('loading')) return;
    add.classList.add('loading');
    add.textContent = 'Adding…';
    setTimeout(() => {                       // short fake latency so the state is visible
      add.classList.remove('loading');
      add.textContent = 'Add to Cart';
      Cart.add(id);
      toast(`${name} added to cart`, { label: 'View cart', fn: Cart.open });
      plus.focus();
    }, 450);
  });
  plus.addEventListener('click', () => Cart.add(id));
  minus.addEventListener('click', () => {
    Cart.set(id, Cart.qty(id) - 1);
    if (!Cart.qty(id)) { toast(`${name} removed from cart`); add.focus(); }
  });
  render();
});

setQty(qty);

// ---------- Hearts ----------
const heart = t => `<img src="assets/${{ f: 'c0913', e: '5c379', lf: 'd86db', lh: 'a63e5', le: '780c7' }[t]}.svg" alt="">`;
const hearts = (n, large = false, half = false) => {
  let out = '';
  for (let i = 1; i <= 5; i++) {
    const t = large ? (i <= n ? 'lf' : half && i === n + 1 ? 'lh' : 'le') : (i <= n ? 'f' : 'e');
    out += heart(t);
  }
  return `<span class="hearts${large ? ' lg' : ''}" role="img" aria-label="${n}${half ? '.5' : ''} out of 5">${out}</span>`;
};
const rows = [[5, 1], [4, 1], [3, 0], [2, 0], [1, 0]];
$('#dist').innerHTML = rows.map(([s, c]) =>
  `<div class="dist-row">${hearts(s)}<div class="dist-bar">${c ? `<i style="width:50%"></i>` : ''}</div><span>${c}</span></div>`).join('');
$('.avgstars').outerHTML = hearts(4, true, true);
$$('.sm4').forEach(el => { el.outerHTML = hearts(4, true); });

// ---------- Spec tabs ----------
$('#specTabs').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  $$('#specTabs button').forEach(x => x.classList.toggle('active', x === b));
  $$('.spec-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + b.dataset.tab));
});

// ---------- Announcement bar: duplicate content for a seamless loop ----------
const track = $('.adv-track');
track.innerHTML += track.innerHTML;
