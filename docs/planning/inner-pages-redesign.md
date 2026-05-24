# Frame Club — Shop, Story & Contact Page Redesign

## Context

The three inner pages (Shop/Explore, Story/About, Contact) currently use a flat section pattern with basic `ScrollTrigger.batch()` animations and minimal visual hierarchy. The homepage redesign plan established a cinematic language (SplitText, DrawSVG, ScrambleText, Flip) that the inner pages don't yet share. This plan extends that language consistently across all three pages.

Chosen directions:
- **Shop** — Cinematic full-bleed hero: SplitText char stagger on "THE COLLECTION", DrawSVG accent line, filter bar below
- **Story** — Timeline documentary: DrawSVG connector lines between Phase nodes, SplitText on phase headings
- **Contact** — Split-screen dramatic: full-height left panel with giant heading + WhatsApp CTA, DrawSVG vertical divider, form on right

All four Club plugins confirmed: **SplitText, ScrambleText, DrawSVG, Flip**. All are already registered in `gsap-provider.tsx`. The `PageScrollAnimations` shared component handles `[data-animate-item]` batch reveals and stays in place.

---

## Critical Files

| File | Change |
|------|--------|
| `src/app/shop/page.tsx` | Add hero animation attributes, DrawSVG accent SVG, filter layout tweak |
| `src/app/about/page.tsx` | Full layout rewrite: hero + timeline section with DrawSVG connector line |
| `src/app/contact/page.tsx` | Full layout rewrite: split-screen with DrawSVG vertical divider |
| `src/app/contact/contact-form.tsx` | No structural changes needed |
| `src/components/shared/page-scroll-animations.tsx` | Verify `"shop" | "about" | "contact"` configs exist |
| `src/components/shop/catalog-product-card.tsx` | Add `data-flip-card` attribute |
| **NEW:** `src/components/shop/shop-animations.tsx` | Client component: SplitText + ScrambleText + DrawSVG for shop hero |
| **NEW:** `src/components/about/about-animations.tsx` | Client component: SplitText + DrawSVG connector timeline |
| **NEW:** `src/components/contact/contact-animations.tsx` | Client component: SplitText + DrawSVG vertical divider |

Reuse patterns from homepage:
- `useScrollTriggerReady()` from `src/components/providers/scroll-trigger-environment.tsx`
- `gsap`, `ScrollTrigger` from `src/lib/gsap-config.ts`
- `useGSAP` from `@gsap/react`

---

## Implementation Phases

### Phase 1 — Shop Page: Cinematic Hero

**`src/app/shop/page.tsx`** — DOM changes:
1. Add `data-shop-hero` to the hero `<section>`
2. Add `data-shop-heading` to the `<h1>` ("THE COLLECTION")
3. Add `data-shop-kicker` to the kicker `<p>` ("DROP ARCHIVE")
4. Insert DrawSVG accent SVG below heading block:
   ```tsx
   <svg aria-hidden="true" data-drawsvg-shop-accent
     className="mt-6 h-px w-48 block" viewBox="0 0 192 1"
     preserveAspectRatio="none">
     <line x1="0" y1="0.5" x2="192" y2="0.5" stroke="#380306" strokeWidth="1" />
   </svg>
   ```
5. Add `data-shop-count` to the count `<p>` ("{n} frames found")
6. Mount `<ShopAnimations />` (client component) inside `<PageScrollAnimations>`

**`src/components/shop/shop-animations.tsx`** — new `"use client"` component:
```ts
// useGSAP + useScrollTriggerReady
// On animationsReady:
//   1. SplitText on [data-shop-heading]: type:"chars", stagger 0.04, y:40→0, autoAlpha:0→1, ease:"power3.out"
//   2. ScrambleText on [data-shop-kicker]: scramble into "DROP ARCHIVE", chars:"upperCase"
//   3. gsap.from([data-shop-count], { autoAlpha:0, x:-20, delay:0.6 })
//   4. ScrollTrigger.batch("[data-drawsvg-shop-accent] line", { once:true, start:"top 90%",
//        onEnter: els => gsap.fromTo(els, { drawSVG:"0%" }, { drawSVG:"100%", duration:1.2 }) })
// reduceMotion branch: clearProps:"all" + drawSVG:"100%"
```

**Note on Flip for Shop:** Status filter buttons are server-side URL-param links (full page navigate). Flip is not applicable — cards batch-reveal via existing `[data-animate-item]` pattern instead.

---

### Phase 2 — Story/About Page: Timeline Documentary

**`src/app/about/page.tsx`** — layout restructure:

**Hero section** — keep background, add animation attributes:
```tsx
<section data-animate-page="about" className="relative overflow-hidden border-b border-border-dark bg-bg-surface py-20">
  {/* existing radial gradient */}
  <div className="frame-container relative max-w-6xl">
    <p data-about-kicker className="technical-label text-[10px] text-text-muted">About Frame Club</p>
    {/* DrawSVG accent under kicker */}
    <svg aria-hidden="true" data-drawsvg-about-kicker className="mt-3 mb-4 h-px w-32 block" viewBox="0 0 128 1" preserveAspectRatio="none">
      <line x1="0" y1="0.5" x2="128" y2="0.5" stroke="#380306" strokeWidth="1" />
    </svg>
    <h1 data-about-heading className="display-kicker mt-4 text-4xl leading-none sm:text-5xl md:text-7xl">WHERE SPEED MEETS ART</h1>
    <p data-animate-item className="mt-8 max-w-3xl text-base leading-relaxed text-text-muted">...</p>
  </div>
</section>
```

**Stats strip** — keep existing 3-column grid with `data-animate-item` (already present).

**Timeline section** — replace flat 3-column grid with documentary timeline:
```tsx
<section className="bg-bg-recessed py-20">
  <div className="frame-container">
    <p className="technical-label text-[10px] text-text-muted mb-12">The Journey</p>
    <div className="relative">
      {/* DrawSVG horizontal connector — desktop only */}
      <svg aria-hidden="true" data-drawsvg-timeline
        className="absolute top-5 left-0 w-full h-px hidden md:block pointer-events-none"
        viewBox="0 0 1000 1" preserveAspectRatio="none">
        <line x1="0" y1="0.5" x2="1000" y2="0.5" stroke="#380306" strokeWidth="1" />
      </svg>
      <div className="grid gap-12 md:grid-cols-3">
        {/* Each node: brand dot + phase label + SplitText heading + body */}
        <article data-animate-item data-timeline-node="1">
          <div className="w-2.5 h-2.5 bg-brand mb-8 hidden md:block" />
          <p className="technical-label text-[10px] text-text-muted">Phase 01</p>
          <p data-timeline-heading className="display-kicker mt-4 text-3xl leading-none">DM ERA</p>
          <p className="mt-4 text-sm text-text-muted">...</p>
        </article>
        {/* Phase 02 and 03 same structure */}
      </div>
    </div>
  </div>
</section>
```

**`src/components/about/about-animations.tsx`** — new `"use client"` component:
```ts
// On animationsReady:
//   1. SplitText on [data-about-heading]: chars, stagger 0.04, y:40→0, autoAlpha:0→1
//   2. ScrambleText on [data-about-kicker]: scramble into "About Frame Club"
//   3. DrawSVG kicker accent on page load: drawSVG "0%"→"100%", 0.4s delay
//   4. ScrollTrigger.batch("[data-drawsvg-timeline] line", { start:"top 80%", once:true,
//        onEnter: els => gsap.fromTo(els, { drawSVG:"0%" }, { drawSVG:"100%", duration:1.6, ease:"power2.inOut" }) })
//   5. ScrollTrigger.batch("[data-timeline-heading]", { start:"top 85%", once:true,
//        onEnter: els => gsap.from(els, { y:20, autoAlpha:0, stagger:0.15 }) })
// reduceMotion: clearProps all, drawSVG:"100%"
```

---

### Phase 3 — Contact Page: Split-Screen Dramatic

**`src/app/contact/page.tsx`** — full layout restructure:

```tsx
<main id="main-content" className="min-h-dvh pt-30 pb-0">
  <PageScrollAnimations config="contact">
  <section data-animate-page="contact"
    className="relative min-h-[calc(100dvh-var(--header-height,5rem))] grid md:grid-cols-2">

    {/* DrawSVG vertical divider — desktop only */}
    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 hidden md:block pointer-events-none z-10" aria-hidden="true">
      <svg data-drawsvg-contact-divider className="h-full w-px" viewBox="0 0 1 1000" preserveAspectRatio="none">
        <line x1="0.5" y1="0" x2="0.5" y2="1000" stroke="#380306" strokeWidth="1" />
      </svg>
    </div>

    {/* LEFT PANEL */}
    <div className="flex flex-col justify-between bg-bg-recessed p-10 md:p-14 border-b md:border-b-0 md:border-r border-border-dark">
      <div>
        <p data-contact-kicker className="technical-label text-[10px] text-text-muted">Contact</p>
        <h1 data-contact-heading className="display-kicker mt-6 text-5xl leading-none sm:text-6xl md:text-7xl lg:text-8xl">
          TALK TO<br />FRAME CLUB
        </h1>
        <p data-animate-item className="mt-8 max-w-sm text-sm leading-relaxed text-text-muted">
          For quick coordination, WhatsApp is the fastest channel...
        </p>
      </div>
      <div className="mt-12 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2" data-animate-item>
          <article className="border border-border-dark/60 bg-bg-elevated p-5">
            <p data-channel-label className="technical-label text-[10px] text-text-muted">Primary Channel</p>
            <p className="display-kicker mt-3 text-2xl">WhatsApp</p>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-text-muted">Fastest response flow</p>
          </article>
          <article className="border border-border-dark/60 bg-bg-elevated p-5">
            <p data-channel-label className="technical-label text-[10px] text-text-muted">Instagram</p>
            <p className="display-kicker mt-3 text-2xl">@frameclub__</p>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-text-muted">Legacy DM channel</p>
          </article>
        </div>
        <Button render={<Link href={WHATSAPP_LINK} />} variant="brand" size="lg"
          className="display-kicker w-full px-7 text-sm">
          OPEN WHATSAPP
        </Button>
      </div>
    </div>

    {/* RIGHT PANEL */}
    <div data-animate-item className="flex flex-col justify-center bg-bg-surface p-10 md:p-14">
      <p className="technical-label text-[10px] text-text-muted mb-4">
        {intentIsNotify ? "Notify Request" : "General Contact"}
      </p>
      <p className="text-sm text-text-muted mb-8">
        {intentIsNotify ? `You requested a notification for ${params.product ?? "an unavailable model"}.` : "Leave your email and we will reach out."}
      </p>
      <ContactForm intentIsNotify={intentIsNotify} productSlug={params.product} />
    </div>

  </section>
  </PageScrollAnimations>
</main>
```

**`src/components/contact/contact-animations.tsx`** — new `"use client"` component:
```ts
// On animationsReady:
//   1. SplitText on [data-contact-heading]: chars, stagger 0.03, y:50→0, autoAlpha:0→1
//   2. ScrambleText on [data-contact-kicker]: scramble into "Contact"
//   3. ScrambleText on [data-channel-label] elements: stagger 0.2s between each
//   4. DrawSVG vertical divider: drawSVG "0 0%"→"0 100%", duration:1.4, 0.5s delay
// reduceMotion: clearProps all, drawSVG:"100%"
```

---

### Phase 4 — `page-scroll-animations.tsx` Verification

Read `src/components/shared/page-scroll-animations.tsx`. Confirm `"shop"`, `"about"`, `"contact"` are in the `config` union type and each runs `ScrollTrigger.batch("[data-animate-item]")`. No changes expected — just a sanity check before mounting new animation components.

---

## Animation Attribute Map

| Attribute | Plugin | Page | Effect |
|-----------|--------|------|--------|
| `data-shop-heading` | SplitText | Shop | Char stagger reveal on load |
| `data-shop-kicker` | ScrambleText | Shop | Scramble to "DROP ARCHIVE" |
| `data-shop-count` | gsap.from | Shop | Slide in from left, delay 0.6 |
| `data-drawsvg-shop-accent` | DrawSVG | Shop | Horizontal stroke under heading |
| `data-about-heading` | SplitText | Story | Char stagger reveal on load |
| `data-about-kicker` | ScrambleText | Story | Scramble to "About Frame Club" |
| `data-drawsvg-about-kicker` | DrawSVG | Story | Short accent stroke under kicker |
| `data-drawsvg-timeline` | DrawSVG | Story | Full-width horizontal timeline connector |
| `data-timeline-heading` | ScrollTrigger batch | Story | Phase heading stagger slide on scroll |
| `data-contact-heading` | SplitText | Contact | Char stagger, larger scale (lg:text-8xl) |
| `data-contact-kicker` | ScrambleText | Contact | Scramble to "Contact" |
| `data-channel-label` | ScrambleText | Contact | Staggered scramble on both channel cards |
| `data-drawsvg-contact-divider` | DrawSVG | Contact | Full-height vertical divider top→bottom |

---

## New Files to Create

```
src/components/shop/shop-animations.tsx
src/components/about/about-animations.tsx
src/components/contact/contact-animations.tsx
```

Each follows the same pattern:
- `"use client"`
- `useScrollTriggerReady()` gates all animation setup
- `useGSAP(setup, { dependencies: [animationsReady] })`
- `reduceMotion` branch: `window.matchMedia("(prefers-reduced-motion: reduce)").matches`
- Returns `null` (renders no DOM)

---

## Verification Checklist

- [ ] `/shop` — "THE COLLECTION" chars stagger in on load, "DROP ARCHIVE" scrambles, DrawSVG accent line draws
- [ ] `/shop` — product count slides in from left with delay
- [ ] `/shop` — product cards batch-reveal on scroll via existing `[data-animate-item]`
- [ ] `/about` — "WHERE SPEED MEETS ART" chars stagger in on load, kicker scrambles
- [ ] `/about` — short DrawSVG accent draws under kicker on load
- [ ] `/about` — scroll to timeline: horizontal DrawSVG connector draws left-to-right across phase dots
- [ ] `/about` — phase headings (DM ERA, WORKSHOP FLOW, DIGITAL STOREFRONT) stagger slide in
- [ ] `/contact` — "TALK TO FRAME CLUB" chars stagger from `y:50` on load
- [ ] `/contact` — kicker scrambles to "Contact", channel labels scramble with stagger
- [ ] `/contact` — DrawSVG vertical divider draws top-to-bottom
- [ ] `/contact` — form panel slides in via `[data-animate-item]` batch
- [ ] All three pages: `prefers-reduced-motion` — elements immediately visible, `drawSVG:"100%"`, no animation
- [ ] Mobile: DrawSVG vertical divider (`contact`) hidden below `md:`, timeline dots hidden below `md:`, layouts stack cleanly
- [ ] No `rounded-`, `bg-white`, or `shadow-` classes introduced
- [ ] No console errors about missing plugins or broken ScrollTrigger contexts
