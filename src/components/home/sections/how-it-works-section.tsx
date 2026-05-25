"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";
import { TransitionLink } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";
import { FCHairline } from "@/components/home/fc-hairline";

const KICKER: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
};

const steps = [
  {
    n: "01",
    title: "Pick your car",
    body: "Choose from the running collection — Porsche, Nissan, Ferrari, Lamborghini, Toyota — or request a model. We source 1:64 scale from Hot Wheels, Tomica Premium, Mini-GT, and the occasional private import.",
  },
  {
    n: "02",
    title: "Specify the build",
    body: "Pick the backdrop, the wood finish, and what the spec plate should say. Five backgrounds, four lacquers, four plate variants. Twenty-thousand configurations from a single SKU.",
  },
  {
    n: "03",
    title: "We build & ship",
    body: "Assembled by hand in Lahore over seven days. Photographed before dispatch. Shipped nationwide via TCS Overnight in a custom rigid foam cradle. Insured, tracked, doorstepped.",
  },
];


export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;
      const root = sectionRef.current;
      if (!root) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-how-step-card]", root);
      if (cards.length !== steps.length) return;

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
    <div
      ref={sectionRef}
      className="bg-bg-surface"
      style={{ padding: "90px 0 100px" }}
    >
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2rem), 80rem)" }}
      >
        {/* Header */}
        <div
          className="grid items-end"
          style={{
            gridTemplateColumns: "1fr auto",
            marginBottom: 48,
            gap: 32,
          }}
        >
          <div style={{ maxWidth: 800 }}>
            <p
              className="font-body text-text-muted"
              style={{ ...KICKER, marginBottom: 24 }}
            >
              Chapter Three · The Process
            </p>
            <h2
              className="font-display uppercase text-text-primary"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 1,
                letterSpacing: "0.04em",
                margin: 0,
                fontWeight: 400,
              }}
            >
              Three steps.
              <br />
              One frame. <span className="text-brand-bright">Delivered.</span>
            </h2>
          </div>
          <p className="font-body text-text-muted" style={KICKER}>
            S001 — S003
          </p>
        </div>

        <FCHairline />

        {/* Steps */}
        <div
          className="grid"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          {steps.map((step, i) => (
            <div
              key={step.n}
              data-how-step-card
              data-motion-reveal
              className="flex flex-col"
              style={{
                padding: "40px 32px 40px 0",
                paddingLeft: i > 0 ? 32 : 0,
                borderRight:
                  i < 2 ? "0.5px solid var(--border-subtle)" : "none",
                gap: 24,
                opacity: 0,
              }}
            >
              <div
                className="flex items-baseline"
                style={{ gap: 16 }}
              >
                <span
                  className="font-display text-brand-bright"
                  style={{
                    fontSize: 40,
                    letterSpacing: "0.04em",
                    lineHeight: 1,
                  }}
                >
                  {step.n}
                </span>
                <span
                  style={{
                    flex: 1,
                    height: 1,
                    background: "var(--border)",
                  }}
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
                {step.title}
              </h3>
              <p
                className="text-text-muted"
                style={{ fontSize: 15, lineHeight: 1.75, margin: 0 }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 56 }}>
          <Button
            render={<TransitionLink href="/shop" />}
            variant="outline"
            className="font-display uppercase inline-flex"
            style={{
              padding: "16px 28px",
              fontSize: 14,
              letterSpacing: "0.14em",
              gap: 10,
              minHeight: 44,
              border: "1px solid var(--border)",
              background: "transparent",
            }}
          >
            Begin a build →
          </Button>
        </div>
      </div>
    </div>
  );
}
