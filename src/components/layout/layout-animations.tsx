"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap-config";
import { useStaggerReveal } from "@/lib/animation";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

/**
 * Footer reveal: SplitText wordmark by chars, scroll-triggered stagger,
 * then stagger-reveal of column links via [data-reveal] inside linksContainerRef.
 */
export function useFooterReveal(
  wordmarkRef: React.RefObject<HTMLElement | null>,
  linksContainerRef: React.RefObject<HTMLElement | null>
): void {
  const scrollReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollReady) return;
      const wordmark = wordmarkRef.current;
      if (!wordmark) return;

      const mm = gsap.matchMedia();
      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          normal: "(prefers-reduced-motion: no-preference)",
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ctx: any) => {
          const reduced = ctx.conditions.reduce as boolean;

          if (reduced) {
            gsap.set(wordmark, { autoAlpha: 1 });
            return;
          }

          gsap.set(wordmark, { autoAlpha: 1 });

          const split = new SplitText(wordmark, {
            type: "words,chars",
            charsClass: "fc-footer-char",
            wordsClass: "fc-footer-word",
          });

          // Prevent chars from breaking layout — keep them inline-block & overflow-hidden parent.
          split.chars.forEach((c) => {
            (c as HTMLElement).style.display = "inline-block";
            (c as HTMLElement).style.willChange = "transform, opacity";
          });
          split.words.forEach((w) => {
            (w as HTMLElement).style.display = "inline-block";
            (w as HTMLElement).style.overflow = "hidden";
            (w as HTMLElement).style.verticalAlign = "top";
          });

          gsap.set(split.chars, { yPercent: 100, autoAlpha: 0 });

          const trigger = ScrollTrigger.create({
            trigger: wordmark,
            start: "top 88%",
            once: true,
            onEnter: () => {
              gsap.to(split.chars, {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.7,
                ease: "expo.out",
                stagger: { each: 0.03 },
              });
            },
          });

          return () => {
            trigger.kill();
            split.revert();
          };
        }
      );

      return () => mm.revert();
    },
    { scope: wordmarkRef, dependencies: [scrollReady] }
  );

  useStaggerReveal(linksContainerRef, [scrollReady], {
    selector: "[data-reveal]",
    each: 0.05,
    distance: 18,
    duration: 0.6,
    start: "top 92%",
  });
}

/**
 * Hamburger morph: animates 3 bars into an X based on isOpen.
 * Reduced-motion: instant snap.
 */
export function useHamburgerMorph(
  isOpen: boolean,
  topRef: React.RefObject<HTMLElement | null>,
  bottomRef: React.RefObject<HTMLElement | null>,
  middleRef?: React.RefObject<HTMLElement | null>
): void {
  React.useEffect(() => {
    const top = topRef.current;
    const bottom = bottomRef.current;
    const middle = middleRef?.current ?? null;
    if (!top || !bottom) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const duration = reduced ? 0 : 0.3;
    const ease = "power2.inOut";

    if (isOpen) {
      gsap.to(top, { y: 6, rotate: 45, duration, ease, overwrite: "auto" });
      gsap.to(bottom, { y: -6, rotate: -45, duration, ease, overwrite: "auto" });
      if (middle) gsap.to(middle, { autoAlpha: 0, duration, ease, overwrite: "auto" });
    } else {
      gsap.to(top, { y: 0, rotate: 0, duration, ease, overwrite: "auto" });
      gsap.to(bottom, { y: 0, rotate: 0, duration, ease, overwrite: "auto" });
      if (middle) gsap.to(middle, { autoAlpha: 1, duration, ease, overwrite: "auto" });
    }
  }, [isOpen, topRef, bottomRef, middleRef]);
}
