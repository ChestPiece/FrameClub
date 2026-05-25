# Frame Club — Homepage Redesign Plan

## Context

The current homepage feels too basic — content is oversized, animations exist but lack cinematic polish, and sections rely on raw div/article patterns instead of shadcn primitives. The goal is a full redesign that reduces content scale, introduces a pinned cinematic hero, smooth scroll, DrawSVG decorative strokes, Flip layout transitions, and standardises all section building-blocks on shadcn components. No new animation libraries — GSAP handles everything.

---

## Critical File Paths

| File | Role |
|------|------|
| `src/components/providers/gsap-provider.tsx` | Plugin registration |
| `src/components/home/home-animations.tsx` | Global animation orchestrator |
| `src/app/page.tsx` | Hero section (inline) + section wrappers |
| `src/components/home/what-is-this-section.tsx` | Section 2 |
| `src/components/home/how-it-works-section.tsx` | Section 3 |
| `src/components/home/featured-collection-section.tsx` | Section 4 (products) |
| `src/components/home/customisation-section.tsx` | Section 5 |
| `src/components/home/social-proof-section.tsx` | Section 6 |
| `src/components/home/final-cta-section.tsx` | Section 7 |
| `src/app/globals.css` | Display fluid/section clamp values |
| `src/components/shared/animated-cta-link.tsx` | To be replaced at call sites |
| `src/components/home/scroll-reveal.tsx` | To be deleted after migration |

**Key facts confirmed:**
- `SmoothScrollProvider` already outputs `#smooth-wrapper > #smooth-content` — no DOM structure changes needed
- `DrawSVGPlugin` and `Flip` are **not yet registered** — must add to `gsap-provider.tsx`
- `ScrollReveal` is only used in `what-is-this-section.tsx`
- `AnimatedCTALink` is used in `featured-collection-section.tsx` and `final-cta-section.tsx`
- `StatusBadge` already wraps shadcn `Badge` — keep as-is
- CSS `position: sticky` **does not work** inside ScrollSmoother's `transform`-ed container — use GSAP `pin: true` instead

---

## Implementation Phases (execute in order)

---

### Phase 0 — Register Missing Plugins

**File:** `src/components/providers/gsap-provider.tsx`

Add to imports:
```ts
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
```

Add `DrawSVGPlugin, Flip` to the `gsap.registerPlugin(...)` call alongside existing plugins.

**Verify:** `gsap.plugins` in browser console shows `drawSVG` and `flip` keys.

---

### Phase 1 — Remove `ScrollReveal`, Fold Into Batch

**File:** `src/components/home/what-is-this-section.tsx`

- Remove `import { ScrollReveal }` and all three `<ScrollReveal>` wrapper divs
- Add `data-animate-item` to the three previously-wrapped elements:
  - Prose `<div className="space-y-6 text-lg">`
  - `<article>` "01 ARCHIVAL PROTECTION"
  - `<article>` "02 HANDCRAFTED PROCESS"
- The existing `ScrollTrigger.batch("[data-animate-item]")` in `home-animations.tsx` handles them automatically

**Delete:** `src/components/home/scroll-reveal.tsx` (only import was in what-is-this-section.tsx)

---

### Phase 2 — Replace `AnimatedCTALink` with shadcn `Button` + GSAP Hover

The fill-slide hover effect must survive. Pattern for both call sites:

```tsx
// Inside each component that needs the effect:
const fillRef = useRef<HTMLSpanElement>(null);
const handleEnter = useCallback(() => {
  gsap.killTweensOf(fillRef.current);
  gsap.to(fillRef.current, { scaleX: 1, duration: 0.28, ease: "expo.out" });
}, []);
const handleLeave = useCallback(() => {
  gsap.killTweensOf(fillRef.current);
  gsap.to(fillRef.current, { scaleX: 0, duration: 0.22, ease: "expo.in" });
}, []);

<Button
  render={<Link href={href} />}
  variant="outline"
  className="relative overflow-hidden ..."
  onMouseEnter={handleEnter}
  onMouseLeave={handleLeave}
>
  <span ref={fillRef} aria-hidden="true"
    className="absolute inset-0 bg-text-primary pointer-events-none"
    style={{ transform: "scaleX(0)", transformOrigin: "0% 50%" }}
  />
  <span className="relative z-10 mix-blend-difference">VIEW SPECS</span>
</Button>
```

**Files to update:**
- `src/components/home/featured-collection-section.tsx` — product card "VIEW SPECS" CTA. Extract a small `ProductCardCTA` function within the file (refs need per-card scope).
- `src/components/home/final-cta-section.tsx` — "ORDER NOW" button

Remove `import { AnimatedCTALink }` from both files.

---

### Phase 3 — Scale Reduction (Typography + Spacing)

**`src/app/globals.css`:**
- `display-fluid`: `clamp(2.5rem, 8vw, 8rem)` → `clamp(2rem, 6vw, 6rem)`
- `display-section`: `clamp(2rem, 5vw, 5rem)` → `clamp(1.75rem, 4vw, 4rem)`

**Across all section files — class changes:**

| Current | New |
|---------|-----|
| `text-5xl md:text-7xl` (section h2s) | `text-4xl md:text-5xl` |
| `text-3xl` (product card h3) | `text-xl` |
| `text-base md:text-lg` (hero subcopy) | `text-sm md:text-base` |
| `text-lg` (WhatIsThis prose) | `text-sm md:text-base` |
| `text-lg italic` (testimonials) | `text-sm md:text-base italic` |
| `py-24 md:py-32` (section padding) | `py-16 md:py-24` |
| `mb-14` (section header margin) | `mb-10` |
| `p-8 md:p-10` (step card padding) | `p-6 md:p-8` |
| `p-8` (product card body) | `p-6` |
| `p-10` (testimonial card) | `p-7` |
| `p-7` (hero image container) | `p-5` |
| `text-[160px] md:text-[200px]` (ghost numbers) | `text-[120px] md:text-[160px]` |
| `gap-14` (hero grid) | `gap-10` |
| `gap-12` (collection grid) | `gap-8` |

---

### Phase 4 — shadcn Component Integration

Replace raw `<article>` / `<div>` elements with shadcn primitives where appropriate. The existing shadcn `Card` already enforces `border-radius: 0` via `--radius: 0px`.

**HowItWorks step cards** (`how-it-works-section.tsx`):
- Replace `<article ref={...}>` with `<Card ref={...}>` keeping all existing classes, refs, and mouse handlers
- Inner content div becomes `<CardContent className="p-6 md:p-8 flex flex-col justify-end h-full">`
- Add `<Separator className="mb-8 bg-border-dark/40" />` between heading block and card grid

**FeaturedCollection product cards** (`featured-collection-section.tsx`):
- `<article ref={...} className="group bg-[#0F0F0F] border border-[#494542]">` → `<Card ref={...} className="group bg-bg-recessed overflow-hidden">`
- Product info div → `<CardContent className="p-6">`

**Testimonial cards** (`social-proof-section.tsx`):
- `<article ref={...} className="border-l-4 border-brand bg-[#1A1614] p-10 ...">` → `<Card ref={...} className="border-l-4 border-brand border-r-0 border-t-0 border-b-0 bg-[#1A1614] overflow-hidden">`
- Inner content → `<CardContent className="p-7 flex flex-col gap-6 relative z-10">`

**Customisation option cells** (`customisation-section.tsx`):
- Each `<article>` panel → `<Card>` with matching border override

**Section dividers** (`page.tsx`):
- Add `<Separator className="bg-border-dark/20" />` between alternating sections

---

### Phase 5 — DrawSVG Decorative Strokes

Inline SVG elements added to sections. All strokes animate via `home-animations.tsx` (Phase 8). They use `data-drawsvg-*` attributes as selectors.

**Placement 1 — Horizontal divider between WhatIsThis and HowItWorks (in `page.tsx`):**
```tsx
<div className="frame-container overflow-hidden" aria-hidden="true">
  <svg data-drawsvg-divider viewBox="0 0 1280 2" className="w-full h-px" preserveAspectRatio="none">
    <line x1="0" y1="1" x2="1280" y2="1" stroke="#380306" strokeWidth="1" />
  </svg>
</div>
```

**Placement 2 — Vertical accent in WhatIsThis left column (`what-is-this-section.tsx`):**
```tsx
<svg aria-hidden="true" data-drawsvg-vert className="absolute left-0 top-0 h-full w-px" viewBox="0 0 1 100" preserveAspectRatio="none">
  <line x1="0.5" y1="0" x2="0.5" y2="100" stroke="#380306" strokeWidth="1" />
</svg>
```
Left sticky column gets `relative pl-4`.

**Placement 3 — Centerline above FinalCTA heading (`final-cta-section.tsx`):**
```tsx
<svg aria-hidden="true" data-drawsvg-cta className="w-24 h-px mx-auto mb-8 block" viewBox="0 0 96 1" preserveAspectRatio="none">
  <line x1="0" y1="0.5" x2="96" y2="0.5" stroke="#8E130C" strokeWidth="1" />
</svg>
```

**Placement 4 — Corner brackets on Customisation grid (`customisation-section.tsx`):**
```tsx
<div className="relative">
  <svg aria-hidden="true" data-drawsvg-corners className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
    <polyline points="0,12 0,0 12,0" fill="none" stroke="#380306" strokeWidth="0.5" />
    <polyline points="88,0 100,0 100,12" fill="none" stroke="#380306" strokeWidth="0.5" />
    <polyline points="0,88 0,100 12,100" fill="none" stroke="#380306" strokeWidth="0.5" />
    <polyline points="88,100 100,100 100,88" fill="none" stroke="#380306" strokeWidth="0.5" />
  </svg>
  {/* existing grid */}
</div>
```

---

### Phase 6 — Hero Section: Pinned Cinematic Sequence

**DOM changes in `src/app/page.tsx`:**

1. Remove `pt-30` from `<main>` and `pt-20` from the hero `<section>`
2. Remove `data-speed="0.8"` from the image column (pin timeline controls it)
3. Give hero section `id="hero-section"` and `min-h-dvh`
4. Wrap the inner hero content in `<div id="hero-pin-target" className="h-dvh flex items-center">`
5. Add `data-hero-pin` attributes to elements entering in sequence:
   - Image column outer div: `data-hero-pin="image"` + `style={{ opacity: 0 }}`
   - Subcopy + CTA wrapper: `data-hero-pin="subcopy-group"` + `style={{ opacity: 0 }}`
6. Add `data-hero-svg-accent` SVG stroke at bottom of hero section:
   ```tsx
   <svg aria-hidden="true" data-hero-svg-accent className="absolute bottom-0 left-0 w-full h-px pointer-events-none" viewBox="0 0 1440 1" preserveAspectRatio="none">
     <line x1="0" y1="0.5" x2="1440" y2="0.5" stroke="#380306" strokeWidth="1" />
   </svg>
   ```

**Hero scale after reduction:**
- Hero `h1` uses updated `display-fluid` clamp (`clamp(2rem, 6vw, 6rem)`)
- Image container: `aspect-4/5` with reduced padding (`p-5`), corner triangle `w-10 h-10`

---

### Phase 7 — Flip Layout Transition on Collection Grid

**File:** `src/components/home/featured-collection-section.tsx`

```tsx
import { Flip } from "gsap/Flip";

const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);

// Capture state BEFORE React re-renders new layout:
const handleViewToggle = useCallback((newMode: "grid" | "list") => {
  if (newMode === viewMode || !gridRef.current) return;
  flipStateRef.current = Flip.getState(cardRefs.current);
  setViewMode(newMode);
}, [viewMode]);

// Animate AFTER React commits new layout:
useLayoutEffect(() => {
  if (!flipStateRef.current || !cardRefs.current.length) return;
  Flip.from(flipStateRef.current, {
    duration: 0.5,
    ease: "power2.inOut",
    stagger: 0.04,
    absolute: true,
    onComplete: () => { flipStateRef.current = null; }
  });
}, [viewMode]);
```

Grid toggle buttons above grid (Lucide `LayoutGrid` + `LayoutList`, `border border-border-dark` style, active state `border-brand-mid`).

Grid container: `className={cn("grid gap-8", viewMode === "grid" ? "md:grid-cols-3" : "md:grid-cols-1")}`

---

### Phase 8 — `home-animations.tsx` Rewrite

**Load-in timeline (unchanged):** accent line, label scramble, SplitText char stagger on heading. **Remove** `hero-subcopy`, `hero-cta`, `hero-image` from load-in — they are now scrub-driven.

**New pin timeline:**
```js
const pinTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#hero-section",
    start: "top top",
    end: "+=200%",
    scrub: 1,
    pin: "#hero-pin-target",
    anticipatePin: 1,
    invalidateOnRefresh: true,
  }
});

pinTl
  .fromTo("[data-hero-pin='image']",
    { x: 80, autoAlpha: 0 },
    { x: 0, autoAlpha: 1, duration: 1, ease: "power2.out" }, 0)
  .fromTo("[data-hero-pin='subcopy-group']",
    { y: 30, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 1, ease: "power2.out" }, 1)
  .fromTo("[data-hero-svg-accent] line",
    { drawSVG: "0%" },
    { drawSVG: "100%", duration: 1, ease: "none" }, 2);
```

**DrawSVG batch animations:**
```js
ScrollTrigger.batch("[data-drawsvg-divider], [data-drawsvg-cta]", {
  start: "top 90%", once: true,
  onEnter: (els) => gsap.fromTo(
    els.flatMap(el => Array.from(el.querySelectorAll("line"))),
    { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.2, ease: "power2.inOut" }
  )
});

ScrollTrigger.batch("[data-drawsvg-vert]", {
  start: "top 70%", once: true,
  onEnter: (els) => gsap.fromTo(
    els.flatMap(el => Array.from(el.querySelectorAll("line"))),
    { drawSVG: "0 0%" }, { drawSVG: "0 100%", duration: 1.4, ease: "power3.out" }
  )
});

ScrollTrigger.batch("[data-drawsvg-corners]", {
  start: "top 75%", once: true,
  onEnter: (els) => gsap.fromTo(
    els.flatMap(el => Array.from(el.querySelectorAll("polyline"))),
    { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.8, ease: "power2.out", stagger: 0.12 }
  )
});
```

**`reduceMotion` branch additions:**
```js
gsap.set(
  "[data-hero-pin], [data-hero-svg-accent] line, [data-drawsvg-divider] line, [data-drawsvg-cta] line, [data-drawsvg-vert] line, [data-drawsvg-corners] polyline",
  { autoAlpha: 1, y: 0, x: 0, clearProps: "all" }
);
gsap.set(
  "[data-hero-svg-accent] line, [data-drawsvg-divider] line, [data-drawsvg-cta] line, [data-drawsvg-vert] line, [data-drawsvg-corners] polyline",
  { drawSVG: "100%" }
);
```

**Remove:** old `[data-speed]` parallax block (hero image is now pin-driven).

**Safety timer selector:** must include `[data-hero-pin]`.

---

## Verification Checklist

- [ ] `gsap.plugins` in console shows `drawSVG` and `flip`
- [ ] Hero: heading visible on load, image slides in ~33% scroll, subcopy+CTA fades in ~66%, bottom stroke draws at ~100%
- [ ] Hero unpins cleanly — next section scrolls normally
- [ ] Mobile (< 1024px, ScrollSmoother off): hero pin still works via window scroller
- [ ] `prefers-reduced-motion`: all elements immediately visible, all strokes at `drawSVG: 100%`
- [ ] DrawSVG divider draws between WhatIsThis and HowItWorks
- [ ] Vertical accent draws in WhatIsThis left column
- [ ] CTA centerline draws as FinalCTA enters viewport
- [ ] Corner brackets draw in Customisation section (4 staggered polylines)
- [ ] Collection toggle: grid↔list animates via Flip, no position jump
- [ ] "VIEW SPECS" hover: fill slides in/out, text inverts via mix-blend-difference
- [ ] "ORDER NOW" hover: same fill effect
- [ ] All `<Card>` instances: `border-radius: 0` confirmed in DevTools
- [ ] No `bg-white`, `shadow-`, or `rounded-` classes added in changed files
- [ ] Font sizes visually smaller — hero heading and section headings proportionate on all screen sizes
- [ ] `what-is-this-section.tsx` has no ScrollReveal import — `scroll-reveal.tsx` deleted
- [ ] No console errors about missing modules or GSAP plugins
