# Frame Club — code review (2026-04-17)

## Post-fix summary (same day)

Critical items addressed: checkout retry requires valid `token` and failed payment only; admin routes enforce `ADMIN_EMAIL` in middleware (with prod guard when unset); `assertAdminSession` and `GET /api/orders/[id]` fail closed without `ADMIN_EMAIL`. Important: production `ORDER_ACCESS_TOKEN_SECRET` only for order tokens; webhook logs scrubbed; `assertPayfastSigningConfigured` + timing-safe PayFast signature compare; order insert retries on unique `order_number`. Deferred: HttpOnly cookie for return URL, platform rate limiting (see fix plan). Admin dashboard fake KPI percentages removed.

## Review scope

| Item | Value |
|------|--------|
| **BASE_SHA** | `57dcd35d421af00492597b1d9192d1f56e0e6ad5` (`origin/main`, matches `HEAD`) |
| **Committed diff vs main** | None (working tree at main tip) |
| **Local working tree** | 8 files (animation / home / shop / `card` / `scroll-layout`) — see [Working tree diff](#working-tree-diff-animation--home) |

## Automation (evidence)

| Check | Result |
|--------|--------|
| **`npm run lint`** | Not defined in `package.json`; used **`npx tsc --noEmit`** instead — **pass** (exit 0) |
| **`npm test`** (`vitest run`) | **35 tests passed** (includes `GET /api/orders/[id]` admin checks) |
| **`npm run build`** | **Pass** with full network (Google Fonts fetch); may fail in offline/sandboxed CI without font access or fallback |

**Merge readiness:** Critical fixes landed; set **`ORDER_ACCESS_TOKEN_SECRET`** in production before deploy.

---

## Critical

### 1. Checkout exposes full order PII by UUID (`orderId` query)

**File:** [`src/app/checkout/page.tsx`](src/app/checkout/page.tsx)

`getOrderById` uses the **service role** client ([`src/lib/db/services.ts`](src/lib/db/services.ts)) and returns name, email, phone, address, city, customization for **any** valid order UUID. There is **no** access token or session check on checkout.

**Risk:** Anyone who learns or guesses an order id can harvest customer PII and pre-fill abuse flows.

**Fix:** Require the same `verifyOrderAccessToken` (or a dedicated signed retry token) as [`src/app/order/[id]/page.tsx`](src/app/order/[id]/page.tsx), or only allow retry for `payment_status = failed` with a short-lived signed param; never load full order by bare `orderId` alone.

### 2. Admin data pages do not enforce `ADMIN_EMAIL`; middleware only checks “logged in”

**Files:** [`src/lib/supabase/middleware.ts`](src/lib/supabase/middleware.ts), [`src/app/admin/page.tsx`](src/app/admin/page.tsx), [`src/app/admin/orders/page.tsx`](src/app/admin/orders/page.tsx), [`src/app/admin/products/page.tsx`](src/app/admin/products/page.tsx) (same pattern expected)

Middleware redirects unauthenticated users away from `/admin/*`, but **any** Supabase-authenticated user can load admin server components, which call `listOrders()`, `getAdminStats()`, etc. via the service client **without** calling `assertAdminSession()`.

[`src/app/admin/actions.ts`](src/app/admin/actions.ts) enforces `ADMIN_EMAIL` for mutations, but **read paths leak all orders** to non-admin accounts if project signup is open or credentials are shared.

**Fix:** Enforce `ADMIN_EMAIL` (or role claim) in middleware for `/admin/*`, or add a shared server helper `requireAdmin()` used by every admin page before any service-role query.

### 3. `ADMIN_EMAIL` unset ⇒ any authenticated user passes `assertAdminSession`

**File:** [`src/app/admin/actions.ts`](src/app/admin/actions.ts)

```ts
if (adminEmail && user.email?.toLowerCase() !== adminEmail) {
```

If `ADMIN_EMAIL` is missing, the check is skipped and **any** `user` is treated as admin for server actions.

**Same pattern:** [`src/app/api/orders/[id]/route.ts`](src/app/api/orders/[id]/route.ts)

**Fix:** Fail closed: if `ADMIN_EMAIL` is unset in production, deny admin actions / return 503, or require explicit allowlist configuration at startup.

---

## Important

### 4. Order access token HMAC secret falls back to `SUPABASE_SERVICE_ROLE_KEY`

**File:** [`src/lib/payment/order-access-token.ts`](src/lib/payment/order-access-token.ts)

Couples order-link security to the DB service role; rotation / scope impact is larger than a dedicated `ORDER_ACCESS_TOKEN_SECRET`.

**Fix:** Require `ORDER_ACCESS_TOKEN_SECRET` in production; remove service-role fallback or gate it to dev only.

### 5. PayFast `return_url` puts access token in query string

**File:** [`src/app/api/orders/route.ts`](src/app/api/orders/route.ts)

Tokens may leak via `Referer`, shared URLs, logs, and browser history.

**Fix:** Prefer HttpOnly cookie set in the POST response before redirect, or PayFast-supported pattern that avoids long-lived secrets in URLs (document tradeoffs).

### 6. Webhook logs full PayFast payload on signature failure

**File:** [`src/app/api/payfast/webhook/route.ts`](src/app/api/payfast/webhook/route.ts) (`console.error(..., data)`)

May write PII and payment fields to log sinks.

**Fix:** Log only `m_payment_id`, error code, and non-sensitive keys.

### 7. PayFast config allows empty merchant credentials

**File:** [`src/lib/payment/payfast.ts`](src/lib/payment/payfast.ts)

`process.env.PAYFAST_* || ''` can produce invalid signatures / silent misconfiguration.

**Fix:** Validate required env at startup or before signing; fail fast in production.

### 8. Public POST APIs lack rate limiting / abuse controls

**Files:** [`src/app/api/orders/route.ts`](src/app/api/orders/route.ts), [`src/app/api/contact/route.ts`](src/app/api/contact/route.ts), [`src/app/api/notify/route.ts`](src/app/api/notify/route.ts)

Risk: spam orders, contact noise, email/API cost.

**Fix:** Edge rate limit, Turnstile/hCaptcha for contact, or Vercel firewall rules as appropriate.

### 9. PayFast webhook: signature comparison not timing-safe

**File:** [`src/lib/payment/payfast.ts`](src/lib/payment/payfast.ts) (`generatedSignature === providedSignature`)

Low practical risk for MD5 hex strings but inconsistent with HMAC best practice elsewhere.

**Fix:** Use `crypto.timingSafeEqual` on buffers after length check.

---

## Minor

### 10. Order number collision handling

**File:** [`src/lib/db/services.ts`](src/lib/db/services.ts) — `makeOrderNumber()` random 6-digit; DB `unique` on `order_number` can cause rare insert failure surfaced as generic `ORDER_CREATION_FAILED`.

**Fix:** Retry on unique violation or use a stronger id scheme.

### 11. Webhook idempotency / duplicate ITN

**File:** [`src/lib/db/services.ts`](src/lib/db/services.ts) — `applyWebhook` updates state repeatedly; emails gated by `previousPaymentStatus !== 'paid'` — reasonable. Document PayFast retry behavior.

### 12. Design system / copy

Admin dashboard includes placeholder-style metrics (e.g. hardcoded “+12%”, “99.8%”) in [`src/app/admin/page.tsx`](src/app/admin/page.tsx) — conflicts with CLAUDE.md “no placeholder content in production” if interpreted strictly.

### 13. Vitest pool teardown

Local/CI may see `kill EACCES` when workers shut down (environment-specific). Tests still passed.

---

## Working tree diff (animation / home)

Uncommitted changes (vs `HEAD`) touch:

- `src/components/home/featured-collection-section.tsx`
- `src/components/home/how-it-works-section.tsx`
- `src/components/home/social-proof-section.tsx`
- `src/components/providers/gsap-provider.tsx`
- `src/components/providers/smooth-scroll-provider.tsx`
- `src/components/shop/shop-animations.tsx`
- `src/components/ui/card.tsx`
- `src/lib/animation/scroll-layout.ts`

**Notes:** [`src/lib/animation/scroll-layout.ts`](src/lib/animation/scroll-layout.ts) documents `prefers-reduced-motion` in the ScrollSmoother media query — aligned with plan pillar 6. No new security surface in these files from quick scan; focus remains integration testing for mobile vs desktop scrollers (existing debug helpers).

---

## Summary

| Severity | Count |
|----------|--------|
| Critical | 3 |
| Important | 6 |
| Minor | 4 |

**Recommended before merge to production:** Address Critical **1–3** (authorization / PII). Treat Important items **4–8** as security hardening backlog with clear owners.
