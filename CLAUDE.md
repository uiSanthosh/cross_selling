# CLAUDE.md — pdp-site

Product detail page (PDP) for **Bento Lite - Frozen**, a 3-compartment stainless steel lunchbox by **basil** (yourbasil.com). Prices are in INR (₹).

See also: [DESIGN.md](DESIGN.md) for visual rules, [MEMORY.md](MEMORY.md) for decisions and context.

## Stack
**Target stack (all new work):** Next.js → TypeScript → Tailwind CSS → shadcn/ui → Framer Motion → Zustand → Vercel

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Next.js + React, TypeScript | |
| Styling / UI | Tailwind CSS, shadcn/ui, Lucide React icons | Brand tokens from [DESIGN.md](DESIGN.md) go into the Tailwind theme |
| Interactions | Framer Motion | Only subtle transitions and micro-interactions |
| State | Zustand | Cart, add-ons and progress state |
| Data | Local TypeScript mock data | Later may connect to Shopify / commerce APIs |
| Deployment | Vercel | |

- **No backend yet.** The assignment is about making the PDP interaction feel real and demonstrating the CRO hypothesis, not building infrastructure.
- Font: Parkinsans (Google Fonts, via `next/font`).

**Status:** the PDP has been ported to this stack with no visual change (pixel diff vs the original is ~0.01%, only the Next dev badge and a few icon pixels). The original static HTML/CSS/JS prototype is kept in `legacy/` as the visual and behavioural reference.

- Run: `npm run dev` then open http://localhost:3000/. Check types with `npm run typecheck`, production build with `npm run build`.
- Legacy reference: `cd legacy && python3 -m http.server 8000`.

## CRO concept
The live basil PDP already has **Buy 2 → 5% OFF**, **Buy 3 → 10% OFF** and a **"Complete the Kit"** section. Our concept deliberately builds on these existing mechanisms; do not present them as new, and keep the discount tiers consistent with the live store.

## File map
| Path | Role |
|---|---|
| `app/layout.tsx`, `app/page.tsx` | Root layout (Parkinsans via `next/font`) and the page composition |
| `app/globals.css` | Tailwind v4 (theme + utilities only, **no Preflight**), brand tokens in `@theme`, imports `legacy.css` |
| `app/legacy.css` | The original stylesheet; owns all visuals. Class names are the design contract |
| `components/Hero.tsx` | Gallery, vibe swatches, quantity, "Pack the morning" bundle, Buy Now |
| `components/cart/CartDrawer.tsx` | Cart drawer: shadcn Dialog (Radix) + Framer Motion slide, milestones, upsell strip, summary, checkout demo |
| `components/sections/*` | Features, certs, reviews, specs (shadcn Tabs), FAQ (shadcn Accordion), Explore cards, Footer |
| `components/ui/*` | shadcn/ui primitives, trimmed to be unstyled so existing classes apply |
| `stores/cart-store.ts` | Zustand cart (persisted to localStorage key `basil-cart-v2`, rehydrated after mount, synced across tabs) |
| `stores/ui-store.ts` | Zustand UI state: drawer open, toast |
| `lib/pricing.ts` | Pure pricing: milestones, totals, bundle discount |
| `data/catalog.ts`, `data/content.ts` | Local TypeScript mock data (swap for Shopify/commerce API later) |
| `public/assets/` | Images and SVGs |
| `legacy/` | Original static prototype (reference only, do not edit) |

## Business rules (live in `lib/pricing.ts`)
- Catalogue lives in `CATALOG` in `data/catalog.ts`. Any new product needs an entry there before it can be added to the cart.
- Max quantity per line: 10. Shipping fee: ₹49.
- Spend milestones (on selling-price subtotal): ₹499 free shipping, ₹2,599 → ₹150 off, ₹4,000 → ₹400 off.
- Box unit price ₹1,899 (MRP ₹3,200). The two boxes are variants: `box-winter` (Winter Whirl) and `box-frozen` (Frozen Magic).
- Cart is persisted in localStorage under `basil-cart-v2`. Storage access is always wrapped in try/catch.
- Prices format with `toLocaleString('en-IN')`.

## Code rules
- New code: TypeScript (strict, no `any`), function components, Tailwind utilities, shadcn/ui primitives, Lucide icons. Do not add other UI/state/animation libraries.
- Zustand holds cart, add-on selection and progress; keep pricing logic in pure functions that read from the local TypeScript mock data so it can later swap to Shopify/commerce APIs.
- Framer Motion only for subtle transitions and micro-interactions; always respect `prefers-reduced-motion`.
- Use design tokens (CSS variables / Tailwind theme) for colours and font; do not hard-code new brand colours.
- Keep accessibility: `alt` on images (empty for decorative), `aria-label` on icon-only buttons, `aria-live` for status messages, keyboard support for custom buttons (`role="button"` + `tabindex`), respect `prefers-reduced-motion`.
- Reuse existing assets in `assets/` before adding new ones; do not rename or delete existing files.
- Product data (names, prices, MRPs) comes only from `data/catalog.ts`; never hard-code prices in components.
- **Visuals are frozen:** do not change design, colour, font or layout when refactoring. Reuse the classes in `app/legacy.css`; new Tailwind utilities are for glue only. After UI changes, re-compare against `legacy/` (screenshot diff at 1440, 1024 and 390 wide).
- Plain `<img>` is used on purpose (matches the original rendering exactly); do not switch to `next/image` without a visual diff.

## Working rules for Claude
- Read the relevant file before editing; make the smallest change that does the job.
- After changes, verify in the browser at http://localhost:8000/ (desktop and a narrow mobile width). Report what was and was not verified.
- Do not change pricing rules, copy claims (ratings, "2 Lakh+ Happy Families", certifications) or return/warranty text without being asked.
- Ask before destructive actions (deleting files, overwriting assets). This folder is not under git, so there is no undo.
