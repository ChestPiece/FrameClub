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

Vitest config uses jsdom + `@testing-library/react`. Single-file runs are the fastest feedback loop — prefer them over the full suite while iterating.

## Stack

Next.js 16 (App Router, `--webpack`) · React 19 · Supabase (`@supabase/ssr` + `@supabase/supabase-js`) · Tailwind v4 (`@tailwindcss/postcss`) · GSAP 3 + `@gsap/react` · Anime.js 4 · Base UI (`@base-ui/react`) + shadcn overrides · Zod 4 · react-hook-form 7 · Resend · Vitest 4.

## Library Layout (`src/lib/`)

- `db/services.ts` — single Supabase access layer. All product, order, contact, notify queries live here. No component talks to Supabase directly.
- `db/types.ts` — shared DB record types.
- `db/labels.ts` — display labels for enum-ish DB values.
- `supabase/server.ts` / `client.ts` / `middleware.ts` — client factories. Server uses SSR cookies; middleware handles session refresh.
- `supabase/database.types.ts` — generated types. Do not hand-edit.
- `auth/admin.ts` + `auth/assert-admin-session.ts` — admin gate. Call `assertAdminSession()` at top of every `/admin/*` Server Component; it throws a redirect when no session.
- `payment/payfast.ts` — PayFast signature build + webhook signature verify.
- `payment/order-access-token.ts` — JWT signer for `/order/[id]` confirmation links. Secret: `ORDER_ACCESS_TOKEN_SECRET`.
- `payment/index.ts` — barrel re-export.
- `emails/send.ts` — Resend wrapper. Init is deferred (lazy) so build does not require `RESEND_API_KEY`.
- `emails/templates.ts` — transactional email HTML.
- `http/api-envelope.ts` — `{ ok, data | error }` response shape used by every `/api/*` route.
- `shop/catalog.ts` / `shop/data.ts` / `shop/diecast-assets.ts` — product catalog helpers + placeholder image map.
- `content/copy-constants.ts` — locked marketing copy. Do not rewrite inline; import the constant.
- `content/nav-constants.ts` — `MOBILE_NAV_ITEMS`, `DESKTOP_NAV_ITEMS`.
- `animation/gsap-config.ts` — GSAP defaults (ease, duration). All GSAP usage goes through this.
- `animation/anime-config.ts` — Anime.js defaults.
- `animation/button-motion.ts` — button hover/press primitive driven by `ButtonMotionProvider`.
- `animation/motion-hooks.ts` / `motion-primitives.ts` — reusable scroll + entrance primitives.
- `animation/scroll-layout.ts` / `scroll-trigger-refresh.ts` / `wait-for-layout-stable.ts` — ScrollTrigger lifecycle helpers; refresh after layout settles to avoid stale measurements.
- `animation/scroll-to-collection.ts` — used by mobile `?section=collection` deep link.

## Routing

All pages are Server Components by default. Client components co-located with `*-animations.tsx`, `*-form.tsx`, `*-client.tsx` suffixes.

Public pages: `/`, `/about`, `/shop`, `/shop/[slug]`, `/checkout`, `/order/[id]`, `/contact`.
Admin pages: `/admin`, `/admin/login`, `/admin/orders`, `/admin/products`. Every admin page calls `assertAdminSession()` first.

API routes (writes only — reads go through Server Components):
- `POST /api/orders` — create order, return PayFast redirect.
- `GET  /api/orders/[id]` — order detail, JWT-gated.
- `POST /api/payfast/webhook` — verify signature, mark order paid, fire email.
- `POST /api/contact` — contact form submit.
- `POST /api/notify` — notify-me subscription for `unavailable` products.

## Data Flow

Server Component → `db/services.ts` → Supabase → props to Client Component. Never call Supabase from a Client Component. Mutations always go through `/api/*` with Zod-validated bodies and the `api-envelope` shape.

## Animation System

GSAP + ScrollTrigger is primary; Anime.js used for button/micro-interactions. Providers in `src/components/providers/`:
- `gsap-provider.tsx` — registers plugins, sets defaults from `gsap-config.ts`.
- `smooth-scroll-provider.tsx` — wraps the app with smooth scroll.
- `button-motion-provider.tsx` — shared button motion context consumed by `components/ui/button.tsx`.

Page-level animations live in component files (`home-animations.tsx`, `shop-animations.tsx`, …) and run inside `useGSAP` so cleanup is automatic. After any layout-affecting state change, call `scroll-trigger-refresh` after `wait-for-layout-stable` — measuring too early causes pin/snap drift.

## Design System — Non-Negotiables

- **0px border radius everywhere.** `tailwind.config` sets all radius tokens to `0px`. No rounded corners ever.
- **Backgrounds:** only `#141313` `#0E0E0E` `#1C1B1B` `#2A2A2A` `#353434`. No white. No light grays.
- **Red (accent only):** `--brand #380306` · `--brand-mid #8E130C` · `--brand-bright #C0392B`. Never use as section fill.
- **Typography:** `font-display` (Bebas Neue) for headlines, `font-body` (Inter) for everything else. No third family.
- **shadcn/Base UI:** every primitive in `src/components/ui/` is a custom override. Never ship defaults. Match radius, color, and motion rules above.
- **Copy:** import from `content/copy-constants.ts`. Never rewrite marketing strings inline.

## Business Rules

- One product line, one price: **Rs. 5,000**. No discounts, no variants beyond the configurator background choice.
- All orders **made-to-order**. No inventory, no stock counters, no SKU logic.
- Payment **upfront via PayFast only**. No COD. No Stripe. No alternative gateways.
- Product `status` enum drives CTA + badge:
  - `available` → "Add to Order · {price}" (submit)
  - `preorder` → "Reserve · {price}" (submit)
  - `unavailable` → "Notify Me When Available" → `/contact?intent=notify&product={slug}`
- `unavailable` hides configurator + qty stepper entirely (`product-detail-form.tsx`).
- Status flips live from `/admin/products`. No deploy needed.
- **Keychains** are planned but not launched. Build nothing for them yet.

## Codebase Truths (verified — assume before assuming "bug")

- **No cart.** No `/cart` page, no cart store (no context/zustand/localStorage). `cartCount` is a `SiteHeader` prop defaulting to `0`. Checkout is direct via URL query params: `/checkout?slug=...&background=...`. Intentional.
- **Placeholder product images.** All products share 3 diecast shots via `shop/diecast-assets.ts → productDiecastImages()`. `data.ts:17` flags it as temporary pending real photography. Not a bug.
- **Splash screen fires once per session** via `window.__frameClubLoaderDone` (`SITE_LOADER_DONE_FLAG`). Does NOT replay on client-side navigation. Duration ~1.4s. See `components/layout/site-loader.tsx`.
- **Mobile nav** hardcodes `/?section=collection` for "Explore". `HomeSectionScroll` reads param → `scrollToCollectionSection()` → `history.replaceState` back to `/`. Mobile cannot JS-scroll the same way desktop nav does.
- **Notify-me flow:** `/contact?intent=notify&product={slug}` → `ContactForm` sees `intentIsNotify` → email-only form → `POST /api/notify` → `notify_subscriptions` table.
- **Spec data:** `products.specs` is JSONB `Array<{label, value}>`. `findSpec()` does substring match on `label`. Known key aliases in code: `["torque"]`, `["0-100","0–100","0 to 100","acceleration"]`, `["power","hp"]`, `["top speed","speed"]`.

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — client.
- `SUPABASE_SERVICE_ROLE_KEY` — server-only writes (admin, webhook).
- `ORDER_ACCESS_TOKEN_SECRET` — JWT signing for order links.
- `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE`, `PAYFAST_MODE` (`sandbox`/`live`).
- `RESEND_API_KEY` — lazy-loaded; missing key does not break build.
- `NEXT_PUBLIC_SITE_URL` — used in PayFast return URLs + email links.

## Conventions

- Server Component is default. Add `"use client"` only when you need event handlers, refs, or browser APIs.
- All form validation: Zod schema in the route handler, parsed before any DB call.
- All API responses: `{ ok: true, data }` or `{ ok: false, error }` from `http/api-envelope.ts`.
- TypeScript strict. No `any` without a `// reason:` comment.
- Tests live in `src/__tests__/`. Mirror filename of subject when reasonable.
- File naming: kebab-case for files and folders. Component file exports a single default-or-named component matching the filename.
- Imports: use `@/` alias for `src/`. No deep relative chains (`../../..`).
- Never introduce a new top-level dependency without checking whether an existing one covers it (Anime.js vs GSAP, Base UI vs shadcn, Zod vs hand-rolled validation).

## Supabase Tables (high level)

- `products` — `slug`, `name`, `price`, `status` (`available|preorder|unavailable`), `specs` JSONB.
- `orders` — `id`, `product_slug`, `background`, `customer_*`, `status` (`pending|paid|failed`), `payfast_*` fields, `created_at`.
- `contact_messages` — `name`, `email`, `message`, `created_at`.
- `notify_subscriptions` — `email`, `product_slug`, `created_at`.

Writes from server only (service-role key). RLS expected to deny anon writes — verify before assuming a client write will land.

## PayFast Flow (end to end)

1. User submits `/checkout` form → `POST /api/orders` creates a `pending` order, returns PayFast redirect URL + signed fields.
2. Browser auto-posts to PayFast hosted page.
3. PayFast → user back to `return_url` (`/order/[id]?token=...`); JWT from `order-access-token.ts` gates the page.
4. PayFast → `POST /api/payfast/webhook` server-to-server. Verify signature via `payment/payfast.ts`, then flip order to `paid` and send confirmation email through Resend.
5. Sandbox vs live driven by `PAYFAST_MODE`. Never trust webhook payload without signature verify — webhook is the source of truth, not the return URL.

## Common Tasks

- **Add a product field:** migrate `products` table → regenerate `database.types.ts` → expose via `db/services.ts` → render in `components/product/`. Do not bypass the service layer.
- **Change a CTA label or marketing copy:** edit `content/copy-constants.ts`. Never inline.
- **Add an admin screen:** create `src/app/admin/<name>/page.tsx`, call `assertAdminSession()` first line, render Server Component, fetch via `db/services.ts`.
- **Add an API write:** create `src/app/api/<name>/route.ts`, validate with Zod, wrap response in `apiEnvelope`, use server Supabase client with service-role.
- **Add an animation:** define defaults in `animation/gsap-config.ts` if reusable, otherwise scope inside a `useGSAP` hook in the component's `*-animations.tsx` file.

## Gotchas

- `next dev --webpack` is intentional — Turbopack flag is not used here. Do not "fix" it.
- Resend init is deferred; missing `RESEND_API_KEY` will not crash the build but will throw at first send. Guard local dev accordingly.
- ScrollTrigger pin/snap drifts if measured before layout is stable. Always go through `wait-for-layout-stable` + `scroll-trigger-refresh`.
- Splash flag is per-session — to retest, hard reload or clear `window.__frameClubLoaderDone`.
- Order confirmation URL token is single-secret JWT; rotating `ORDER_ACCESS_TOKEN_SECRET` invalidates every existing link.
- Do not add a cart. The product is direct-to-checkout by design.

## Memory & Context

User-level auto-memory lives outside the repo (see `~/.claude/projects/.../memory/`). Project facts that change frequently belong there, not in this file. This file is the durable, repo-checked-in source of truth — keep it stable across sessions.

## When in Doubt

- Read `node_modules/next/dist/docs/` before assuming Next.js API shape — version 16 has breaking changes from training data (see `AGENTS.md`).
- Read `db/services.ts` before writing any new Supabase query — a helper likely exists.
- Read `content/copy-constants.ts` before writing user-facing strings.
- Read `components/ui/` before reaching for a shadcn primitive — overrides may already exist.
- Run `npm run test` against the touched area before reporting a task done; UI changes also need a browser check.
