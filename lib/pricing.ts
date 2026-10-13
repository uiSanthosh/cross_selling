import { CATALOG, type ProductId } from '@/data/catalog';

export const MAX_QTY = 10;
export const SHIPPING_FEE = 49;

export type MilestoneIcon = 'truck' | 'pct';
export interface Milestone {
  at: number;
  label: string;
  off: number;
  icon: MilestoneIcon;
}

// Spend milestones (on the selling-price subtotal), same as the live store.
export const MILESTONES: Milestone[] = [
  { at: 499, label: 'Free Shipping', off: 0, icon: 'truck' },
  { at: 2599, label: '₹150 Off', off: 150, icon: 'pct' },
  { at: 4000, label: '₹400 Off', off: 400, icon: 'pct' },
];

export type CartItems = Partial<Record<ProductId, number>>;

export interface CartLine {
  id: ProductId;
  q: number;
  mrp: number;
  sub: number;
  alloc: number;
  final: number;
}

export interface Totals {
  lines: CartLine[];
  n: number;
  mrp: number;
  sub: number;
  off: number;
  tier: number;
  total: number;
  shipping: number;
  pay: number;
  save: number;
}

export function totals(items: CartItems): Totals {
  const lines: CartLine[] = (Object.entries(items) as [ProductId, number][]).map(([id, q]) => ({
    id,
    q,
    mrp: CATALOG[id].mrp * q,
    sub: CATALOG[id].price * q,
    alloc: 0,
    final: 0,
  }));
  const mrp = lines.reduce((a, l) => a + l.mrp, 0);
  const sub = lines.reduce((a, l) => a + l.sub, 0);
  const reached = MILESTONES.filter(m => sub >= m.at);
  const tier = reached.length - 1; // index of the highest reached milestone (-1 = none)
  const off = Math.max(0, ...reached.map(m => m.off));
  // spread the milestone discount across lines, proportionally to their value
  let left = off;
  lines.forEach((l, i) => {
    l.alloc = i === lines.length - 1 ? left : Math.floor((off * l.sub) / sub);
    left -= l.alloc;
    l.final = l.sub - l.alloc;
  });
  const total = sub - off;
  const n = lines.reduce((a, l) => a + l.q, 0);
  const shipping = n === 0 || sub >= MILESTONES[0].at ? 0 : SHIPPING_FEE;
  return { lines, n, mrp, sub, off, tier, total, shipping, pay: total + shipping, save: mrp - total };
}

// ---------- Selection preview (PDP) ----------
// The PDP prices what it is about to add with the same totals() the cart uses, so the
// price on the buttons always matches the cart.
export const nextMilestone = (sub: number) => MILESTONES.find(m => sub < m.at);

export function selectionTotals(lines: [ProductId, number][]): Totals {
  const items: CartItems = {};
  lines.forEach(([id, q]) => {
    items[id] = Math.min(MAX_QTY, (items[id] ?? 0) + q);
  });
  return totals(items);
}
