---
status: diagnosed
trigger: "Investigate homepage animation issue: content appears only after navbar hides while scrolling (user describes animations as inverted)."
created: 2026-04-14T00:00:00Z
updated: 2026-04-14T00:10:00Z
---

## Current Focus

hypothesis: Confirmed: hero subcopy/image are hidden at initial render and tied to scrub progress, while header compacts at 60px, making reveal feel inverted and coupled to navbar hide.
test: N/A (diagnosis complete)
expecting: N/A
next_action: Return root cause and precise code-level fix recommendation.

## Symptoms

expected: Homepage hero/content should be visible on load with natural scroll motion progression.
actual: Content appears only after navbar hides while scrolling; animation feels inverted.
errors: none reported
reproduction: Open homepage and scroll slightly; content reveal lines up with navbar compacting.
started: unknown

## Eliminated

## Evidence

- timestamp: 2026-04-14T00:00:00Z
  checked: src/components/layout/site-header.tsx
  found: Header compact ScrollTrigger starts at 60 and plays compact timeline onEnter.
  implication: Navbar hide is tied to a fixed early-scroll threshold.

- timestamp: 2026-04-14T00:00:00Z
  checked: src/components/home/home-animations.tsx
  found: HERO_PIN_TARGETS are set to autoAlpha 0 and then animated from hidden states in a scrubbed timeline starting at hero trigger start "top top".
  implication: Hero content remains hidden at load and appears only after user scroll progress.

- timestamp: 2026-04-14T00:10:00Z
  checked: src/app/page.tsx
  found: Hero elements with data-hero-pin also have inline style opacity:0, reinforcing hidden initial state before scroll timeline progress.
  implication: Even before GSAP timeline progression, these elements are forced invisible at load.

- timestamp: 2026-04-14T00:10:00Z
  checked: src/components/home/home-animations.tsx + src/components/layout/site-header.tsx
  found: Hero pin reveal starts at scroll trigger start "top top" (progress from first pixels), while header compact trigger starts at 60.
  implication: As user scrolls into first ~60px, both behaviors occur together, creating a false dependency perception ("content appears when navbar hides").

## Resolution

root_cause: Home hero "pin" content is initialized hidden (inline opacity 0 + gsap.set autoAlpha 0) and only revealed by a scrubbed ScrollTrigger timeline, so content naturally appears only after scroll begins. Header compacting at 60px is a separate trigger that happens in the same early scroll window, making the reveal feel inverted/coupled.
fix: Remove hidden initial state for hero pin content and avoid fromTo hidden->visible for those targets in the scrub timeline. Keep them visible at load, then animate positional/parallax values only during scrub. Optionally shift pin start to top+=header offset if needed for pacing.
verification: Static code inspection confirms initial hide + scrub reveal coupling and threshold overlap.
files_changed: []
