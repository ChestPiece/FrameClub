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

const QUOTE_WORDS = [
  "We", "built", "the", "first", "frame", "for", "ourselves.",
  "A", "Carrera", "GT,", "on", "a", "carbon", "backdrop,",
  "with", "the", "power", "figures", "etched", "onto", "a", "brass", "plate.",
  "It", "sat", "on", "the", "shelf", "for", "a", "week",
  "before", "a", "friend", "asked", "where", "to", "buy", "one.",
  "There", "was", "nowhere", "to", "buy", "one.",
  "So", "we", "built", "him", "one.", "Then", "another.",
];

const TAIL = "Then fifty.";

export function LetterSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const scrollTriggerReady = useScrollTriggerReady();

  useGSAP(
    () => {
      if (!scrollTriggerReady) return;
      const words = quoteRef.current?.querySelectorAll("[data-letter-word]");
      if (!words || words.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(Array.from(words), { opacity: 1, y: 0, clearProps: "all" });
        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.fromTo(
          Array.from(words),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.04,
            scrollTrigger: {
              trigger: quoteRef.current,
              start: "top 80%",
              once: true,
            },
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
      className="bg-bg-deep"
      style={{
        padding: "140px 0",
        borderTop: "0.5px solid var(--border)",
        borderBottom: "0.5px solid var(--border)",
      }}
    >
      <div
        className="mx-auto"
        style={{ width: "min(calc(100% - 2rem), 80rem)" }}
      >
        {/* Header rail */}
        <div
          className="flex flex-wrap items-baseline justify-between"
          style={{ marginBottom: 64, gap: 16 }}
        >
          <p className="font-body text-text-muted" style={KICKER}>
            Chapter Two · From the Workshop
          </p>
          <p className="font-body text-text-muted" style={KICKER}>
            A letter, not a pitch.
          </p>
        </div>

        {/* Pull-quote */}
        <p
          ref={quoteRef}
          className="font-display uppercase text-text-primary"
          style={{
            fontSize: "clamp(1.1rem, 3.4vw, 3rem)",
            lineHeight: 1.2,
            letterSpacing: "0.02em",
            margin: 0,
            fontWeight: 400,
            maxWidth: "60rem",
          }}
        >
          {QUOTE_WORDS.map((w, i) => (
            <span
              key={`${w}-${i}`}
              data-letter-word
              className="inline-block"
              style={{ opacity: 0, marginRight: "0.25em" }}
            >
              {w}
            </span>
          ))}
          <span
            data-letter-word
            className="inline-block text-brand-bright"
            style={{ opacity: 0 }}
          >
            {TAIL}
          </span>
        </p>

        {/* Body 2-col */}
        <div
          className="grid letter-body-grid"
          style={{
            marginTop: 80,
            gap: 80,
            alignItems: "start",
          }}
        >
          <p
            className="font-body text-text-muted"
            style={{ ...KICKER, paddingTop: 12 }}
          >
            Lahore · 2026
          </p>
          <div className="flex flex-col" style={{ gap: 28 }}>
            <p
              className="text-text-primary"
              style={{ fontSize: 17, lineHeight: 1.75, margin: 0 }}
            >
              Frame Club is not a brand. It is a workshop with a waiting list. Every order
              is the same conversation we had the first time — what car, what backdrop,
              what should the plate say. Then we build it.
            </p>
            <p
              className="text-text-muted"
              style={{ fontSize: 17, lineHeight: 1.75, margin: 0 }}
            >
              Same flat price for every car in the collection. No upsells, no variants, no
              warehouse. Seven days from confirmed payment to your door. Sealed glass,
              powder-coated steel, hand-mounted scale model. We photograph each finished
              frame before it ships — that photo is the proof you bought a real object,
              not a render.
            </p>
            <p
              className="font-display uppercase text-text-primary"
              style={{
                marginTop: 24,
                fontSize: 14,
                letterSpacing: "0.18em",
              }}
            >
              — The Workshop
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .letter-body-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .letter-body-grid {
            grid-template-columns: 1fr 1.6fr;
          }
        }
      `}</style>
    </div>
  );
}
