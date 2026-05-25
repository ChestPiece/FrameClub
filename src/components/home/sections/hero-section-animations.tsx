"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap-config";
import { SplitText } from "gsap/SplitText";
import { waitForLayoutStable } from "@/lib/animation/wait-for-layout-stable";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

/**
 * Hero kinetic layer:
 *  - Act 2 photo strip: horizontal scrub pinned to its container.
 *  - Vertical Bebas marquee: infinite loop, paused if reduced-motion.
 *  - Stat count-up: triggers once when Act 2 enters viewport.
 *  - Reduced-motion: skip pin/marquee/count-up; show static final state.
 */
export function HeroSectionAnimations() {
  const scrollTriggerReady = useScrollTriggerReady();
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;

      const mm = gsap.matchMedia();
      let cancelled = false;

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          normal: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const reduceMotion = Boolean(ctx.conditions?.reduceMotion);
          if (reduceMotion) {
            // Static — nothing to clean up.
            return;
          }

          const cleanups: Array<() => void> = [];

          (async () => {
            await waitForLayoutStable(2);
            if (cancelled) return;

            const act2 = document.querySelector<HTMLElement>("[data-hero-act='2']");
            const viewport = document.querySelector<HTMLElement>(
              "[data-hero-marquee-viewport]",
            );
            const track = document.querySelector<HTMLElement>(
              "[data-hero-marquee-track]",
            );

            // ---- Horizontal photo strip scrub (pinned) ----
            if (act2 && viewport && track) {
              const computeDistance = () => {
                const overflow = track.scrollWidth - viewport.clientWidth;
                return Math.max(0, overflow);
              };

              const stripTween = gsap.to(track, {
                x: () => -computeDistance(),
                ease: "none",
                scrollTrigger: {
                  trigger: act2,
                  start: "top top+=80",
                  end: () => `+=${Math.max(800, computeDistance() + 400)}`,
                  scrub: 1,
                  pin: true,
                  pinSpacing: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              });

              // Photo center-scale pop
              const items = gsap.utils.toArray<HTMLElement>("[data-hero-marquee-item]");
              items.forEach((item) => {
                const tween = gsap.fromTo(
                  item,
                  { scale: 1 },
                  {
                    scale: 1.04,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                    duration: 3.2,
                  },
                );
                cleanups.push(() => tween.kill());
              });

              cleanups.push(() => {
                stripTween.scrollTrigger?.kill();
                stripTween.kill();
              });
            }

            // ---- Vertical marquee infinite loop ----
            const vertTrack = document.querySelector<HTMLElement>(
              "[data-hero-vert-track]",
            );
            if (vertTrack) {
              const parent = vertTrack.parentElement;
              if (parent) {
                const trackHeight = vertTrack.scrollHeight;
                // Loop through one third of the tripled content for seamless wrap.
                const loopDistance = trackHeight / 3;
                const vertTween = gsap.to(vertTrack, {
                  y: -loopDistance,
                  ease: "none",
                  duration: 28,
                  repeat: -1,
                  modifiers: {
                    y: (v) => `${Number.parseFloat(v) % -loopDistance}px`,
                  },
                });
                cleanups.push(() => vertTween.kill());
              }
            }

            // ---- PICK YOURS handoff reveal (SplitText chars + arrow) ----
            const handoff = document.querySelector<HTMLElement>("[data-hero-handoff]");
            const handoffText = handoff?.querySelector<HTMLElement>(
              "[data-hero-handoff-text]",
            );
            const handoffArrow = handoff?.querySelector<HTMLElement>(
              "[data-hero-handoff-arrow]",
            );
            if (handoff && handoffText && handoffArrow) {
              let split: SplitText | null = null;
              try {
                split = SplitText.create(handoffText, {
                  type: "chars",
                  charsClass: "handoff-char",
                });
              } catch {
                split = null;
              }

              gsap.set(handoff, { autoAlpha: 1 });
              gsap.set(handoffArrow, { autoAlpha: 0, x: -24 });

              const tl = gsap.timeline({
                paused: true,
                defaults: { ease: "power3.out" },
              });

              if (split?.chars?.length) {
                gsap.set(split.chars, { autoAlpha: 0, y: 40 });
                tl.to(split.chars, {
                  y: 0,
                  autoAlpha: 1,
                  duration: 0.65,
                  stagger: 0.04,
                });
              } else {
                gsap.set(handoffText, { autoAlpha: 0, y: 20 });
                tl.to(handoffText, { y: 0, autoAlpha: 1, duration: 0.6 });
              }

              tl.to(
                handoffArrow,
                { x: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" },
                "-=0.2",
              );

              const handoffTrigger = ScrollTrigger.create({
                trigger: handoff,
                start: "top 85%",
                once: true,
                onEnter: () => tl.play(),
              });

              cleanups.push(() => {
                handoffTrigger.kill();
                tl.kill();
                split?.revert();
              });
            }

            ScrollTrigger.refresh();
          })();

          return () => {
            cancelled = true;
            cleanups.forEach((fn) => {
              try {
                fn();
              } catch {
                /* noop */
              }
            });
          };
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [scrollTriggerReady] },
  );

  return <div ref={rootRef} aria-hidden="true" style={{ display: "contents" }} />;
}
