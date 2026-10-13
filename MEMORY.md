# MEMORY.md — pdp-site

Running log of decisions, context and gotchas. Add new entries at the top of each section; keep each to a line or two. Rules live in [CLAUDE.md](CLAUDE.md), visuals in [DESIGN.md](DESIGN.md).

## Project context
- Product: Bento Lite - Frozen (3 compartment stainless steel lunchbox), brand **basil**.
- Goal: a PDP that mirrors yourbasil.com behaviour, including the side cart (spend milestones, "Make it a set" row, order summary, "saved so far" ribbon).
- Owner email on this machine: santhosh847925@gmail.com.

## Decisions
- 2026-10-07: **New tech stack decided:** Next.js + React, TypeScript, Tailwind CSS, shadcn/ui, Lucide React, Framer Motion (subtle only), Zustand (cart/add-on/progress), local TypeScript mock data, deployed on Vercel. Deliberately **no backend yet**: the priority is a PDP interaction that feels real and demonstrates the CRO hypothesis. Data may later connect to Shopify/commerce APIs.
- 2026-10-07: Live basil PDP already has Buy 2 → 5% OFF, Buy 3 → 10% OFF and a "Complete the Kit" section. The concept builds on these existing mechanisms rather than claiming they are new.
- 2026-10-07: Added CLAUDE.md, MEMORY.md and DESIGN.md at project root to hold rules, context and design system. (The request said "Claude.md / Memeory.md / Design.md"; filenames normalised to the conventional uppercase spelling.)
- The current static prototype (no build tooling) is the behavioural reference for the Next.js rebuild.
- Prototype cart state is client-side only (localStorage key `basil-cart-v1`); there is no backend or checkout.

## Current state
- Page sections present: announcement bar, nav, buy box with swatches, quantity and bundle, features, certifications, social proof, specs tabs, reviews, FAQ, explore more, footer, cart drawer.
- Local dev server: `npm run dev` (http://localhost:3000/). Legacy reference: `cd legacy && python3 -m http.server 8000`.
- Not a git repository, so there is no history; take a copy before risky edits.

## Gotchas
- (Legacy only) `cart.js` must load before `main.js`.
- Default quantity is 2 and the bundle starts with the box and HydraPop 380ml pre-selected; the CTA text and totals are derived from state in `components/Hero.tsx`.
- Asset filenames are hashed, so check the `alt` text or open the file to identify an image.

## Migration notes (2026-10-07)
- Ported the static prototype to Next.js 16 + TS + Tailwind v4 + shadcn/ui + Framer Motion + Zustand with no visual change. Verified by pixel diff against `legacy/` at 1440/1024/390 (~0.01%, dev badge and icon antialiasing only) and by scripted interaction tests (bundle, drawer, undo toast, persistence, FAQ, specs, Explore add-to-cart).
- Tailwind runs without Preflight so the original reset in `app/legacy.css` is untouched; legacy CSS is imported into the `components` layer.
- Intentional small deviations: cart drawer icons are Lucide (close, check, tag, percent, truck, chevron, trash) instead of hand-drawn SVGs; FAQ/specs/bundle tabs use Radix (shadcn) so their active state is `data-state`; cart storage key is now `basil-cart-v2`.
- Gotcha: `.spec-panel` sets `display:flex`, so `[hidden]` needs an explicit `display:none` rule (otherwise inactive Radix panels show).
- Gotcha: the toast sits outside the drawer dialog; the dialog ignores outside clicks on `.toast` so Undo / View cart work.

## Bundle tabs (2026-10-07)
- "Pack the morning" now has real per-tab bundles in `BUNDLES` (`data/catalog.ts`); each tab keeps its own selection and starts with its first two items picked. (The separate bundle "extra 10%" was removed, see Pricing fix.)
- Playschool: Frozen Magic box, HydraPop 380ml, Pickle Dip. Primary: Frozen Magic box, HydraFizz 800ml Classic Blue (₹1,399 / MRP ₹2,600), Pickle Dip Blue (₹149 / ₹249). Two kids: Frozen Magic box, Bento Ace 2C Classic Blue (₹1,299 / ₹2,500), HydraPop 380ml Glacier (₹999 / ₹2,000).
- Prices and images for the new items come from yourbasil.com's public `/products.json` (images saved as `public/assets/live-*`). Winter Whirl's cart image now uses the real live photo.
- The second box in Two kids is deliberately not Winter Whirl: the page's default vibe is Winter Whirl and the same id would merge into one cart line.
- Existing Playschool prices (HydraPop 380ml ₹1,099, Pickle Dip ₹149) were left as they were; the live site now lists some of these differently.

## Pricing fix (2026-10-08)
- Problem: PDP prices (main button, bundle total, Buy Now) used raw list prices plus a separate "extra 10%" bundle rule, while the cart used spend milestones, so the same items showed different prices (e.g. 2 boxes: PDP ₹3,798 vs cart ₹3,648). The cart header total also excluded shipping while the summary's "Estimated Total" included it.
- Decision (user chose "cart milestones only"): one rule everywhere. The PDP now prices selections with the cart's own `totals()` via `selectionTotals()` in `lib/pricing.ts`; the bundle chip now nudges the next milestone (₹499 free shipping, ₹2,599 → ₹150, ₹4,000 → ₹400). The cart header "Estimated Total" now shows the amount payable (incl. shipping when under ₹499).
- Verified with a scripted run: 25/25 scenarios (main button qty 1-4; every tab × every card subset) have PDP price = cart header = summary total.
- Note: a selection is priced on its own; if the cart already has items, the milestone discount applies to the combined cart.

## Open items
- Discount tiers: milestones chosen for now. The live store's Buy 2 → 5% / Buy 3 → 10% (and the "Buy 2 get 5% OFF" announcement text) are not implemented.
