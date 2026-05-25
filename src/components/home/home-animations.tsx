"use client";

import * as React from "react";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap-config";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useIntroReady, useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

type HomeAnimationsProps = {
  children: React.ReactNode;
};

const HIDE_TARGETS = "[data-animate-section]:not([data-animate-section='hero']), [data-animate-item]";
const REVEAL_TARGETS = "[data-animate-section], [data-animate-item]";
const HERO_REVEAL_TARGETS =
  "[data-animate='hero-accent'], [data-animate='hero-label'], [data-animate='hero-heading']";
/** Section-local reveals that start hidden; must be unhidden if GSAP fails or motion is reduced. */
const MOTION_REVEAL_LOCAL = "[data-motion-reveal]";
const DRAWSVG_LINE_TARGETS =
  "[data-hero-svg-accent] line, [data-drawsvg-divider] line, [data-drawsvg-cta] line, [data-drawsvg-vert] line, [data-drawsvg-corners] polyline";

export function HomeAnimations({ children }: HomeAnimationsProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const introReady = useIntroReady();
  const scrollTriggerReady = useScrollTriggerReady();
  const introHasPlayedRef = React.useRef(false);
  const safetyUnhideMs = typeof window !== "undefined" && window.innerWidth < 1024 ? 600 : 1200;

  useGSAP(
    () => {
      if (!introReady || introHasPlayedRef.current) return;

      const root = rootRef.current;
      const mm = gsap.matchMedia();
      const splitInstances: SplitText[] = [];
      const revealAllTargets = (
        targets: string = `${REVEAL_TARGETS}, ${HERO_REVEAL_TARGETS}`,
      ) => {
        gsap.set(targets, { autoAlpha: 1, y: 0, clearProps: "opacity,visibility,transform" });
      };

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          normal: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const reduceMotion = Boolean(context.conditions?.reduceMotion);

          if (reduceMotion) {
            revealAllTargets();
            gsap.set(MOTION_REVEAL_LOCAL, { autoAlpha: 1, y: 0, x: 0, clipPath: "none", clearProps: "all" });
            gsap.set(DRAWSVG_LINE_TARGETS, { drawSVG: "100%", autoAlpha: 1 });
            introHasPlayedRef.current = true;
            return;
          }

          try {
            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.fromTo(
              '[data-animate="hero-accent"]',
              { scaleX: 0, transformOrigin: "left center", autoAlpha: 0 },
              { scaleX: 1, autoAlpha: 1, duration: 0.5 },
            );

            tl.fromTo(
              '[data-animate="hero-label"]',
              { y: 10, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.4 },
              "-=0.3",
            );

            const heroLabel = root?.querySelector('[data-animate="hero-label"]') as HTMLElement | null;
            if (heroLabel) {
              const originalText = heroLabel.textContent ?? "";
              try {
                tl.to(
                  heroLabel,
                  {
                    duration: 0.55,
                    scrambleText: {
                      text: originalText,
                      chars: "upperCase",
                      revealDelay: 0.06,
                      speed: 0.5,
                    },
                  },
                  "-=0.2",
                );
              } catch {
                tl.to(heroLabel, { autoAlpha: 1, y: 0, duration: 0.25 }, "-=0.2");
              }
            }

            const heading = root?.querySelector('[data-animate="hero-heading"]') as HTMLElement | null;
            if (heading) {
              try {
                const split = SplitText.create(heading, {
                  type: "chars",
                  charsClass: "hero-char",
                });
                splitInstances.push(split);

                gsap.set(heading, { autoAlpha: 1 });
                gsap.set(split.chars, { autoAlpha: 0 });
                tl.fromTo(
                  split.chars,
                  { y: 30, autoAlpha: 0 },
                  { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.015 },
                  "-=0.35",
                );
              } catch {
                tl.fromTo(heading, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, "-=0.35");
              }
            }
            introHasPlayedRef.current = true;
          } catch {
            revealAllTargets();
            introHasPlayedRef.current = true;
          }
        },
      );

      return () => {
        splitInstances.forEach((instance) => instance.revert());
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [introReady] },
  );

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;

      const mm = gsap.matchMedia();
      let safetyTimer: ReturnType<typeof setTimeout> | null = null;

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
        },
        (context) => {
          const reduceMotion = Boolean(context.conditions?.reduceMotion);
          const isDesktop = Boolean(context.conditions?.desktop);

          if (reduceMotion) {
            gsap.set(HIDE_TARGETS, { autoAlpha: 1, y: 0, clearProps: "all" });
            gsap.set(HERO_REVEAL_TARGETS, { autoAlpha: 1, y: 0, clearProps: "all" });
            gsap.set(MOTION_REVEAL_LOCAL, { autoAlpha: 1, y: 0, x: 0, clipPath: "none", clearProps: "all" });
            gsap.set(DRAWSVG_LINE_TARGETS, { drawSVG: "100%", autoAlpha: 1 });
            return;
          }

          gsap.set(HIDE_TARGETS, { autoAlpha: 0, y: 40 });
          gsap.set(DRAWSVG_LINE_TARGETS, { drawSVG: "0%" });

          // Hero kinetic pin/scrub is owned by HeroSectionAnimations.
          // Here we only draw the hero accent rule on scroll.
          gsap.fromTo(
            "[data-hero-svg-accent] line",
            { drawSVG: "0%" },
            {
              drawSVG: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: "#hero-section",
                start: "top 85%",
                end: "bottom 40%",
                scrub: 1,
              },
            },
          );
          void isDesktop;

          ScrollTrigger.batch("[data-animate-section]:not([data-animate-section='hero'])", {
            start: "top 92%",
            onEnter: (elements: Element[]) => {
              gsap.to(elements, {
                y: 0,
                autoAlpha: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                overwrite: true,
              });
            },
            once: true,
          });

          ScrollTrigger.batch("[data-animate-item]", {
            start: "top 90%",
            onEnter: (elements: Element[]) => {
              gsap.to(elements, {
                y: 0,
                autoAlpha: 1,
                duration: 0.6,
                stagger: 0.12,
                ease: "power2.out",
                overwrite: true,
              });
            },
            once: true,
          });

          ScrollTrigger.batch("[data-drawsvg-divider], [data-drawsvg-cta]", {
            start: "top 90%",
            once: true,
            onEnter: (elements: Element[]) => {
              const lines = elements.flatMap((el) => Array.from(el.querySelectorAll("line")));
              gsap.fromTo(lines, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.2, ease: "power2.inOut" });
            },
          });

          ScrollTrigger.batch("[data-drawsvg-vert]", {
            start: "top 70%",
            once: true,
            onEnter: (elements: Element[]) => {
              const lines = elements.flatMap((el) => Array.from(el.querySelectorAll("line")));
              gsap.fromTo(lines, { drawSVG: "0 0%" }, { drawSVG: "0 100%", duration: 1.4, ease: "power3.out" });
            },
          });

          ScrollTrigger.batch("[data-drawsvg-corners]", {
            start: "top 75%",
            once: true,
            onEnter: (elements: Element[]) => {
              const lines = elements.flatMap((el) => Array.from(el.querySelectorAll("polyline")));
              gsap.fromTo(
                lines,
                { drawSVG: "0%" },
                { drawSVG: "100%", duration: 0.8, ease: "power2.out", stagger: 0.12 },
              );
            },
          });

          ScrollTrigger.sort();
          ScrollTrigger.refresh();

          safetyTimer = setTimeout(() => {
            const safetySelector = `${HIDE_TARGETS}, ${HERO_REVEAL_TARGETS}, ${MOTION_REVEAL_LOCAL}`;
            const stillHidden = gsap.utils.toArray(safetySelector).filter((target) => {
              if (!(target instanceof HTMLElement)) return false;
              const styles = window.getComputedStyle(target);
              return styles.visibility === "hidden" || Number.parseFloat(styles.opacity) < 0.05;
            }) as HTMLElement[];

            if (stillHidden.length > 0) {
              gsap.set(stillHidden, {
                autoAlpha: 1,
                y: 0,
                clearProps: "opacity,visibility,transform",
              });
            }
          }, safetyUnhideMs);
        },
      );

      return () => {
        if (safetyTimer) clearTimeout(safetyTimer);
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [scrollTriggerReady] },
  );

  return <div ref={rootRef}>{children}</div>;
}
