"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

const KICKER_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
};

export function WhatIsThisSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (headlineRef.current) {
          gsap.set(headlineRef.current, { yPercent: 0, clearProps: "transform" });
        }
        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const inner = gsap.matchMedia();
        inner.add("(min-width: 768px)", () => {
          const tween = gsap.to(headlineRef.current, {
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.5,
            },
          });
          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        });
        return () => inner.revert();
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady] },
  );

  return (
    <div
      ref={sectionRef}
      className="bg-bg-surface"
      style={{ padding: "100px 0 90px" }}
    >
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2rem), 80rem)" }}
      >
        {/* Header */}
        <div style={{ maxWidth: 920, marginBottom: 56 }}>
          <p
            data-animate-item
            className="font-body text-text-muted"
            style={{ ...KICKER_STYLE, marginBottom: 24 }}
          >
            Chapter One · The Premise
          </p>
          <h2
            ref={headlineRef}
            data-animate-item
            className="font-display uppercase text-text-primary"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.02,
              letterSpacing: "0.04em",
              margin: 0,
              fontWeight: 400,
            }}
          >
            NOT A POSTER.
            <br />
            NOT A TOY.
            <br />
            <span className="text-brand-bright">SOMETHING BUILT.</span>
          </h2>
        </div>

        {/* 2-col grid */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "1fr 1.6fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          <p
            data-animate-item
            className="font-body text-text-muted"
            style={{ ...KICKER_STYLE, paddingTop: 12 }}
          >
            Lahore, Pakistan
          </p>
          <div
            className="flex flex-col"
            style={{ gap: 28 }}
          >
            <p
              data-animate-item
              className="text-text-primary"
              style={{ fontSize: 18, lineHeight: 1.75, margin: 0 }}
            >
              Every Frame Club piece is built to order around a car you&apos;ve chosen and a backdrop you&apos;ve specified. No warehouse stock. No random variants. No assembly line.
            </p>
            <p
              data-animate-item
              className="text-text-muted"
              style={{ fontSize: 18, lineHeight: 1.75, margin: 0 }}
            >
              We source the model, finish the wood, print the backdrop, mount the spec plate, seal the glass — and photograph the result before it leaves Lahore. Fifty frames so far. Zero complaints. Same flat price for every car in the collection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
