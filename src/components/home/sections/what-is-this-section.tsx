"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/animation/gsap-config";
import { HERO_HANDOFF_IMAGE } from "@/lib/shop/product-assets";
import { useScrollTriggerReady } from "@/components/providers/scroll-trigger-environment";

const KICKER_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
};

export function WhatIsThisSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (headlineRef.current) {
          gsap.set(headlineRef.current, { yPercent: 0, clearProps: "transform" });
        }
        if (numberRef.current) {
          gsap.set(numberRef.current, { yPercent: 0, clearProps: "transform" });
        }
        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const inner = gsap.matchMedia();
        inner.add("(min-width: 768px)", () => {
          const tweens = [
            gsap.to(headlineRef.current, {
              yPercent: -8,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5,
              },
            }),
            gsap.to(numberRef.current, {
              yPercent: -24,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            }),
          ];
          return () => {
            tweens.forEach((t) => {
              t.scrollTrigger?.kill();
              t.kill();
            });
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
      className="relative bg-bg-surface"
      style={{ paddingTop: 64, paddingBottom: 64 }}
    >
      {/* Giant section number (decorative) */}
      <span
        ref={numberRef}
        aria-hidden="true"
        className="font-display text-text-primary pointer-events-none select-none"
        style={{
          position: "absolute",
          top: 24,
          right: "5vw",
          fontSize: "clamp(4.5rem, 12vw, 11rem)",
          lineHeight: 0.85,
          letterSpacing: "-0.02em",
          color: "color-mix(in srgb, var(--text-primary) 5%, transparent)",
          fontWeight: 400,
          margin: 0,
        }}
      >
        01
      </span>

      <div
        className="mx-auto relative"
        style={{ width: "min(calc(100% - 2rem), 80rem)" }}
      >
        {/* Header */}
        <div style={{ maxWidth: 820, marginBottom: 32 }}>
          <p
            data-animate-item
            className="font-body text-text-muted"
            style={{ ...KICKER_STYLE, marginBottom: 12, fontSize: 10 }}
          >
            Chapter One · The Premise
          </p>
          <h2
            ref={headlineRef}
            data-animate-item
            className="font-display uppercase text-text-primary"
            style={{
              fontSize: "clamp(1.5rem, 3.2vw, 2.75rem)",
              lineHeight: 1.02,
              letterSpacing: "0.02em",
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

        {/* Asymmetric two-col: image left, copy right — centered, no dead space */}
        <div
          className="grid items-center"
          style={{
            gridTemplateColumns: "minmax(0, 0.85fr) minmax(0, 1.4fr)",
            gap: 32,
          }}
        >
          <div
            data-animate-item
            className="relative mx-auto w-full"
            style={{
              maxWidth: 320,
              aspectRatio: "4 / 5",
              background: "var(--bg-base)",
              borderBottom: "1px solid color-mix(in srgb, var(--brand-bright) 50%, transparent)",
              overflow: "hidden",
            }}
          >
            <Image
              src={HERO_HANDOFF_IMAGE}
              alt="A Frame Club diecast build, photographed in the Lahore workshop"
              fill
              sizes="(max-width: 768px) 80vw, 320px"
              className="object-contain"
            />
            <p
              className="font-body uppercase text-text-primary"
              style={{
                position: "absolute",
                left: 10,
                bottom: 10,
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: "0.28em",
                background: "rgba(14,14,14,0.78)",
                padding: "5px 8px",
                margin: 0,
              }}
            >
              Lahore · Workshop Floor
            </p>
          </div>

          <div className="flex flex-col" style={{ gap: 14 }}>
            <p
              data-animate-item
              className="font-body text-text-muted"
              style={{ ...KICKER_STYLE, fontSize: 10 }}
            >
              Lahore, Pakistan
            </p>
            <p
              data-animate-item
              className="text-text-primary"
              style={{ fontSize: 15, lineHeight: 1.55, margin: 0 }}
            >
              Every Frame Club piece is built to order around a car you&apos;ve chosen and a backdrop you&apos;ve specified. No warehouse stock. No random variants. No assembly line.
            </p>
            <p
              data-animate-item
              className="text-text-muted"
              style={{ fontSize: 14, lineHeight: 1.6, margin: 0 }}
            >
              We source the model, finish the wood, print the backdrop, mount the spec plate, seal the glass — and photograph the result before it leaves Lahore. Fifty frames so far. Zero complaints. Same flat price for every car in the collection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
