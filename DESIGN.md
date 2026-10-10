# 24 GYO — implemented design

## Overview

24 GYO is a Turkish real-estate discovery and enquiry site for people exploring homes, villas and commercial space. The implemented direction uses architectural photography, deep navy, warm off-white, quiet borders and generous section spacing. A large photographic introduction leads into a floating search form and an orderly property grid. Services, company purpose and contact follow in that order.

The system lives in `src/styles.css`. Page composition/state lives in `src/App.tsx`; reusable property, dialog, form and icon components are in `src/components/`. This document describes the delivered source, not a proposed redesign. The inventory and company copy are demonstration content, clearly distinguished from verified company facts.

## Colors

Hex values are the canonical notation. Semantic tokens point at primitives where shared. The delivered site has one light theme with a navy contact section, not a separate dark mode.

| Semantic token | Resolved value | Implemented job |
| --- | --- | --- |
| `--color-bg` | `#fcfcfa` | Warm page/form background |
| `--color-surface` | `#ffffff` | Search panel, cards, controls |
| `--color-surface-soft` | `#edf1f3` | Services, empty state, neutral hover |
| `--color-text`, `--color-accent` | `#152d43` | Navy text / primary fills |
| `--color-accent-hover` | `#244961` | Filled action hover |
| `--color-text-muted` | `#586874` | Supporting copy and metadata |
| `--color-text-inverse` | `#ffffff` | Text on navy |
| `--color-text-inverse-muted` | `#c5d0d9` | Supporting contact copy |
| `--color-border` | `#dce1e4` | Structural separators and card edges |
| `--color-input-border` | `#84909a` | Input boundaries |
| `--color-focus` | `#146fbd` | 2px focus outline, offset 4px |
| `--color-error` | `#a02f31` | Invalid fields and corrective copy |
| `--color-success`, `--color-success-bg` | `#245f47`, `#f0f7f1` | Prepared enquiry state |

The hero also uses image-specific colors: `#e4eaf0` for supporting text, `#cbdce8` for its final headline line and a navy alpha gradient over the actual photograph. At ≤650px its stops are `#0e243bf2`, `#0e243bd9` at 45%, and `#0e243ba6`. These stronger mobile stops maintain contrast against the cropped bright building. The hero fallback background is `--navy-950: #102538`.

Measured rendered solid pairs: muted copy on services 5.07:1; muted card metadata on white 5.76:1; white on primary navy 14.11:1; secondary contact text on navy 9.00:1. Image-background measurements and their sampling limits are recorded in `artifacts/validation.md`. A new photograph requires a new contrast review.

## Typography

One family: **Manrope Variable**, followed by `Manrope, Arial, sans-serif`. `src/fonts.css` loads the local Latin and Latin Extended WOFF2 subsets through `@fontsource-variable/manrope`. They cover Turkish and the lira sign, have a 200–800 normal weight axis, and use `font-display: swap`. No italic face is requested. `font-synthesis: none` prevents invented faces. The intended fonts were observed loaded in Chromium.

| Role | Final sizing/weight/leading |
| --- | --- |
| Hero `h1` | `--text-hero: clamp(2.75rem, 4.7vw, 4.25rem)`, 450, 1.12, −.055em tracking; mobile `clamp(2.6rem, 9.8vw, 3.7rem)` / 1.14 |
| Section `h2` | `--text-h2: clamp(1.875rem, 3.1vw, 2.75rem)`, 500, 1.22, −.045em; component/mobile overrides in CSS |
| Property title | 18px, 600, 1.5, −.03em; 17px at intermediate width, 18px on mobile |
| Service title | 21px, 550; 23px on mobile |
| Dialog heading | 30px / 1.3; 25px on mobile |
| Body | About 16px / 1.9; services 15px / 1.9 desktop; compact copy 12–15px according to component |
| Buttons | `--text-sm: .8125rem` (13px), 600, 1.5 |
| Eyebrow | 11px, 650, .17em tracking, uppercase through CSS; 9–10px in compact hero/form treatments |
| Inputs | 14px desktop; every text input/select/textarea 16px at ≤650px |
| Prices | 22px / 600; 28px in dialog; tabular numerals, `Intl.NumberFormat('tr-TR')` |

Headings balance lines; paragraphs use pretty wrapping. Prose measures are bounded (about 38–55ch in most components). Property titles are not truncated. The hero has intentional line breaks. Brand descriptor and decorative photo credits use smaller display lettering; they are not primary instructions. Token declarations also expose small/base/body/card sizes; actual component overrides are authoritative. Body text remains selectable.

## Layout

`.container` defines the shared alignment edge: maximum 1240px, initially `calc(100% - 112px)`. `.section-pad` uses 96px vertical spacing. The source declares a 4/8/12/16/24/32/48/64/96px spacing scale; individual components use explicit matching values plus optical adjustments. Nested content generally uses 12–24px gaps, with 32px or more between larger groups.

| Breakpoint | Actual layout behavior |
| --- | --- |
| >1150px | Three property columns; four search columns; two-column About/Contact; full desktop menu and contact CTA |
| ≤1150px | Container gutters 36px; smaller card gaps; search icons temporarily hidden; contact name/email stack |
| ≤900px | Gutters 24px; two property columns and two search columns; header contact CTA and hero caption hidden; vertical section spacing 72px |
| ≤650px | Gutters 20px; disclosure navigation; single-column search, cards, services, About and Contact; 58px section spacing; larger touch fields |
| ≤360px | Gutters 16px; About values stack; additional compact heading/card adjustments |
| ≥1500px | Hero minimum height 700px and larger top inset |

The default hero minimum height is 632px; the search overlaps its bottom by 65px. At mobile the hero minimum is 585px (563px ≤360px), search overlap 46px. Hero heights are minima so text can grow. About photographs deliberately crop with `object-fit: cover`. Property thumbnails retain a ~1.49 aspect ratio (1.46 mobile).

The sticky header has z-index 20 and a 92px desktop minimum height (78px intermediate, 74px mobile). Anchor offset is 6rem / 5rem mobile. Mobile content controls stay inset. No general horizontal-overflow hiding is used. Browser checks at 320, 390, 768, 1024 and 1440px found no horizontal page overflow. Native browser zoom and all possible viewport sizes remain unverified.

## Elevation & Depth

The site is mostly flat. Card borders describe structure; services use a tonal background. `--shadow-float` is `0 8px 30px #1025380a, 0 1px 6px #10253805` for the search and mobile navigation. Property and About images receive an inset 1px `#0000001a` outline. The hero caption is an opaque-enough navy plate over the photo. The native dialog occupies the browser top layer with `#071624b8` backdrop and 3px blur; its contents scroll within `calc(100dvh - 48px)` (24px margin mobile).

## Shapes

The recurring action radius is `--radius: 3px`. Cards/search/contact use 4px corners; inputs and small badges use 2px; the dialog uses 6px. Round 36–44px favorite/close/back-to-top controls contrast with the rectangular content surfaces. The favorite’s visible 36px circle has an extra 4px hit area. Decorative SVGs use 24-unit viewboxes, `currentColor`, 1.5px strokes, rounded ends and no independent focus target.

## Components

- **Logo / navigation** (`src/App.tsx`): custom typographic 24/GYO wordmark. Native hash links work on static hosts. Active links include an underline and `aria-current`. Mobile button exposes `aria-expanded`; opening focuses the first link, Escape closes and restores the trigger. First page control is a skip link.
- **Search form** (`src/App.tsx`): real radio group for all/sale/rental, labeled native selects for city/type/budget. Changes are drafts until “Mülk bul”; submitting filters and focuses the results heading. Switching listing type resets its draft budget. Category buttons apply immediately and expose `aria-pressed`.
- **PropertyCard** (`src/components/PropertyCard.tsx`): accepts `property`, `saved`, `onSave`, `onOpen`. Photo, title and “İncele” open details. Prices, location and attributes remain text. The favorite is a separate named toggle with a filled-heart saved state. Initial view shows three featured cards; “Tüm portföyü keşfet” exposes all six.
- **PropertyDialog** (`src/components/PropertyDialog.tsx`): native `showModal()`, labeled heading, autofocus close button, explicit Tab/Shift+Tab wrap, Escape/backdrop close and focus restoration. It locks background scroll and provides a property-specific enquiry action.
- **ContactForm** (`src/components/ContactForm.tsx`): accepts controlled `interest` and `onInterestChange`. Labels, autocomplete, required cues, `aria-invalid` and field-specific descriptions accompany errors. Submit stays enabled. First invalid field receives focus; success focuses the prepared-result panel. Changes invalidate the old draft while preserving entered contact values. Copy failure provides a download recovery path. A verified configured email enables a `mailto:` handoff. Nothing claims the enquiry was sent.
- **Icon** (`src/components/Icon.tsx`): typed `name`, optional `size`, `className`, `style`; decorative SVG, with the accessible name on its enclosing action.
- **Buttons / fields** (`src/styles.css`): `.button-primary`, `.button-outline`, `.text-button`, `.icon-button`, `.field` are shared patterns. Default, hover, keyboard focus, pressed, invalid, saved, empty and prepared-result states are implemented. There is no simulated network-loading state because no server request occurs.

Motion is only enabled under `prefers-reduced-motion: no-preference`: 150ms action color/press transitions; .96 press scale; 350ms image hover using `cubic-bezier(.2,0,0,1)`; smooth anchors. Reduced motion removes these effects. Hover styles are pointer-capability gated. Forced colors uses system outlines and borders.

## Do’s and Don’ts

- Start a new section with `.container`, `.section-pad`, a short `.eyebrow`, and a descriptive `h2`. Keep the one page `h1` and semantic order.
- Reuse `--color-*` roles. Recheck text over any changed image at desktop and narrow widths.
- Use a filled button for the immediate primary action, outlined or text actions for peers. Keep actions named for their result in Turkish.
- Add properties through the typed data model and locally bundled images; preserve explicit sample labeling until genuine data is supplied.
- Keep native controls and real links. Preserve focus, error messages and empty-state recovery when adding interactions.
- Do not introduce invented company metrics, recipient details, transaction flows, runtime remote fonts, or claims that a local draft was delivered.
- No new component library, shadow system or extra font is needed to extend these sections. Add new sections to the hash menu and preserve the shared gutters and responsive stacking.
