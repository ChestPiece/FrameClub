# Design System Documentation: The Machined Monolith

## 1. Overview & Creative North Star
This design system is built upon the concept of **"The Machined Monolith."** It rejects the soft, bubbly aesthetics of modern SaaS in favor of a precision-engineered, automotive-inspired editorial experience. It is designed to feel heavy, expensive, and indestructible.

The "North Star" for this system is the high-end automotive brochure—where whitespace is as much a luxury as the product itself, and typography is used as a structural element rather than just a medium for information. We achieve a custom feel by utilizing intentional asymmetry, massive typographic scale shifts, and a rigid adherence to a 0px radius "sharp edge" philosophy.

---

## 2. Colors: Tonal Depth & The Heartbeat Red
The palette is rooted in deep blacks and warm, dark greys to mimic the interior of a luxury vehicle or a darkened gallery space.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined through background color shifts. Use `surface_container_low` (#1C1B1B) sections against a `background` (#141313) to create silent partitions. The layout should feel like it is composed of interlocking slabs, not outlined boxes.

### Surface Hierarchy & Nesting
Depth is achieved through "Tonal Layering." 
- **Base:** `surface_dim` (#141313) for the primary canvas.
- **Sectioning:** `surface_container_lowest` (#0E0E0E) for recessed areas.
- **Elevation:** `surface_container_highest` (#353434) for floating elements like modals or high-priority cards.

### Signature Textures & Glass
To provide visual "soul," use subtle gradients on primary CTAs transitioning from `primary_container` (#380306) to a slightly brighter variant of `on_secondary_fixed_variant` (#8E130C). For floating navigation, apply a `surface_bright` (#3A3939) at 60% opacity with a 20px backdrop blur to create a "Frosted Carbon" effect.

---

## 3. Typography: The Editorial Voice
Our typography defines our authority. It is a dialogue between the industrial aggression of Bebas Neue and the technical precision of Inter.

- **Headlines (Bebas Neue):** These must be treated as graphics. Use `display-lg` for hero sections with a tracking value of `0.1em` to `0.2em`. Headlines should often be all-caps to reinforce the "machined" aesthetic.
- **Body (Inter):** Inter provides the functional contrast. Use `body-lg` (16px) as the standard. To maintain the premium feel, never drop below a `1.6` line-height for body copy.
- **Hierarchy as Brand:** Use extreme scale differences. A `display-lg` headline sitting next to a `label-sm` technical specification creates the "Editorial Tension" found in high-end fashion and automotive magazines.

---

## 4. Elevation & Depth: Tonal Stacking
In this design system, we do not use traditional drop shadows to indicate elevation. We use light and tone.

- **The Layering Principle:** Place a `surface_container_high` (#2A2A2A) element on top of `surface_dim` (#141313) to create a natural lift.
- **Ambient Light Leaks:** When a floating effect is required (e.g., a modal), use an extra-diffused "Ambient Light" shadow. Instead of black, the shadow should be a low-opacity `surface_tint` (#FFB3AF) at 4% opacity with a 40px blur, mimicking the way light catches the edge of a precision-cut glass pane.
- **The Ghost Border:** If a boundary is required for accessibility, use the `outline_variant` (#544342) at 15% opacity. It should be felt, not seen.

---

## 5. Components: Precision Primitives

### Buttons
- **Primary:** Sharp 0px edges. Background: `primary_container` (#380306). Text: `on_primary` (#591B1B). On hover, transition instantly to `secondary_container` (#8E130C).
- **Secondary:** Transparent background with a `Ghost Border`. Text: `primary_fixed_dim`. 
- **Interaction:** Buttons should not "squish." Use opacity shifts or color fills to indicate state—maintain the rigidity of the shape.

### Cards & Specification Lists
- **Cards:** Forbid divider lines. Separate content using `surface_container` shifts and generous padding (minimum 40px). 
- **The Tech-Spec List:** For product details, use a "Specification Grid." Key-value pairs should use `label-md` for the key (muted) and `title-sm` for the value (high contrast), separated by whitespace alone.

### Input Fields
- **Styling:** Avoid the "four-walled" box. Use a `surface_container_highest` background with a 2px bottom stroke using `outline`. 
- **States:** On focus, the bottom stroke transforms to `primary` (#FFB3AF).

### Tooltips & Overlays
- **Visuals:** Use `surface_bright` (#3A3939) with 0px radius. Tooltips should feel like small "spec plates" attached to the UI.

---

## 6. Do's and Don'ts

### Do
- **Embrace Asymmetry:** Offset your hero images or text blocks to create a dynamic, custom-built feel.
- **Use Massive Padding:** If you think there is enough whitespace, add 20% more. Premium brands breathe.
- **Align to a Rigid Grid:** While the layout is asymmetric, elements must be mathematically aligned to a strict column grid to maintain the "machined" look.

### Don't
- **Never use Border Radius:** Even a 1px radius breaks the Monolith aesthetic. Keep it at 0px.
- **Avoid Pure White:** Use `primary_text` (#F5F5F5) for high contrast and `muted_text` (#888888) for descriptions. Pure `#FFFFFF` is too harsh for this dark environment.
- **No Traditional Shadows:** Standard grey/black drop shadows will make the UI look "cheap" and "web-native." Stick to tonal shifts and light-leaks.
- **No Icons without Purpose:** Only use minimalist, thin-stroke icons. Never use "filled" or "playful" iconography.