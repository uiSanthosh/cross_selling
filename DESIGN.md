# DESIGN.md — pdp-site

Design system for the basil Bento Lite - Frozen PDP. Source of truth is `styles.css`; if this file and the CSS disagree, fix whichever is wrong.

## Implementation (target stack)
Built with Next.js, Tailwind CSS and shadcn/ui; icons from Lucide React; motion from Framer Motion. Put the colour tokens below in the Tailwind theme (and shadcn CSS variables) and load Parkinsans via `next/font`. Style shadcn components to match the components section rather than their defaults. The values below come from the legacy `styles.css`.

## Brand feel
Playful, bright and family-friendly: lime and cobalt blue on a warm cream background, rounded shapes, bold friendly type. Emoji are used sparingly in promo copy (🔥, 🩵).

## Colour tokens (`:root` in `styles.css`)
| Token | Value | Use |
|---|---|---|
| `--ink` | `#1a332e` | Body text, borders, active outlines |
| `--muted` | `#545555` | Secondary text, struck-through MRP |
| `--cream` | `#fdfff1` | Page background |
| `--lime` | `#c8e616` | Nav bar |
| `--lime-btn` | `#d4f53a` | Primary buttons (Add to cart) |
| `--blue` | `#0033a0` | Announcement bar, nav link text |
| `--orange` | `#eb6738` | Selling price |
| `--yellow` | `#ffdc07` | Discount badge |
| `--sky` | `#d2f7ff` | "New Arrival" pill |
| `--butter` | `#f8ea8b` | Soft highlight surfaces |

Never hard-code a new brand colour; add a token first.

## Typography
- Family: **Parkinsans**, weights 400, 500, 600, 700, fallback `system-ui, sans-serif`.
- Section titles (`.sec-title`): 40/48px, 600, centred.
- Product title (h1): 32/40px, 700.
- Subtitle: 18/24px, `--muted`.
- Price: 30/40px, 700, `--orange`; MRP 20px struck through in `--muted`.
- Body and labels: 14 to 16px. Pills and badges: 12 to 14px, 600, uppercase.

## Layout
- Hero grid on desktop: `92px` thumbnails, `672px` main image, up to `556px` buy box, `24px` gap, centred, max width `1440px`, side padding `36px`.
- Nav: 72px tall, sticky, `z-index: 20`. Announcement bar: ~35px, marquee under 1500px wide, static and centred above that.
- Main gallery image 672x621, `object-fit: cover`.

## Shape and spacing
- Radii: cards and images 12 to 16px, pills and buttons fully rounded (32 to 64px), swatches 12px.
- Buy box vertical gap: 16px. Pills gap: 12px.
- Borders: 1px `--ink` for controls; `rgba(0,0,0,.15)` for cards such as the bundle box.

## Components
- **Primary button** (`.add-btn`, `.buy-now`): `--lime-btn` fill, 1px `--ink` border, pill radius, 20px/700 text, lifts 1px on hover.
- **Quantity stepper** (`.qty`): white pill, 126x55, `-` and `+` buttons, hover `#f1f4e0`. Range 1 to 10.
- **Swatch** (`.swatch`): 72px tile, 60px rounded image, 1px `--ink` border when active.
- **Pills** (`.pill`): 32px tall; rating has a `#ffc844` outline, "New" uses `--sky`, discount uses `--yellow`.
- **Thumbnails**: 92px squares, 2px `--ink` border when active, bottom fade to `--cream`.
- **Bundle card** ("Pack the morning, not just the box"): bordered card with progress bar (`#e0ecdf` track), selectable mini cards, running total and savings.
- **Product card** (`.pcard`): image, rating pill, name, description, price row (price, MRP, % off), Add to Cart.
- **Cart drawer**: slide-in from the side with milestone progress, upsell strip, order summary and savings ribbon.
- **Toast** (`#toast`): `role="status"`, `aria-live="polite"`.

## Imagery
- Product shots: `assets/main-raw*.png` (main) and `assets/thumb-raw*.png` (thumbnails). Icons are small SVGs.
- Decorative images use `alt=""`; meaningful images get descriptive alt text. Always set `width`/`height` on icons.

## Motion
- Subtle only: marquee on the announcement bar, 0.15s button lift, drawer slide. Framer Motion is for subtle transitions and micro-interactions (progress fill, price change, add-on select), never decorative flourishes.
- Everything animated must respect `prefers-reduced-motion: reduce` (e.g. Framer Motion `useReducedMotion`).

## Accessibility
- Maintain readable contrast of `--ink` on `--cream`/`--lime`; check any new colour pairing.
- Icon-only buttons need `aria-label`; custom controls need `role`, `tabindex`, keyboard handling and `aria-pressed`/`aria-selected` state.
- Visible focus states must not be removed.

## Responsive
- Desktop layout above is fixed-width; check narrow widths when editing and keep a 16px minimum side gutter on mobile with no horizontal page scroll.
