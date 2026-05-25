"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Layers, CarFront, FileText } from "lucide-react";
import { gsap } from "@/lib/animation/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";
import { useStaggerReveal, clipReveal } from "@/lib/animation";
import { Card, CardContent } from "@/components/ui/card";

export function CustomizationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const obsessionRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  // Stagger reveal for the cards inside the section (uses [data-reveal]).
  useStaggerReveal(sectionRef, [], { each: 0.1, distance: 32 });

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (headlineRef.current) {
          gsap.set(headlineRef.current, { clearProps: "letterSpacing" });
        }
        if (obsessionRef.current) {
          obsessionRef.current.style.color = "var(--brand-bright)";
        }
        if (panelRef.current) {
          gsap.set(panelRef.current, { clipPath: "none", autoAlpha: 1, clearProps: "all" });
        }
        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cleanups: Array<() => void> = [];

        // Headline scrub (desktop only) — preserved from prior behavior.
        const inner = gsap.matchMedia();
        inner.add("(min-width: 768px)", () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              end: "center center",
              scrub: 2,
            },
          });

          tl.to(headlineRef.current, { letterSpacing: "0.22em", ease: "none", duration: 1 }, 0).to(
            obsessionRef.current,
            { color: "var(--brand-bright)", ease: "none", duration: 1 },
            0,
          );

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        });
        cleanups.push(() => inner.revert());

        // Horizontal wipe on the cards panel.
        if (panelRef.current) {
          const panel = panelRef.current;
          gsap.set(panel, { clipPath: "inset(0% 100% 0% 0%)", autoAlpha: 1 });
          const st = gsap.context(() => {
            const trigger = gsap.timeline({
              scrollTrigger: {
                trigger: panel,
                start: "top 80%",
                once: true,
              },
            });
            trigger.add(clipReveal(panel, { axis: "x", duration: 1.0, ease: "expo.out" }));
            cleanups.push(() => {
              trigger.scrollTrigger?.kill();
              trigger.kill();
            });
          });
          cleanups.push(() => st.revert());
        }

        return () => {
          cleanups.forEach((fn) => fn());
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady] },
  );

  return (
    <div ref={sectionRef}>
      <h2
        ref={headlineRef}
        className="display-kicker text-center display-fluid mb-10 md:mb-14 flex flex-col items-center leading-none px-1"
      >
        <span>BUILT AROUND YOUR</span>
        <span ref={obsessionRef} className="w-full text-brand">
          OBSESSION.
        </span>
      </h2>

      <div className="relative" ref={panelRef}>
        <svg
          aria-hidden="true"
          data-drawsvg-corners
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polyline points="0,12 0,0 12,0" fill="none" stroke="var(--brand)" strokeWidth="0.5" />
          <polyline points="88,0 100,0 100,12" fill="none" stroke="var(--brand)" strokeWidth="0.5" />
          <polyline points="0,88 0,100 12,100" fill="none" stroke="var(--brand)" strokeWidth="0.5" />
          <polyline points="88,100 100,100 100,88" fill="none" stroke="var(--brand)" strokeWidth="0.5" />
        </svg>
        <div className="grid border border-border/40 md:grid-cols-3">
          <Card
            data-reveal
            className="border-b md:border-b-0 md:border-r border-border/40"
          >
            <CardContent className="p-6 md:p-8">
              <h4 className="display-kicker flex items-center gap-3 text-xl sm:text-2xl mb-6">
                <Layers className="h-6 w-6 shrink-0 text-brand-bright" strokeWidth={1.5} />
                BACKGROUND DESIGN
              </h4>
              <ul className="space-y-4 technical-label text-sm uppercase tracking-[0.12em] sm:tracking-[0.16em] text-text-muted">
                <li>
                  <span className="text-brand mr-2">●</span>Carbon Grid
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Race Topography
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Solid Monolith Tone
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Custom Print Direction
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card
            data-reveal
            className="border-b md:border-b-0 md:border-r border-border/40 bg-brand/10"
          >
            <CardContent className="p-6 md:p-8">
              <h4 className="display-kicker flex items-center gap-3 text-xl sm:text-2xl mb-6">
                <CarFront className="h-6 w-6 shrink-0 text-brand-bright" strokeWidth={1.5} />
                CAR MODEL
              </h4>
              <ul className="space-y-4 technical-label text-sm uppercase tracking-[0.12em] sm:tracking-[0.16em] text-text-muted">
                <li>
                  <span className="text-brand mr-2">●</span>1:64 Scale Focus
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Hot Wheels / Matchbox
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Tomica Premium
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Send Your Own Model
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card data-reveal className="border-0">
            <CardContent className="p-6 md:p-8">
              <h4 className="display-kicker flex items-center gap-3 text-xl sm:text-2xl mb-6">
                <FileText className="h-6 w-6 shrink-0 text-brand-bright" strokeWidth={1.5} />
                PRINTED SPECS
              </h4>
              <ul className="space-y-4 technical-label text-sm uppercase tracking-[0.12em] sm:tracking-[0.16em] text-text-muted">
                <li>
                  <span className="text-brand mr-2">●</span>Performance Data
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Production History
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Owner Tags
                </li>
                <li>
                  <span className="text-brand mr-2">●</span>Edition Numbering
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
