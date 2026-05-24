"use client";

import { gsap, ScrollTrigger } from "@/lib/animation/gsap-config";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

/**
 * About: hero SplitText + kicker ScrambleText + DrawSVG accents; timeline connector + phase headings on scroll.
 */
export function AboutAnimations() {
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

          const heading = document.querySelector("[data-about-heading]") as HTMLElement | null;
          const kicker = document.querySelector("[data-about-kicker]") as HTMLElement | null;
          const kickerLines = gsap.utils.toArray<SVGLineElement>("[data-drawsvg-about-kicker] line");
          const timelineLines = gsap.utils.toArray<SVGLineElement>("[data-drawsvg-timeline] line");

          if (reduceMotion) {
            if (heading) gsap.set(heading, { autoAlpha: 1, clearProps: "all" });
            if (kicker) gsap.set(kicker, { autoAlpha: 1, clearProps: "all" });
            if (kickerLines.length) gsap.set(kickerLines, { drawSVG: "100%", autoAlpha: 1 });
            if (timelineLines.length) gsap.set(timelineLines, { drawSVG: "100%", autoAlpha: 1 });
            gsap.set("[data-timeline-heading]", { autoAlpha: 1, y: 0, clearProps: "all" });
            return;
          }

          if (kickerLines.length) gsap.set(kickerLines, { drawSVG: "0%" });
          if (timelineLines.length) gsap.set(timelineLines, { drawSVG: "0%" });

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          if (kicker) {
            const originalText = kicker.textContent ?? "";
            gsap.set(kicker, { autoAlpha: 1 });
            try {
              tl.to(
                kicker,
                {
                  duration: 0.85,
                  scrambleText: {
                    text: originalText,
                    chars: "upperCase",
                    revealDelay: 0.08,
                    speed: 0.32,
                  },
                },
                0,
              );
            } catch {
              tl.fromTo(kicker, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, 0);
            }
          }

          if (kickerLines.length) {
            tl.fromTo(
              kickerLines,
              { drawSVG: "0%" },
              { drawSVG: "100%", duration: 0.45, ease: "none" },
              0.35,
            );
          }

          if (heading) {
            try {
              if (!heading.getAttribute("aria-label")) {
                heading.setAttribute("aria-label", heading.textContent ?? "");
              }
              const split = SplitText.create(heading, {
                type: "chars",
                charsClass: "about-hero-char",
              });
              splitInstances.push(split);
              gsap.set(heading, { autoAlpha: 1 });
              gsap.set(split.chars, { autoAlpha: 0 });
              tl.fromTo(
                split.chars,
                { y: 40, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.04 },
                0.1,
              );
            } catch {
              tl.fromTo(
                heading,
                { y: 40, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.8 },
                0.1,
              );
            }
          }

          gsap.set("[data-timeline-heading]", { autoAlpha: 0, y: 20 });

          ScrollTrigger.batch("[data-drawsvg-timeline] line", {
            once: true,
            start: "top 80%",
            onEnter: (elements) => {
              gsap.fromTo(
                elements,
                { drawSVG: "0%" },
                { drawSVG: "100%", duration: 1.6, ease: "power2.inOut" },
              );
            },
          });

          ScrollTrigger.batch("[data-timeline-heading]", {
            once: true,
            start: "top 85%",
            onEnter: (elements) => {
              gsap.to(elements, {
                y: 0,
                autoAlpha: 1,
                duration: 0.65,
                stagger: 0.15,
                ease: "power2.out",
              });
            },
          });
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
