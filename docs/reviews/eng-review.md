# Finalized Engineering Review - Frame Club

## 1) Source of Truth Decision

Primary source of truth for implementation should be `CLAUDE.md`.

Reason:
- `CLAUDE.md` has explicit hard stops and locked copy constraints.
- `DESIGN.md` is useful as a mood guide, but it contains rules that conflict with current, accepted product constraints and is less strict about operational constraints.

Decision:
- Use `CLAUDE.md` as authoritative for colors, copy locks, non-negotiables, and business constraints.
- Treat `DESIGN.md` as secondary inspiration only where it does not conflict.

## 2) Architecture Boundary Review

Current boundary shape:

```text
DesignRules
  ├── CLAUDE.md (authoritative)
  ├── DESIGN.md (secondary inspiration)
  ├── src/app/globals.css (token + utility execution layer)
  ├── src/components/layout/* (shared chrome)
  └── src/app/*/page.tsx (screen composition + section content)
```

Findings:
- Boundary intent is correct, but page files currently leak design-system decisions through many one-off hex values.
- Shared chrome (`site-header.tsx`, `site-footer.tsx`, `site-ticker.tsx`) is mostly centralized, good.
- Content policy is mixed into page code (`testimonials` hardcoded in `src/app/page.tsx`), which increases copy drift risk.

Recommendation (minimal diff):
- Keep architecture as-is.
- Reduce one-off design values and align visible copy to locked text.
- Do not introduce new design abstraction layers yet.

## 3) Code Quality Review

### Confirmed Issues

1. Copy drift in homepage hero body:
- File: `src/app/page.tsx`
- Locked copy expects: "Custom diecast frames for the car obsessed. Nationwide delivery across Pakistan."
- Current copy adds: "Precision engineered to protect your passion."
- Impact: violates locked copy contract and creates future editorial inconsistency.

2. Testimonial trust risk:
- File: `src/app/page.tsx`
- Hardcoded person-name testimonial set may violate "no made-up reviews" constraint if not verified.
- Impact: user trust and brand credibility risk.

3. Static-control smell:
- File: `src/app/shop/page.tsx`
- "Sort By: Newest First" UI appears interactive but has no behavior.
- Impact: unfinished UX signal.

4. Copy inconsistency in trust line:
- File: `src/components/layout/site-footer.tsx`
- Current: "Nationwide Delivery Pakistan | Secure Payment | Handcrafted to Order"
- Locked trust line differs.
- Impact: message drift across key surfaces.

5. Prior hydration bug pattern still fragile:
- File: `src/app/shop/page.tsx`
- Full-card `<Link>` with nested button children has already caused nested-anchor incidents in previous iteration.
- Current state avoids nested `<a>` now, but architecture remains fragile if future button `render={<Link/>}` reappears inside card.
- Impact: high regression risk.

## 4) Test Review

No automated test framework is currently configured in `package.json` scripts.

```text
Current scripts:
  dev, build, start
No test runner script present.
No test/spec files detected by glob.
```

### ASCII Coverage Map

```text
CODE PATH COVERAGE
===========================
[+] src/app/page.tsx
    ├── Hero locked copy rendering
    │   └── [GAP] No test
    ├── Testimonial data rendering
    │   └── [GAP] No test
    ├── CTA and trust line content
    │   └── [GAP] No test
    └── Section composition renders
        └── [GAP] No test

[+] src/app/shop/page.tsx
    ├── status search param normalization
    │   └── [GAP] No test
    ├── status filter button states
    │   └── [GAP] No test
    ├── product card link semantics
    │   └── [GAP] No test (regression-prone)
    ├── availability CTA branch rendering
    │   └── [GAP] No test
    └── preorder ETA text rendering
        └── [GAP] No test

[+] src/components/layout/site-header.tsx
    ├── route active state rendering
    │   └── [GAP] No test
    └── mobile nav sheet render path
        └── [GAP] No test

[+] src/components/layout/site-footer.tsx
    ├── trust line copy rendering
    │   └── [GAP] No test
    └── nav link set rendering
        └── [GAP] No test

─────────────────────────────────
COVERAGE: 0/12 paths tested (0%)
GAPS: 12 required tests missing
CRITICAL REGRESSION RISK: product card link semantics
─────────────────────────────────
```

### Regression Test Plan (Required)

Add a test stack before further UI polish:

1. Unit/integration tests:
- Add runner (recommend Vitest + React Testing Library).
- Validate locked copy, trust line, and CTA content.
- Validate shop status branch rendering and filter selection logic.

2. Regression tests:
- Product card link semantics in `/shop` must never re-introduce nested anchors.
- Add explicit test asserting no nested interactive-anchor composition in product cards.

3. Snapshot/content contract tests:
- Assert locked strings from `CLAUDE.md` are rendered where required.

## 5) Performance Review

Findings:
- Homepage uses large image sections, noise overlays, marquee animation, and high blur/shadow effects.
- On low-end mobile, these can increase paint/repaint costs.
- Current implementation likely acceptable for moderate devices, but there is no measurement baseline.

Performance checks recommended:
- Capture Lighthouse mobile baseline for `/` and `/shop`.
- Verify marquee animation does not trigger layout thrash.
- Confirm texture overlay and heavy shadow/blur combinations do not cause jank on 4x CPU throttle.

## 6) Failure Modes

| Failure Mode | Test Coverage | Error Handling | User Impact |
|---|---|---|---|
| Locked hero copy drifts | No | N/A | Brand inconsistency |
| Trust line drifts across pages | No | N/A | Trust/confusion issue |
| Nested-anchor regression in shop cards | No | No | Hydration/accessibility break |
| Static sort control perceived as broken feature | No | No | Product quality perception drop |
| Heavy visual effects jank low-end devices | No perf test | No adaptive fallback | Sluggish UX |

Critical gaps:
- Nested-anchor regression has no automated guard.
- Locked copy/trust content has no contract tests.

## 7) Minimal-Diff Implementation Surface

Keep follow-up work constrained to:
- `src/app/page.tsx`
- `src/app/shop/page.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `src/app/globals.css`
- Test files/config once test framework is added

Do not add new design systems, CMS integrations, or cross-module abstractions in this pass.

## NOT in Scope

- New homepage visual redesign variants
- Admin panel UI changes
- CMS/content backend migration for all marketing copy
- Broader animation system rewrite

## Completion Summary

- Source-of-truth review: completed (`CLAUDE.md` is authoritative)
- Architecture boundary review: completed
- Code quality review: completed with 5 concrete findings
- Test review: completed, 0/12 paths currently covered
- Performance review: completed with measurement-first recommendation
- Scope guard: completed, minimal-diff surface defined

Status: DONE_WITH_CONCERNS

Primary concern is test debt at 0% coverage on reviewed paths, with known regression risk on shop card link semantics.
