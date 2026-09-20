"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";
import { TransitionLink } from "@/components/layout/page-transition";
import { Button } from "@/components/ui/button";
import { FCHairline } from "@/components/home/fc-hairline";

const steps = [
  {
    n: "01",
    title: "Pick your car",
    body: "Choose from the running collection — or request a model.",
  },
  {
    n: "02",
    title: "Specify the build",
    body: "Backdrop, wood finish, and plate — locked on the product page before you pay.",
  },
  {
    n: "03",
    title: "We build & ship",
    body: "Hand-Built In Multan in seven days. Tracked nationwide.",
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
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: "power3.out",
            stagger: 0.06,
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
      style={{ padding: "clamp(3.5rem, 8vh, 5.5rem) 0" }}
    >
      <div
        className="mx-auto min-w-0"
        style={{ width: "min(calc(100% - 2rem), 80rem)" }}
      >
        <div style={{ marginBottom: 20, maxWidth: 640 }}>
          <p
            className="font-body uppercase text-text-muted"
            style={{
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: "0.28em",
              margin: 0,
              marginBottom: 10,
            }}
          >
            Process
          </p>
          <h2
            className="font-display uppercase text-text-primary"
            style={{
              fontSize: "clamp(1.5rem, 3.2vw, 2.75rem)",
              lineHeight: 1,
              letterSpacing: "0.04em",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Three steps. One frame.{" "}
            <span className="text-brand-bright">Delivered.</span>
          </h2>
        </div>

        <FCHairline />

        <div className="grid grid-cols-1 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.n}
              data-how-step-card
              data-motion-reveal
              className={`flex flex-col min-w-0 ${
                i < steps.length - 1
                  ? "border-b border-border-subtle md:border-b-0 md:border-r"
                  : ""
              }`}
              style={{
                padding: "20px 16px",
                gap: 10,
                opacity: 0,
              }}
            >
              <span
                className="font-display text-brand-bright"
                style={{
                  fontSize: 22,
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                {step.n}
              </span>
              <h3
                className="font-display uppercase text-text-primary"
                style={{
                  fontSize: 17,
                  letterSpacing: "0.04em",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {step.title}
              </h3>
              <p
                className="text-text-muted"
                style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <Button
            render={<TransitionLink href="/shop" />}
            variant="outline"
            className="font-display uppercase inline-flex"
            style={{
              padding: "10px 18px",
              fontSize: 11,
              letterSpacing: "0.14em",
              gap: 8,
              minHeight: 44,
              border: "1px solid var(--border)",
              background: "transparent",
            }}
          >
            Shop the collection →
          </Button>
        </div>
      </div>
    </div>
  );
}
