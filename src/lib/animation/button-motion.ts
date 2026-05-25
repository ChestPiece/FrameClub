"use client";

export const BUTTON_MOTION_SELECTOR = "[data-button-motion]";
export const BUTTON_FILL_SELECTOR = "[data-button-fill]";
export const BUTTON_SHEEN_SELECTOR = "[data-button-sheen]";
export const BUTTON_LABEL_SELECTOR = "[data-button-label]";
export const BUTTON_LABEL_GHOST_SELECTOR = "[data-button-label-ghost]";
export const BUTTON_ICON_SELECTOR = "[data-button-icon]";
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export type ButtonMotionLevel = "strong" | "default" | "subtle" | "minimal";

export const BUTTON_MOTION_LEVEL_ATTR = "data-button-motion-level";

type Tween = { duration: number; ease: string; [k: string]: number | string };

type MotionSet = {
  rest: Tween;
  hover: Tween;
  press: Tween;
};

// Premium motion: scale + subtle lift (y) + filter brightness on press.
// Sharp eases (expo / power3) match the brand's 0px-radius, hard-edge aesthetic.
export const BUTTON_MOTION_TWEENS: Record<ButtonMotionLevel, MotionSet> = {
  strong: {
    rest:  { scale: 1,     y: 0,  duration: 0.45, ease: "expo.out" },
    hover: { scale: 1.025, y: -2, duration: 0.5,  ease: "expo.out" },
    press: { scale: 0.97,  y: 1,  duration: 0.12, ease: "power3.out" },
  },
  default: {
    rest:  { scale: 1,     y: 0,    duration: 0.4,  ease: "expo.out" },
    hover: { scale: 1.018, y: -1.5, duration: 0.42, ease: "expo.out" },
    press: { scale: 0.975, y: 1,    duration: 0.1,  ease: "power3.out" },
  },
  subtle: {
    rest:  { scale: 1,    y: 0,  duration: 0.32, ease: "power3.out" },
    hover: { scale: 1.01, y: -1, duration: 0.34, ease: "power3.out" },
    press: { scale: 0.99, y: 0,  duration: 0.1,  ease: "power3.out" },
  },
  minimal: {
    rest:  { scale: 1,     y: 0, duration: 0.24, ease: "power3.out" },
    hover: { scale: 1.008, y: 0, duration: 0.26, ease: "power3.out" },
    press: { scale: 0.992, y: 0, duration: 0.1,  ease: "power3.out" },
  },
};

// Diagonal sheen sweep across button surface on hover.
export const BUTTON_SHEEN_TWEENS = {
  rest:  { xPercent: -120, opacity: 0,    duration: 0,    ease: "none" },
  hover: { xPercent: 120,  opacity: 0.55, duration: 0.85, ease: "expo.out" },
} as const;

// Label split shift: primary text slides up out, ghost slides up in.
export const BUTTON_LABEL_TWEENS = {
  primary: {
    rest:  { yPercent: 0,    duration: 0.4,  ease: "expo.out" },
    hover: { yPercent: -110, duration: 0.42, ease: "expo.out" },
  },
  ghost: {
    rest:  { yPercent: 110,  duration: 0.4,  ease: "expo.out" },
    hover: { yPercent: 0,    duration: 0.42, ease: "expo.out" },
  },
} as const;

// Icon nudge (arrow / chevron child marked data-button-icon).
export const BUTTON_ICON_TWEENS = {
  rest:  { x: 0, duration: 0.35, ease: "expo.out" },
  hover: { x: 6, duration: 0.4,  ease: "expo.out" },
} as const;

export const BUTTON_FILL_TWEENS = {
  fillIn:  { scaleX: 1, duration: 0.32, ease: "expo.out" },
  fillOut: { scaleX: 0, duration: 0.24, ease: "expo.in" },
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
