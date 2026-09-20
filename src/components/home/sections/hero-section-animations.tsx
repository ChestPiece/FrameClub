"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

/** H3 fold: clip-path media reveal once. Reduced-motion → final state. */
export function HeroSectionAnimations() {
  const scrollTriggerReady = useScrollTriggerReady();
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;

      const media = document.querySelector<HTMLElement>("[data-hero-media]");
      if (!media) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(media, { clipPath: "inset(0 0 0 0)" });
        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          media,
          { clipPath: "inset(8% 8% 8% 8%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power3.out",
            delay: 0.15,
          },
        );
        return () => {
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [scrollTriggerReady] },
  );

  return <div ref={rootRef} className="hidden" aria-hidden="true" />;
}
