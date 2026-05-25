# Frame Club Codebase Refactor

## Context

The codebase has accumulated structural debt: components built but never wired in, duplicate utilities copied across three files, orphaned dead code, and the homepage inlining 385 lines of JSX despite matching section components existing in `/components/home/`. This refactor connects those pieces, removes duplication, and activates the SiteLoader and page transitions that were built but never mounted.

---

## Phase 1 — Dead Code Deletion (zero risk)

**Delete these files — confirmed zero imports anywhere in the codebase:**

- `src/components/shared/card-reveal.tsx`
- `src/hooks/use-mobile.ts`

No import updates needed.

---

## Phase 2 — Extract `isNonEmpty` to `lib/utils.ts`

The same function is copy-pasted identically in 3 API route files.

**Step 2.1** — Append to `src/lib/utils.ts` (after existing `cn()` export):
```ts
export function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
```

**Step 2.2** — Update the 3 API routes to import from utils:
- `src/app/api/orders/route.ts` — remove local declaration, add `import { isNonEmpty } from "@/lib/utils";`
- `src/app/api/contact/route.ts` — same
- `src/app/api/notify/route.ts` — same

---

## Phase 3 — Standardize GSAP Imports

All client components that need `gsap` + `ScrollTrigger` should import from `@/lib/gsap-config`. Providers (`gsap-provider.tsx`, `smooth-scroll-provider.tsx`) are exempt — they are the registration root.

**Files to update:**

- `src/components/shared/page-scroll-animations.tsx`  
  Replace `import gsap from "gsap"` + `from "gsap/ScrollTrigger"` → `import { gsap, ScrollTrigger } from "@/lib/gsap-config";`

- `src/components/layout/site-header.tsx`  
  Replace `import { gsap } from "gsap"` + `from "gsap/ScrollTrigger"` → `import { gsap, ScrollTrigger } from "@/lib/gsap-config";`  
  Keep `import { ScrollSmoother } from "gsap/ScrollSmoother"` — not exported from gsap-config.

- `src/components/home/home-animations.tsx`  
  Replace `import gsap from "gsap"` + `from "gsap/ScrollTrigger"` → `import { gsap, ScrollTrigger } from "@/lib/gsap-config";`  
  Keep `ScrambleTextPlugin` and `SplitText` imports from their direct paths.

---

## Phase 4 — Merge Supabase Clients (medium risk — test after)

`src/lib/supabase/admin.ts` and `src/lib/supabase/server.ts` both export service-role clients. `server.ts`'s `createServiceClient()` is the better implementation (includes `auth: { autoRefreshToken: false, persistSession: false }`).

**Step 4.1** — `src/lib/services.ts`:
- Replace `import { createAdminClient } from "@/lib/supabase/admin"` → `import { createServiceClient } from "@/lib/supabase/server"`
- At the 4 call-sites (~lines 146, 159, 171, 205): `createAdminClient()` → `await createServiceClient()` (note: `createServiceClient` is async)

**Step 4.2** — `src/app/admin/actions.ts`:
- Replace the `admin` import → `import { createServiceClient } from "@/lib/supabase/server"`
- Lines ~10 and ~44: `createAdminClient()` → `await createServiceClient()`

**Step 4.3** — Delete `src/lib/supabase/admin.ts` after confirming no remaining imports.

**Test:** Admin order status updates, admin product status toggles, and the public ordering flow.

---

## Phase 5 — Activate SiteLoader + TransitionProvider in Root Layout

Both components exist but are never mounted. `SiteLoader` is a first-visit cinematic boot screen. `TransitionProvider` provides the page wipe context and overlay (used by `TransitionLink` in the footer).

**Update `src/app/layout.tsx`** — add two imports and update the body:

```tsx
import { SiteLoader } from "@/components/layout/site-loader";
import { TransitionProvider } from "@/components/layout/page-transition";

// Inside <body>:
<GSAPProvider>
  <TransitionProvider>
    <SiteLoader />
    <SiteHeader />
    <SmoothScrollProvider>{children}</SmoothScrollProvider>
  </TransitionProvider>
</GSAPProvider>
```

**Ordering rationale:**
- `GSAPProvider` stays outermost — plugin registration must run before any animated component mounts
- `TransitionProvider` wraps everything so its overlay (`z-[80]`) is in the stacking context
- `SiteLoader` at `z-[100]` sits above the transition overlay — the wipe should not fire during the loader
- `SiteHeader` position unchanged (renders after `SiteLoader` in DOM order, floats via `fixed position`)

---

## Phase 6 — Refactor `page.tsx` to Import Home Section Components

`src/app/page.tsx` is ~385 lines of inlined section JSX. Six matching components exist in `components/home/` but are never imported.

**Section-to-component mapping:**

| Section | Component | Props |
|---------|-----------|-------|
| Hero | No component — keep inline | Tightly coupled to HomeAnimations animation targets |
| What Is This | `WhatIsThisSection` | none (content hardcoded) |
| How It Works | `HowItWorksSection` | none (steps array internal) |
| Featured Collection | `FeaturedCollectionSection` | `products: Product[]` |
| Customisation | `CustomisationSection` | none |
| Social Proof | `SocialProofSection` | `testimonials: Testimonial[]` |
| Final CTA | `FinalCTASection` | none |

**Key structural constraints:**
- Each component renders the **inner div only**. The outer `<section>` wrapper with background/padding stays in page.tsx.
- Exception: `FinalCTASection` — do NOT add an extra `frame-container` div; its inner div already provides it.
- Move the static `testimonials` array to module scope (above the async function).
- Remove now-unused lucide-react icon imports after extraction.

**page.tsx target shape (~80 lines):**
```tsx
export default async function Home() {
  const featuredProducts = (await getProducts()).slice(0, 3);
  return (
    <>
      <main className="pb-0 pt-30">
        <HomeAnimations>
          <section data-animate-section="hero" ...>{/* hero inline */}</section>
          <section data-animate-section="not-a-poster" ...><WhatIsThisSection /></section>
          <section data-animate-section="three-steps" ...><div className="frame-container"><HowItWorksSection /></div></section>
          <section id="collection-section" ...><div className="frame-container"><FeaturedCollectionSection products={featuredProducts} /></div></section>
          <section data-animate-section="customisation" ...><div className="frame-container"><CustomisationSection /></div></section>
          <section data-animate-section="social-proof" ...><div className="frame-container"><SocialProofSection testimonials={testimonials} /></div></section>
          <section data-animate-section="final-cta" ...><FinalCTASection /></section>
        </HomeAnimations>
      </main>
      <SiteFooter />
    </>
  );
}
```

---

## Phase 7 — Optional Follow-ups (separate commits)

- **`AdminErrorFallback` component** — extract the copy-pasted error UI from `app/admin/page.tsx` and `app/admin/orders/page.tsx` into `src/components/admin/admin-error-fallback.tsx` with a `message` prop.
- **`mock-data.ts` comment** — add a file-level comment `// Test fixture only — do not import in production code` to prevent accidental production use.
- **`isActive` pathname helper** — the two implementations in `site-header.tsx` and `admin/layout.tsx` differ enough that extraction isn't straightforward. Defer.

---

## Execution Order

| Phase | Risk | Notes |
|-------|------|-------|
| 1 — Delete dead files | None | Start here |
| 2 — Extract isNonEmpty | Very low | |
| 3 — GSAP import normalization | Low | |
| 4 — Merge Supabase clients | Medium | Commit separately, test admin + orders |
| 5 — Activate SiteLoader/TransitionProvider | Low | |
| 6 — Refactor page.tsx | Medium | Verify homepage visually after |
| 7 — Optional follow-ups | Low | Separate commits |

---

## Files Changed

| File | Action |
|------|--------|
| `src/components/shared/card-reveal.tsx` | Delete |
| `src/hooks/use-mobile.ts` | Delete |
| `src/lib/supabase/admin.ts` | Delete (after Phase 4) |
| `src/lib/utils.ts` | Add `isNonEmpty` export |
| `src/app/api/orders/route.ts` | Use shared `isNonEmpty` |
| `src/app/api/contact/route.ts` | Use shared `isNonEmpty` |
| `src/app/api/notify/route.ts` | Use shared `isNonEmpty` |
| `src/components/shared/page-scroll-animations.tsx` | Normalize GSAP imports |
| `src/components/layout/site-header.tsx` | Normalize GSAP imports |
| `src/components/home/home-animations.tsx` | Normalize GSAP imports |
| `src/lib/services.ts` | Swap `createAdminClient` → `createServiceClient` |
| `src/app/admin/actions.ts` | Swap `createAdminClient` → `createServiceClient` |
| `src/app/layout.tsx` | Mount `SiteLoader` + `TransitionProvider` |
| `src/app/page.tsx` | Import home section components |

---

## Verification Checklist

1. `npm run build` — zero TypeScript errors
2. `/` homepage — all 7 sections render; SiteLoader plays on first visit; page transitions fire on nav links
3. `/shop` — products render, filters work
4. `/admin` — stats load, order status dropdown works, product status toggle works
5. `npm test` — copy-contracts and shop-card-semantics tests pass

---

---

# Phase 2 Refactor — Full Codebase Audit (April 2026)

Deep audit of API routes, lib, components, and pages. 28 tasks across 4 phases.

---

## Phase A — Correctness & Security

| # | What | File(s) | Change |
|---|------|---------|--------|
| A1 | Catch thrown exceptions in contact/notify routes | `api/contact/route.ts`, `api/notify/route.ts` | Wrap service calls in try/catch, return `fail("INTERNAL_ERROR", ..., 500)` |
| A2 | Shared admin auth guard | `app/admin/actions.ts`, `api/orders/[id]/route.ts` | Extract `assertAdminSession` to `src/lib/auth/assert-admin-session.ts` (no `use server`). Import in both. |
| A3 | Remove PayFast dev guard | `lib/payment/payfast.ts:19` | Delete `if (process.env.NODE_ENV !== 'production') return` |
| A4 | ADMIN_EMAIL missing → throw | `lib/emails/send.ts:11` | Remove hardcoded `"admin@frameclub.pk"` fallback; throw if unset |
| A5 | Admin middleware dev bypass | `lib/supabase/middleware.ts:53` | Remove `process.env.NODE_ENV === 'production' &&` guard |
| A6 | Structured webhook email log | `api/payfast/webhook/route.ts:97` | Replace `.catch(console.error)` with structured log including `orderId` |
| A7 | Use `getProductBySlug` in admin action | `app/admin/actions.ts:52-58` | Replace raw Supabase query with shared `getProductBySlug(productSlug)` |
| A8 | Standardize error handling in `data.ts` | `lib/shop/data.ts` | Remove swallowing try/catch in `getProducts`; let it throw like `getRelatedProducts` |

---

## Phase B — Code Deduplication

| # | What | File(s) | Change |
|---|------|---------|--------|
| B1 | Centralize nav items | `site-header.tsx`, `site-footer.tsx` | Create `lib/content/nav-constants.ts`, export `NAV_ITEMS`/`MOBILE_NAV_ITEMS`/`FOOTER_NAV_ITEMS` |
| B2 | Move `isActive` to utils | `site-header.tsx:35`, `admin/layout.tsx:40` | Export `isPrefixActive` + `isExactActive` from `lib/utils.ts` |
| B3 | Shared `statusLabels` | `lib/emails/send.ts:41-47` | Create `lib/db/labels.ts`, export `ORDER_STATUS_LABELS` |
| B4 | Export status parsers | `lib/db/services.ts:58-76` | Add `export` to `parsePaymentStatus` and `parseOrderStatus` |
| B5 | Rename browser Supabase export | `lib/supabase/client.ts` + all callers | Rename `createClient` → `createBrowserClient` to eliminate name collision with server export |
| B6 | Extract `parseJsonBody` helper | `lib/http/api-envelope.ts` + 3 routes | Add `parseJsonBody<T>(request)` utility; replace inline `.json().catch()` in orders/contact/notify routes |

---

## Phase C — Component Extraction

| # | What | Extract from | Extract to |
|---|------|-------------|-----------|
| C1 | `CheckoutSummary` | `checkout-form.tsx:229-273` | `components/checkout/checkout-summary.tsx` |
| C2 | Header animation hooks + `HamburgerIcon` | `site-header.tsx` (351 lines) | `components/layout/hooks/use-header-intro-animation.ts`, `use-header-scroll-animation.ts` |
| C3 | Admin dashboard sub-components | `app/admin/page.tsx` (212 lines) | `components/admin/stats-row.tsx`, `components/admin/live-order-pipeline.tsx` |
| C4 | Product detail sub-components | `app/shop/[slug]/page.tsx` (249 lines) | `components/shop/product-detail-form.tsx`, `components/shop/related-products-section.tsx` |

---

## Phase D — Design System Compliance

| # | What | File(s) | Change |
|---|------|---------|--------|
| D1 | `<select>` → `<Select>` in toolbar | `components/shop/catalog-toolbar.tsx:66-104` | Replace 3 native selects with branded Select component + hidden inputs for form compat |
| D2 | Raw `<label>` → `<Label>` | `shop/[slug]/page.tsx:128`, `contact-form.tsx:124,139,154` | Replace 4 raw labels with branded `Label` component |
| D3 | Raw `<button>` → `<Button>` | `fullscreen-nav.tsx:138` | Replace close button with `<Button variant="ghost" size="icon">` |
| D4 | Inline price format → `formatPkr` | `featured-collection-section.tsx:191`, `catalog-product-card.tsx:54` | Import and call `formatPkr` instead of inline template literal |
| D5 | Inline CTA → `AnimatedCTALink` | `about/page.tsx:182` | Replace manual `TransitionLink` + brand classes with `<AnimatedCTALink href="/shop">` |
| D6 | Add Badge variants, replace inline divs | `ui/badge.tsx`, `order/[id]/page.tsx:50-55` | Add `success`/`failed` variants; replace 2 inline badge divs |
| D7 | Consolidate `ProductCardCTA` | `featured-collection-section.tsx:212-231` | Delete private component; replace with `<Button variant="outline">` + `AnimatedCTALink` render prop |
| D8 | Spelling: "customisation" → "customization" | Throughout | Rename files, display strings, variable names (not DB columns) |
| D9 | Progress bar color token | `admin/page.tsx:79` | `bg-text-accent` → `bg-brand-bright` |

---

## Sequencing

```
Phase A (all) → Phase B (all) → Phase C and D in parallel

Within Phase B:
  B1 before C2 (both touch site-header.tsx)
  B5 before any Phase C file moves
```

## Verification

After each phase: `pnpm build` must pass with 0 type errors.
Spot-check: `/`, `/shop`, `/shop/[slug]`, `/checkout`, `/admin`.
Phase A: test with `ADMIN_EMAIL` unset — middleware must block, email send must throw.
Phase D: inspect Select dropdowns on mobile — OS-native appearance must be gone.
