"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  animate,
  createSpring,
  animeReady,
  useStaggerReveal,
} from "@/lib/animation";

type ProductDetailAnimationsProps = {
  children: React.ReactNode;
};

/**
 * Wraps the product detail surfaces and runs a scroll-triggered batch reveal
 * for any `[data-reveal]` children. Reduced-motion safe via underlying hook.
 */
export function ProductDetailAnimations({ children }: ProductDetailAnimationsProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  useStaggerReveal(rootRef, [], { each: 0.08, distance: 28 });

  return (
    <div ref={rootRef} style={{ display: "contents" }}>
      {children}
    </div>
  );
}

/**
 * Single subtle "beat" on mount for the primary CTA button. Skipped under
 * reduced-motion. Runs once.
 */
export function useProductCtaPulse(ref: React.RefObject<HTMLElement | null>): void {
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!animeReady()) return;
      gsap.fromTo(
        el,
        { scale: 1 },
        {
          keyframes: [
            { scale: 1.04, duration: 0.5, ease: "power2.out" },
            { scale: 1, duration: 0.2, ease: "power2.inOut" },
          ],
          overwrite: "auto",
        }
      );
    },
    { dependencies: [] }
  );
}

/**
 * Returns an imperative click handler that fires a small spring-driven scale
 * pop on the target element. Reduced-motion safe (no-op).
 */
export function useVariantSwatchSpring() {
  return React.useCallback((el: HTMLElement | null) => {
    if (!el) return;
    if (!animeReady()) return;
    const spring = createSpring({ stiffness: 220, damping: 14 });
    animate(el, {
      scale: [1, 1.08, 1],
      duration: 600,
      ease: spring,
    });
  }, []);
}

/**
 * Crossfades a single `<img>` element when `src` changes. Use on a stable
 * element ref; the previous frame fades down while the new src eases in.
 * Reduced-motion safe (no-op transition).
 */
export function useImageCrossfade(
  ref: React.RefObject<HTMLElement | null>,
  src: string | null | undefined
): void {
  const prevSrc = React.useRef<string | null | undefined>(src);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prevSrc.current === src) return;
    prevSrc.current = src;
    if (!animeReady()) return;
    animate(el, {
      opacity: [0, 1],
      scale: [1.02, 1],
      duration: 250,
      ease: "outQuad",
    });
  }, [ref, src]);
}
