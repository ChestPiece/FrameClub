"use client";

import * as React from "react";
import { gsap, ScrollTrigger } from "./gsap-config";
import { useGSAP } from "@gsap/react";
import {
  cardTilt,
  countUp,
  overlayEnter,
  overlayExit,
  stepTransition,
  type CardTiltOpts,
  type CountUpOpts,
  type StepDir,
} from "./motion-primitives";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

export type UseStaggerRevealOpts = {
  /** Selector for revealable children (default `[data-reveal]`). */
  selector?: string;
  /** Time between stagger items, seconds. */
  each?: number;
  /** Distance from origin (px). */
  distance?: number;
  /** Tween duration, seconds. */
  duration?: number;
  /** Trigger start (ScrollTrigger string). */
  start?: string;
  /** Stagger origin. */
  from?: "start" | "end" | "center" | "edges";
  /** If false, animate every time the trigger enters; default true (once). */
  once?: boolean;
};

/**
 * Scroll-triggered batch reveal for `[data-reveal]` children of `ref`.
 * Honors `prefers-reduced-motion`. Scoped via `useGSAP` for auto-cleanup.
 */
export function useStaggerReveal(
  ref: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList = [],
  opts: UseStaggerRevealOpts = {}
): void {
  const {
    selector = "[data-reveal]",
    each = 0.08,
    distance = 28,
    duration = 0.7,
    start = "top 88%",
    from = "start",
    once = true,
  } = opts;
  const scrollReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollReady) return;
      const root = ref.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          normal: "(prefers-reduced-motion: no-preference)",
        },
        (ctx: any) => {
          const reduced = ctx.conditions.reduce as boolean;
          const targets = Array.from(root.querySelectorAll(selector)) as HTMLElement[];
          if (targets.length === 0) return;

          if (reduced) {
            gsap.set(targets, { autoAlpha: 1, y: 0 });
            return;
          }

          gsap.set(targets, { autoAlpha: 0, y: distance });

          ScrollTrigger.batch(targets, {
            start,
            once,
            onEnter: (els: Element[]) => {
              gsap.to(els, {
                y: 0,
                autoAlpha: 1,
                duration,
                ease: "power3.out",
                stagger: { each, from },
                overwrite: "auto",
              });
            },
            onLeaveBack: once
              ? undefined
              : (els: Element[]) => {
                  gsap.to(els, { y: distance, autoAlpha: 0, duration: 0.3, ease: "power2.in" });
                },
          });
        }
      );

      return () => mm.revert();
    },
    { scope: ref, dependencies: [scrollReady, ...deps] }
  );
}

/**
 * Pointer tilt for elements matching `[data-tilt]` within `ref`. Hover-capable
 * devices only. Reduced-motion safe (no-op).
 */
export function useCardTilt(
  ref: React.RefObject<HTMLElement | null>,
  opts: CardTiltOpts = {}
): void {
  React.useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia(HOVER_QUERY).matches) return;

    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-tilt]"));
    if (els.length === 0) return;

    const cleanups = els.map((el) => cardTilt(el, opts));
    return () => {
      cleanups.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, opts.max, opts.scale, opts.perspective]);
}

/**
 * Counts up `[data-countup]` numbers in `ref` once when scrolled into view.
 * Reads target from the attribute value or `valueOverride`.
 */
export function useCountUp(
  ref: React.RefObject<HTMLElement | null>,
  valueOverride?: number,
  opts: CountUpOpts = {}
): void {
  const scrollReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollReady) return;
      const root = ref.current;
      if (!root) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const els = Array.from(root.querySelectorAll<HTMLElement>("[data-countup]"));
      if (els.length === 0) return;

      els.forEach((el) => {
        const attr = el.dataset.countup;
        const to = valueOverride ?? (attr ? parseFloat(attr) : NaN);
        if (!Number.isFinite(to)) return;

        if (reduced) {
          el.textContent = (opts.format ?? ((n) => Math.round(n).toLocaleString()))(to);
          return;
        }

        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => {
            countUp(el, to, opts);
          },
        });

        return () => trigger.kill();
      });
    },
    { scope: ref, dependencies: [scrollReady, valueOverride] }
  );
}

/**
 * Drives checkout-style step transitions. Caller registers step elements by
 * index; effect runs swap whenever `activeStep` changes.
 */
export function useStepTransition(activeStep: number) {
  const stepsRef = React.useRef<Map<number, HTMLElement>>(new Map());
  const prevStep = React.useRef<number>(activeStep);

  const registerStep = React.useCallback(
    (idx: number) => (el: HTMLElement | null) => {
      if (el) stepsRef.current.set(idx, el);
      else stepsRef.current.delete(idx);
    },
    []
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const incoming = stepsRef.current.get(activeStep);
    const outgoing = stepsRef.current.get(prevStep.current) ?? null;

    if (!incoming) {
      prevStep.current = activeStep;
      return;
    }

    if (reduced) {
      stepsRef.current.forEach((el, idx) => {
        el.style.opacity = idx === activeStep ? "1" : "0";
        el.style.pointerEvents = idx === activeStep ? "" : "none";
      });
      prevStep.current = activeStep;
      return;
    }

    const dir: StepDir = activeStep >= prevStep.current ? "forward" : "back";
    stepTransition(outgoing && outgoing !== incoming ? outgoing : null, incoming, dir);
    prevStep.current = activeStep;
  }, [activeStep]);

  return { registerStep };
}

/**
 * Animates a fullscreen / overlay nav open/close. `panelRef` is the panel,
 * `linksSelector` queries inside the panel.
 */
export function useOverlayMotion(
  isOpen: boolean,
  panelRef: React.RefObject<HTMLElement | null>,
  linksSelector: string,
  backdropRef?: React.RefObject<HTMLElement | null>
): void {
  const mountedRef = React.useRef(false);

  React.useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const links = Array.from(panel.querySelectorAll<HTMLElement>(linksSelector));
    const backdrop = backdropRef?.current ?? null;

    if (!mountedRef.current && !isOpen) {
      mountedRef.current = true;
      gsap.set(panel, { clipPath: "inset(0% 0% 100% 0%)", autoAlpha: 1 });
      if (backdrop) gsap.set(backdrop, { autoAlpha: 0 });
      if (links.length) gsap.set(links, { autoAlpha: 0, y: 24 });
      return;
    }
    mountedRef.current = true;

    if (reduced) {
      if (isOpen) {
        gsap.set(panel, { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1 });
        if (backdrop) gsap.set(backdrop, { autoAlpha: 1 });
        if (links.length) gsap.set(links, { autoAlpha: 1, y: 0 });
        document.body.style.overflow = "hidden";
      } else {
        gsap.set(panel, { clipPath: "inset(0% 0% 100% 0%)" });
        if (backdrop) gsap.set(backdrop, { autoAlpha: 0 });
        if (links.length) gsap.set(links, { autoAlpha: 0, y: 24 });
        document.body.style.overflow = "";
      }
      return;
    }

    let tl: gsap.core.Timeline;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      tl = overlayEnter(panel, links, backdrop);
    } else {
      tl = overlayExit(panel, links, backdrop);
      tl.eventCallback("onComplete", () => {
        document.body.style.overflow = "";
      });
    }

    return () => {
      tl.kill();
    };
  }, [isOpen, panelRef, linksSelector, backdropRef]);
}
