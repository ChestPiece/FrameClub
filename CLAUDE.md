# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Next.js dev server (uses --webpack flag)
npm run build    # Production build
npm run test     # Run all tests (Vitest)
npx vitest run src/__tests__/services.test.ts  # Run a single test file
```

## Architecture

**Stack:** Next.js 16 (App Router) · React 19 · Supabase (DB + Auth) · Tailwind v4 · GSAP · Vitest

**Key lib modules** (`src/lib/`):
- `db/services.ts` — all Supabase queries (products, orders, contact, notify). The single DB access layer.
- `db/types.ts` — shared TypeScript types for DB records
- `supabase/server.ts` / `supabase/client.ts` — Supabase client factories (server uses SSR cookies)
- `payment/payfast.ts` — PayFast signature generation and webhook verification
- `payment/order-access-token.ts` — JWT signing for order confirmation links (`ORDER_ACCESS_TOKEN_SECRET`)
- `auth/assert-admin-session.ts` — throws redirect if no admin session; call at top of admin Server Components
- `animation/gsap-config.ts` — GSAP defaults; all animations go through providers in `components/providers/`
- `content/copy-constants.ts` — locked copy strings; never rewrite these inline

**Routing:** All pages are Server Components by default. Client components are co-located (`*-animations.tsx`, `*-form.tsx` suffixes). Admin pages at `/admin/*` are protected via `assert-admin-session`.

**Data flow:** Server Components call `services.ts` → pass data as props to Client Components. No API routes for reads — only for writes (`/api/orders`, `/api/payfast/webhook`, `/api/contact`, `/api/notify`).

**Animation system:** GSAP + ScrollTrigger. Providers wrap the app (`gsap-provider.tsx`, `smooth-scroll-provider.tsx`). Animations are scoped to component files (`home-animations.tsx`, `shop-animations.tsx`, etc.) and initialized inside `useGSAP` hooks.

## Design System — Non-Negotiables

- **0px border radius everywhere** — `tailwind.config` sets all radius to `0px`
- Backgrounds only from: `#141313` `#0E0E0E` `#1C1B1B` `#2A2A2A` `#353434` — no white, no light grays
- Red (`--brand #380306`, `--brand-mid #8E130C`, `--brand-bright #C0392B`) is accent only — not section fills
- Typography: `font-display` (Bebas Neue) for headlines, `font-body` (Inter) for everything else
- All shadcn/ui components are overridden in `src/components/ui/` — never ship defaults

## Business Rules

- One product, one price: Rs. 5,000. No discounts, no variants.
- All orders made-to-order. No inventory/stock logic.
- Payment upfront via PayFast only. No COD.
- Product status (`available` / `preorder` / `unavailable`) drives CTA and badge — controlled from admin dashboard without deploys.
- Keychains are planned but not launched — do not build anything for them.
