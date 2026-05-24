"use client";

import { gsap } from "@/lib/animation/gsap-config";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

/**
 * Contact page intro: heading SplitText + kicker ScrambleText.
 */
export function ContactAnimations() {
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;

      const splitInstances: SplitText[] = [];
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          normal: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const reduceMotion = Boolean(context.conditions?.reduceMotion);

          const heading = document.querySelector("[data-contact-heading]") as HTMLElement | null;
          const kicker = document.querySelector("[data-contact-kicker]") as HTMLElement | null;
          if (reduceMotion) {
            if (heading) gsap.set(heading, { autoAlpha: 1, clearProps: "all" });
            if (kicker) gsap.set(kicker, { autoAlpha: 1, clearProps: "all" });
            return;
          }

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          if (kicker) {
            const originalText = kicker.textContent ?? "";
            gsap.set(kicker, { autoAlpha: 1 });
            try {
              tl.to(
                kicker,
                {
                  duration: 0.75,
                  scrambleText: {
                    text: originalText,
                    chars: "upperCase",
                    revealDelay: 0.06,
                    speed: 0.32,
                  },
                },
                0,
              );
            } catch {
              tl.fromTo(kicker, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, 0);
            }
          }

          if (heading) {
            try {
              if (!heading.getAttribute("aria-label")) {
                heading.setAttribute("aria-label", heading.textContent ?? "");
              }
              const split = SplitText.create(heading, {
                type: "chars",
                charsClass: "contact-hero-char",
              });
              splitInstances.push(split);
              gsap.set(heading, { autoAlpha: 1 });
              gsap.set(split.chars, { autoAlpha: 0 });
              tl.fromTo(
                split.chars,
                { y: 50, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.85, stagger: 0.03 },
                0.08,
              );
            } catch {
              tl.fromTo(
                heading,
                { y: 50, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.85 },
                0.08,
              );
            }
          }

        },
      );

      return () => {
        splitInstances.forEach((s) => s.revert());
        mm.revert();
      };
    },
    { dependencies: [scrollTriggerReady] },
  );

  return null;
}
