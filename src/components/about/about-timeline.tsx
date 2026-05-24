"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

const KICKER: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
};

const PHASES = [
  {
    n: "01",
    title: "DM ERA",
    body: "Orders captured one by one through Instagram messages. Spec sheets traded in chat. Payment confirmed by screenshot. The frame ships when it ships.",
  },
  {
    n: "02",
    title: "WORKSHOP FLOW",
    body: "A single production line in Lahore. Sourcing, woodwork, mounting, sealing — handled bench to bench. Same hands on every frame. Seven days, every time.",
  },
  {
    n: "03",
    title: "DIGITAL STOREFRONT",
    body: "This site. Configure the frame in two minutes. Pay securely via PayFast. The workshop builds, photographs, and ships nationwide. Nothing else changes.",
  },
];

export function AboutTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;
      const root = sectionRef.current;
      if (!root) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-phase-card]", root);
      if (cards.length !== PHASES.length) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(cards, { opacity: 1, y: 0, clearProps: "all" });
        return () => {};
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: root, start: "top 75%", once: true },
          },
        );
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady] },
  );

  return (
    <section
      ref={sectionRef}
      className="bg-bg-deep"
      style={{
        padding: "140px 0",
        borderTop: "0.5px solid var(--border)",
        borderBottom: "0.5px solid var(--border)",
      }}
    >
      <div className="mx-auto" style={{ width: "min(calc(100% - 2rem), 80rem)" }}>
        <div
          className="grid items-end"
          style={{
            gridTemplateColumns: "1fr auto",
            marginBottom: 64,
            gap: 32,
          }}
        >
          <div style={{ maxWidth: 800 }}>
            <p className="font-body text-text-muted" style={{ ...KICKER, marginBottom: 24 }}>
              Chapter Two · The Journey
            </p>
            <h2
              className="font-display uppercase text-text-primary"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                lineHeight: 1,
                letterSpacing: "0.04em",
                margin: 0,
                fontWeight: 400,
              }}
            >
              Three phases.
              <br />
              One <span className="text-brand-bright">workshop.</span>
            </h2>
          </div>
          <p className="font-body text-text-muted" style={KICKER}>
            P01 — P03
          </p>
        </div>

        <div className="phase-grid">
          {PHASES.map((phase, i) => (
            <div
              key={phase.n}
              data-phase-card
              className="phase-card flex flex-col"
              style={{
                padding: i > 0 ? "0 0 0 40px" : "0 40px 0 0",
                borderRight:
                  i < PHASES.length - 1
                    ? "0.5px solid var(--border-subtle)"
                    : "none",
                gap: 24,
                opacity: 0,
              }}
            >
              <div className="flex items-baseline" style={{ gap: 16 }}>
                <span
                  className="font-display text-brand-bright"
                  style={{ fontSize: 40, letterSpacing: "0.04em", lineHeight: 1 }}
                >
                  {phase.n}
                </span>
                <span
                  style={{ flex: 1, height: 1, background: "var(--border)" }}
                />
              </div>
              <h3
                className="font-display uppercase text-text-primary"
                style={{
                  fontSize: 30,
                  letterSpacing: "0.04em",
                  fontWeight: 400,
                  lineHeight: 1,
                  margin: 0,
                }}
              >
                {phase.title}
              </h3>
              <p
                className="text-text-muted"
                style={{ fontSize: 15, lineHeight: 1.75, margin: 0 }}
              >
                {phase.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .phase-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 56px;
        }
        @media (min-width: 768px) {
          .phase-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0;
          }
        }
        @media (max-width: 767px) {
          .phase-card {
            padding: 0 !important;
            border-right: none !important;
            border-bottom: 0.5px solid var(--border-subtle);
            padding-bottom: 40px !important;
          }
          .phase-card:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </section>
  );
}
