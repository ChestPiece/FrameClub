# Plan: Mobile Animation Fix + Responsive Consistency

## Context

Animations work on desktop but are fully broken on mobile (user confirmed via device testing). Root cause is a ScrollTrigger scroller proxy leak — when ScrollSmoother is killed on mobile (<1024px), `ScrollTrigger.defaults({ scroller })` is never reset to `undefined`, so all `.batch()` triggers measure against a non-existent smooth wrapper instead of `window`. Secondary issues: button hover states freeze after touch, `prefers-reduced-motion` on iOS silently kills all animation, `maximumScale: 1` blocks pinch-zoom, and minor layout gaps.

---

## Fix 1 — CRITICAL: Reset ScrollTrigger.defaults scroller on mobile path

**File:** `src/components/providers/smooth-scroll-provider.tsx`

In `apply()`, after `ScrollSmoother.get()?.kill()` (line 54) and before `wrapper.removeAttribute("data-smooth")` (line 55), add:

```ts
ScrollTrigger.defaults({ scroller: undefined });
```

This single line unblocks ALL mobile scroll-triggered animations. Without it, every `ScrollTrigger.batch()` and trigger with `trigger:` uses the wrong scroller container on mobile.

---

## Fix 2 — Button hover state freezes on touch

**File:** `src/components/providers/button-motion-provider.tsx`

`onPointerRelease` (line 80-84) calls `animateButton(button, "hover")` after `pointerup`. On touch, `pointerleave` never fires — button stays at hover scale forever.

Change `onPointerRelease` to return to "rest" when `pointerType === "touch"`:

```ts
const onPointerRelease = (event: PointerEvent) => {
  const button = getMotionTarget(event.target);
  if (!button) return;
  const mode = event.pointerType === "touch" ? "rest" : "hover";
  animateButton(button, mode);
};
```

Also update `pointercancel` handler (line 92) to always call "rest" regardless of pointer type — extract a dedicated `onPointerCancel`:

```ts
const onPointerCancel = (event: PointerEvent) => {
  const button = getMotionTarget(event.target);
  if (!button) return;
  animateButton(button, "rest");
};
// replace line 92: document.addEventListener("pointercancel", onPointerCancel, true);
// and in cleanup: document.removeEventListener("pointercancel", onPointerCancel, true);
```

---

## Fix 3 — Reduce safety-unhide timer on mobile

**File:** `src/components/home/home-animations.tsx`

`SAFETY_UNHIDE_MS = 1200` (line 23) is the fallback that reveals hidden content if GSAP fails to fire. On mobile 1200ms is too long — content stays invisible for over a second. Change to dynamic:

```ts
const SAFETY_UNHIDE_MS = typeof window !== "undefined" && window.innerWidth < 1024 ? 600 : 1200;
```

Move this inside the component (after `rootRef` etc.) so it reads `window.innerWidth` at render time.

---

## Fix 4 — Remove maximumScale: 1 from viewport

**File:** `src/app/layout.tsx` line 37-41

```ts
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // remove: maximumScale: 1
};
```

WCAG 1.4.4 violation. No animation in this project requires preventing pinch-zoom.

---

## Fix 5 — Hero grid gap too large on mobile

**File:** `src/app/page.tsx`

Find the hero grid div with `gap-10`. Change to `gap-6 md:gap-10`. Hero is `h-dvh` — 40px gap on single-column mobile wastes vertical space and may push CTA button below the fold.

---

## Fix 6 — Collection grid: no 2-column tablet step

**File:** `src/components/home/featured-collection-section.tsx`

Grid class on line ~150: `md:grid-cols-3` jumps from 1 to 3 columns. Add `sm:grid-cols-2`:

```ts
viewMode === "grid" ? "sm:grid-cols-2 md:grid-cols-3" : "md:grid-cols-1"
```

---

## Fix 7 — Header logo x-offset clips on tiny screens

**File:** `src/components/layout/site-header.tsx`

The intro animation sets `x: -16` on `[data-header-logo]`. On 360px screens this clips the logo against the left edge during the 0.4s animation. Use a smaller offset on narrow screens:

```ts
const logoXOffset = window.innerWidth < 400 ? -8 : -16;
gsap.set("[data-header-logo]", { x: logoXOffset });
```

---

## Files to Modify

| # | File | Change | Impact |
|---|------|--------|--------|
| 1 | `src/components/providers/smooth-scroll-provider.tsx` | Reset `ScrollTrigger.defaults({ scroller: undefined })` | **CRITICAL** — unblocks all mobile scroll animations |
| 2 | `src/components/providers/button-motion-provider.tsx` | Return to "rest" on touch pointerup | HIGH — fixes frozen button states |
| 3 | `src/components/home/home-animations.tsx` | Halve safety timer on mobile | HIGH — faster unhide fallback |
| 4 | `src/app/layout.tsx` | Remove `maximumScale: 1` | MEDIUM — accessibility |
| 5 | `src/app/page.tsx` | `gap-6 md:gap-10` on hero grid | MEDIUM — hero fits in mobile viewport |
| 6 | `src/components/home/featured-collection-section.tsx` | `sm:grid-cols-2 md:grid-cols-3` | LOW — tablet layout |
| 7 | `src/components/layout/site-header.tsx` | Reduce logo x-offset on <400px | LOW — logo clip on tiny screens |

---

## What NOT to Change

- `ScrollTrigger.normalizeScroll(false)` in `gsap-provider.tsx` — correct as-is
- The provider hierarchy in `layout.tsx` — correct
- `scrollSmootherMatchMediaQuery` breakpoint — correct
- All `mm.add` `reduceMotion` branches in animation components — already correct
- `waitForLayoutStable` chain — correct and necessary

---

## Verification

Test on real devices + Chrome DevTools mobile emulation (390px):

1. **Home, About, Contact, Shop** — scroll triggers fire (section reveals animate in)
2. **About** — SplitText heading animates, timeline lines draw on scroll
3. **Buttons** — tap any button, lift finger → springs back to rest (no stuck hover scale)
4. **iOS pinch-zoom** — works after maximumScale fix
5. **Hero** — text + image + CTA visible within viewport height on 390px
6. **Collection** — 2 cards per row at 640–767px viewport
7. **Header** — logo visible and not clipped at 360px width during intro animation
8. **Reduce Motion** — all content immediately visible, no flash of hidden elements
