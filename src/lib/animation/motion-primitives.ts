"use client";

/**
 * Pure motion factories (no React). Co-located hooks live in `motion-hooks.ts`.
 *
 * Data-attribute contract:
 *   data-reveal          opt-in for stagger reveal
 *   data-reveal-group    container; hook queries [data-reveal] children
 *   data-tilt            apply pointer card tilt
 *   data-countup="1234"  target numeric value
 *   data-anim-step       checkout step container (value = index)
 *   data-no-anim         explicit opt-out
 */

import { gsap } from "./gsap-config";
import { Flip } from "gsap/all";
import { animate, createSpring } from "./anime-config";

export type RiseInOpts = {
  delay?: number;
  distance?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
};

export function riseIn(target: gsap.TweenTarget, opts: RiseInOpts = {}): gsap.core.Tween {
  const { delay = 0, distance = 24, duration = 0.7, ease = "power3.out", stagger = 0 } = opts;
  return gsap.fromTo(
    target,
    { y: distance, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, delay, duration, ease, stagger, overwrite: "auto" }
  );
}

export type ClipRevealOpts = {
  axis?: "x" | "y";
  duration?: number;
  ease?: string;
  delay?: number;
};

export function clipReveal(target: gsap.TweenTarget, opts: ClipRevealOpts = {}): gsap.core.Tween {
  const { axis = "y", duration = 0.9, ease = "expo.out", delay = 0 } = opts;
  const from =
    axis === "y" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";
  return gsap.fromTo(
    target,
    { clipPath: from, autoAlpha: 1 },
    { clipPath: "inset(0% 0% 0% 0%)", duration, ease, delay, overwrite: "auto" }
  );
}

export type StaggerRevealOpts = {
  each?: number;
  from?: "start" | "end" | "center" | "edges";
  distance?: number;
  duration?: number;
  ease?: string;
};

export function staggerReveal(
  targets: gsap.TweenTarget,
  opts: StaggerRevealOpts = {}
): gsap.core.Tween {
  const { each = 0.06, from = "start", distance = 28, duration = 0.7, ease = "power3.out" } = opts;
  return gsap.fromTo(
    targets,
    { y: distance, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration, ease, stagger: { each, from }, overwrite: "auto" }
  );
}

export type CardTiltOpts = {
  max?: number;
  scale?: number;
  perspective?: number;
};

export function cardTilt(el: HTMLElement, opts: CardTiltOpts = {}): () => void {
  const { max = 6, scale = 1.02, perspective = 800 } = opts;
  const setX = gsap.quickTo(el, "rotationY", { duration: 0.4, ease: "power2.out" });
  const setY = gsap.quickTo(el, "rotationX", { duration: 0.4, ease: "power2.out" });
  const setS = gsap.quickTo(el, "scale", { duration: 0.4, ease: "power2.out" });

  gsap.set(el, { transformPerspective: perspective, transformOrigin: "center" });

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setX(px * max * 2);
    setY(-py * max * 2);
    setS(scale);
  };
  const onLeave = () => {
    setX(0);
    setY(0);
    setS(1);
  };

  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerleave", onLeave);
  el.addEventListener("pointercancel", onLeave);

  return () => {
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerleave", onLeave);
    el.removeEventListener("pointercancel", onLeave);
    gsap.set(el, { clearProps: "rotationX,rotationY,scale,transformPerspective" });
  };
}

export type CountUpOpts = {
  duration?: number;
  ease?: string;
  format?: (n: number) => string;
  from?: number;
};

export function countUp(el: HTMLElement, to: number, opts: CountUpOpts = {}) {
  const {
    duration = 1400,
    ease = "outExpo",
    format = (n: number) => Math.round(n).toLocaleString(),
    from = 0,
  } = opts;
  const proxy = { value: from };
  return animate(proxy, {
    value: to,
    duration,
    ease,
    onUpdate: () => {
      el.textContent = format(proxy.value);
    },
  });
}

/**
 * Wraps `Flip.getState` / `Flip.from` for grid reorders. `applyChange` must
 * mutate the DOM/state so children land in their new order, then Flip animates
 * from the captured prior state.
 */
export function flipReorder(
  items: Element | Element[] | string,
  applyChange: () => void,
  opts: { duration?: number; ease?: string; stagger?: number } = {}
): void {
  const { duration = 0.5, ease = "power2.inOut", stagger = 0.02 } = opts;
  const state = Flip.getState(items);
  applyChange();
  Flip.from(state, { duration, ease, stagger, absolute: false });
}

export type StepDir = "forward" | "back";

export function stepTransition(
  outEl: HTMLElement | null,
  inEl: HTMLElement,
  dir: StepDir = "forward"
): gsap.core.Timeline {
  const offset = dir === "forward" ? 24 : -24;
  const tl = gsap.timeline({ defaults: { duration: 0.28, ease: "power2.out" } });
  if (outEl && outEl !== inEl) {
    tl.to(outEl, { x: -offset, autoAlpha: 0, duration: 0.18 });
  }
  tl.fromTo(
    inEl,
    { x: offset, autoAlpha: 0 },
    { x: 0, autoAlpha: 1, clearProps: "x" },
    outEl && outEl !== inEl ? "-=0.06" : 0
  );
  return tl;
}

export function overlayEnter(
  panel: HTMLElement,
  links: string | Element[],
  backdrop?: HTMLElement | null
): gsap.core.Timeline {
  const tl = gsap.timeline();
  if (backdrop) {
    tl.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: "power2.out" }, 0);
  }
  tl.fromTo(
    panel,
    { clipPath: "inset(0% 0% 100% 0%)", autoAlpha: 1 },
    { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "expo.out" },
    0
  );
  tl.fromTo(
    links,
    { y: 24, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out", stagger: 0.05 },
    "-=0.3"
  );
  return tl;
}

export function overlayExit(
  panel: HTMLElement,
  links: string | Element[],
  backdrop?: HTMLElement | null
): gsap.core.Timeline {
  const tl = gsap.timeline();
  tl.to(links, { y: 10, autoAlpha: 0, duration: 0.2, ease: "power2.in", stagger: 0.02 }, 0);
  tl.to(
    panel,
    { clipPath: "inset(0% 0% 100% 0%)", duration: 0.4, ease: "expo.in" },
    "-=0.05"
  );
  if (backdrop) {
    tl.to(backdrop, { autoAlpha: 0, duration: 0.25, ease: "power2.in" }, "-=0.25");
  }
  return tl;
}

export const SPRING_POP = createSpring({ stiffness: 220, damping: 14, mass: 1 });
