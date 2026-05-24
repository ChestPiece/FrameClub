# UI/UX polish — executed phase (shipped)

This document records work already merged in the Frame Club repo. It is not a backlog of future tasks.

## Scope summary

Accessibility, motion parity, checkout semantics, product-detail swatch UX, and design-token alignment with the Machined Monolith system (per `CLAUDE.md`).

## What shipped

### Home animations (`src/components/home/home-animations.tsx`)

- Intro: `gsap.matchMedia` registers both `reduceMotion` and `normal: (prefers-reduced-motion: no-preference)` so the hero intro timeline runs for typical users who do not prefer reduced motion.
- Scroll: the `reduceMotion` branch also sets `HERO_REVEAL_TARGETS` for parity with the non-reduced path.

### Checkout form (`src/components/checkout/checkout-form.tsx`)

- Fieldsets group **Contact** and **Delivery**.
- Invalid fields use `aria-invalid`, `aria-describedby`, and error regions use `role="alert"`; submit-level error has a stable id.
- Inputs include appropriate `autoComplete` values.
- Submit control uses `aria-busy` while processing.
- Copy updated to **Redirecting to PayFast…** where applicable.

### Product detail form (`src/components/shop/product-detail-form.tsx`)

- Background swatches wrapped in `fieldset` + `legend`.
- Swatches: `cursor-pointer` and transition for clearer affordance.

### Global styles (`src/app/globals.css`)

- CSS custom properties aligned to Machined Monolith tokens from `CLAUDE.md`.
- Added `--bg-highest` and `--color-bg-highest`.
- Comment documents `--bg-deep` usage for chrome.

### REFACTOR.md Phase 1–3

Items described there are already satisfied in the tree (e.g. dead files absent, `isNonEmpty` in utils, `gsap-config` imports in key files). This polish pass did not require additional refactors for those items.

## Verification checklist

- [ ] Home: with **no** “reduce reduced motion”, hero intro plays as expected; with **prefers-reduced-motion**, behavior matches the reduced branch and reveal targets stay consistent.
- [ ] Checkout: tab through form; errors announce via `role="alert"` and associate with fields via `aria-describedby`; submit shows busy state and PayFast redirect messaging.
- [ ] Product detail: swatch group is labeled by legend; swatches show pointer cursor and feel responsive to hover/focus.
- [ ] Visual: elevated surfaces use `--bg-highest` / `--color-bg-highest` where intended; chrome notes for `--bg-deep` match implementation.
- [ ] Automated: `npm run test` — 35 passed (Vitest).
- [ ] Build: full `next build` may need network for Google Fonts in CI; account for that in pipeline secrets/network policy.

## Out of scope (this pass)

No further application source changes were required for REFACTOR.md Phase 1–3 closure beyond what is already in the tree.
