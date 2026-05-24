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

const HEADLINE_LINES = [
  ["A", "frame.", "Not", "a"],
  ["product."],
];
const TAIL = "A workshop.";

export function AboutHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;
      const words = headlineRef.current?.querySelectorAll("[data-about-word]");
      if (!words || words.length === 0) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(Array.from(words), { opacity: 1, y: 0, clearProps: "all" });
        return () => {};
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          Array.from(words),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.06,
          },
        );
        return () => tween.kill();
      });
      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [scrollTriggerReady] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-bg-deep texture-overlay"
      style={{ paddingTop: "calc(7.5rem + 64px)", paddingBottom: 120 }}
    >
      <div
        className="pointer-events-none absolute"
        style={{
          right: "-12vw",
          top: "-12vw",
          width: "60vw",
          height: "60vw",
          background:
            "radial-gradient(circle at top right, color-mix(in srgb, var(--brand) 32%, transparent), transparent 60%)",
        }}
      />
      <div
        className="relative z-10 mx-auto"
        style={{ width: "min(calc(100% - 2rem), 80rem)" }}
      >
        {/* Meta band */}
        <div
          className="grid items-center"
          style={{
            gridTemplateColumns: "auto 1fr auto",
            gap: 32,
            paddingBottom: 28,
            marginBottom: 80,
          }}
        >
          <p className="font-body uppercase text-text-muted" style={KICKER}>
            § The Workshop · 2026
          </p>
          <div style={{ height: 1, background: "var(--border)" }} />
          <p className="font-body uppercase text-text-muted" style={KICKER}>
            Lahore · Pakistan
          </p>
        </div>

        <div style={{ maxWidth: 1100 }}>
          <span
            className="block bg-brand-bright"
            style={{ width: 96, height: 1, marginBottom: 40 }}
          />
          <h1
            ref={headlineRef}
            className="font-display uppercase text-text-primary"
            style={{
              fontSize: "clamp(3rem, 7vw, 6.5rem)",
              lineHeight: 0.95,
              letterSpacing: "0.03em",
              margin: 0,
              fontWeight: 400,
            }}
          >
            {HEADLINE_LINES.map((line, li) => (
              <span key={li} className="block">
                {line.map((w, wi) => (
                  <span
                    key={`${li}-${wi}`}
                    data-about-word
                    className="inline-block"
                    style={{ opacity: 0, marginRight: "0.25em" }}
                  >
                    {w}
                  </span>
                ))}
              </span>
            ))}
            <span className="block">
              <span
                data-about-word
                className="inline-block text-brand-bright"
                style={{ opacity: 0 }}
              >
                {TAIL}
              </span>
            </span>
          </h1>

          <p
            className="text-text-muted"
            style={{
              maxWidth: 560,
              marginTop: 48,
              fontSize: 17,
              lineHeight: 1.75,
            }}
          >
            Frame Club is a single-bench workshop in Lahore building made-to-order
            diecast frames for car obsessives. One flat price. Every piece handbuilt.
            Fifty delivered so far. Zero complaints.
          </p>
        </div>
      </div>
    </section>
  );
}
