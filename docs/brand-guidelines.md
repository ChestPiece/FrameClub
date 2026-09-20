# FRAMECLUB — Brand Guidelines & Design System

> Status: **Locked** · Updated 2026-09-20  
> Codename: **Warm Frame Atelier** · Origin: **Multan**  
> Live tokens: `src/app/globals.css` · Style lock: `.tastemaker/style-lock.md`  
> Marketing copy: `src/lib/content/copy-constants.ts`

---

## 0. Why this identity (decision)

| Option | Verdict |
|--------|---------|
| Keep Machined Monolith (0px, Lahore) | Rejected — user wants Multan + soft corners |
| Multani blue pottery recolor | Rejected — fights diecast photography + locked red DNA |
| Soft beige / light craft | Rejected — kills gallery drama for dark product shots |
| **Warm Frame Atelier** | **Chosen** — dark slabs + heartbeat red + Multan craft + 8px soft frame edges |

The product is a **frame**. Soft radius mirrors finished wood/glass corners. Dark + red stays the visual moat; Multan is the soul signal in copy and place.

---

## 1. Visual thesis

**A diecast on a shelf is a toy. The same car, framed in Multan, is a piece you hang.**

Gallery that sells one object. Quiet, expensive, approachable craft — not industrial blades, not toy Shopify.

| Dial | Target |
|------|--------|
| Art direction | 8 |
| Motion | 7 |
| Density | 3 |
| Softness | 5 (8px — smooth, never pill) |

**Anti-references:** toy Shopify, SaaS card grids, neon garage, purple gradients, `rounded-full` chrome, fake testimonials, 0px-everywhere brutalism.

---

## 2. Brand identity

| | |
|--|--|
| **Name** | FRAMECLUB |
| **Origin** | Multan, Pakistan · made to order |
| **Promise** | Built once. Framed forever. |
| **Eyebrow** | EST. MULTAN · MADE TO ORDER |
| **Price** | Rs. 5,000 · one line · no discounts |
| **Payment** | PayFast upfront |

### Personality

**Precise · Warm · Obsessive**

Still not playful. Multan adds craft warmth; Bebas still owns the billboard.

### Voice

| Do | Don't |
|----|-------|
| Multan workshop honesty | Lahore (retired) |
| Specs as proof | Fake social proof |
| Imperative CTAs | Soft CTA spam |

### Wordmark

`FRAMECLUB` in Bebas, all caps. Footer masthead oversized. No gradient fill, no shadow.

---

## 3. Color (unchanged DNA)

Surfaces: `#0E0E0E` `#141313` `#1C1B1B` `#2A2A2A` `#353434`  
Reds: `#380306` decorative · `#8E130C` mid · `#C0392B` CTA  
Text: `#F5F5F5` / `#888888` / `#D4B8B8`  
CTA labels always `#F5F5F5` on bright or mid.

---

## 4. Shape — soft frame radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 6px | Badges, chips |
| `--radius` / md | **8px** | Buttons, fields, filters |
| `--radius-lg` | 12px | Cards, media shells |
| `--radius-xl` | 16px | Large panels |

Concentric: outer ≈ inner + padding. No global `border-radius: 0`. No pills on primary UI.

---

## 5. Typography

Bebas Neue (display) + Inter (body). Scales via `.display-*` utilities. Body 15–16px / 1.6.

---

## 6. Motion

GSAP + one smooth-scroll engine. UI ≤160–200ms. Reduced motion → final states. Checkout near-static.

---

## 7. Components

- Buttons: `rounded-md`, brand-bright fill  
- Fields: `.machined-field` + `--radius`  
- Cards / catalog: `rounded-lg` + overflow clip on media  
- Badges: `rounded-sm`  
- Default still: no decorative card chrome without interaction  

---

## 8. Skills stack

| Skill | Role |
|-------|------|
| `ponytail` | Shortest correct change |
| `build-awwwards-quality-sites` | Quality bar |
| `brand` / `design-system` / `design-token` | Identity + tokens |
| `better-ui` | Concentric radius |
| `better-typography` / `color-system` | Type + contrast |
| `no-ai-design-slop` | Anti-generic gate |
| `documentary-brutalist-agency` | Billboard type (softened corners) |
| `cinematic-gsap-*` | Motion taste; keep current scroll provider |
| `form-design` | Checkout / contact |

---

## 9. Source map

| Concern | File |
|---------|------|
| Tokens | `src/app/globals.css` |
| Style lock | `.tastemaker/style-lock.md` |
| Copy | `src/lib/content/copy-constants.ts` |
| Agent rules | `CLAUDE.md` |

---

*FRAMECLUB · Multan · Made to order*
